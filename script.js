// =========================================================
// LÁ NO MEU QUINTAL — comportamento do site
// Apenas HTML, CSS e JavaScript. Os dados vêm de receitas.js.
// =========================================================

(function () {
  "use strict";

  const IMAGEM_PADRAO = "assets/logo.jpeg";

  // ---------- Utilidades ----------

  // Cria elementos sem usar innerHTML (evita injeção de HTML pelos dados).
  function el(tag, atributos, filhos) {
    const no = document.createElement(tag);
    Object.entries(atributos || {}).forEach(([chave, valor]) => {
      if (valor === undefined || valor === null || valor === false) return;
      if (chave === "texto") no.textContent = valor;
      else no.setAttribute(chave, valor === true ? "" : valor);
    });
    (filhos || []).forEach((filho) => {
      if (filho) no.appendChild(typeof filho === "string" ? document.createTextNode(filho) : filho);
    });
    return no;
  }

  // Minúsculas e sem acento: "feijao" encontra "feijão".
  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function texto(valor, padrao) {
    return typeof valor === "string" && valor.trim() ? valor.trim() : padrao;
  }

  function lista(valor) {
    return Array.isArray(valor)
      ? valor.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
      : [];
  }

  function comFallbackDeImagem(img) {
    img.addEventListener("error", function aoFalhar() {
      img.removeEventListener("error", aoFalhar);
      img.src = IMAGEM_PADRAO;
    });
    return img;
  }

  // Valida e completa cada receita. Receita quebrada não derruba o site.
  function prepararReceitas() {
    const origem = typeof receitas !== "undefined" && Array.isArray(receitas) ? receitas : [];
    const ids = new Set();
    const prontas = [];

    origem.forEach((r, posicao) => {
      if (!r || typeof r !== "object") return;

      const titulo = texto(r.titulo, "");
      if (!titulo) {
        console.warn(`receitas.js: item ${posicao + 1} ignorado (sem título).`);
        return;
      }

      let id = texto(r.id, "") || normalizar(titulo).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!id || ids.has(id)) {
        let contador = 2;
        const base = id || "receita";
        while (ids.has(`${base}-${contador}`)) contador++;
        console.warn(`receitas.js: id repetido ou vazio em "${titulo}"; usando "${base}-${contador}".`);
        id = `${base}-${contador}`;
      }
      ids.add(id);

      prontas.push({
        id,
        titulo,
        categoria: texto(r.categoria, "Outras"),
        resumo: texto(r.resumo, ""),
        imagem: texto(r.imagem, IMAGEM_PADRAO),
        tempo: texto(r.tempo, "—"),
        porcoes: texto(r.porcoes, "—"),
        dificuldade: texto(r.dificuldade, "—"),
        ingredientes: lista(r.ingredientes),
        modoDePreparo: lista(r.modoDePreparo),
        dica: texto(r.dica, ""),
      });
    });

    return prontas;
  }

  // Valida as dicas de dicas.js. Dica quebrada não derruba a página.
  function prepararDicas() {
    const origem = typeof dicas !== "undefined" && Array.isArray(dicas) ? dicas : [];
    const prontas = [];
    origem.forEach((d, posicao) => {
      if (!d || typeof d !== "object") return;
      const titulo = texto(d.titulo, "");
      const corpo = texto(d.texto, "");
      if (!titulo || !corpo) {
        console.warn(`dicas.js: item ${posicao + 1} ignorado (precisa de titulo e texto).`);
        return;
      }
      prontas.push({ titulo, texto: corpo, categoria: texto(d.categoria, "Outras") });
    });
    return prontas;
  }

  // ---------- Início ----------

  document.addEventListener("DOMContentLoaded", () => {
    const anoEl = document.getElementById("ano");
    if (anoEl) anoEl.textContent = new Date().getFullYear();

    iniciarMenu();

    const todas = prepararReceitas();
    if (document.getElementById("grade")) iniciarPaginaReceitas(todas);
    if (document.getElementById("gradeDicas")) iniciarPaginaDicas(prepararDicas());
    if (document.getElementById("receitaTopo")) iniciarPaginaReceita(todas);
  });

  // ---------- Menu mobile ----------

  function iniciarMenu() {
    const botao = document.getElementById("botaoMenu");
    const nav = document.getElementById("navegacao");
    if (!botao || !nav) return;

    function definir(aberto) {
      nav.classList.toggle("aberto", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      botao.textContent = aberto ? "✕" : "☰";
    }

    botao.addEventListener("click", () => definir(!nav.classList.contains("aberto")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) definir(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("aberto")) {
        definir(false);
        botao.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("aberto") && !nav.contains(e.target) && !botao.contains(e.target)) definir(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) definir(false);
    });
  }

  function criarCartao(receita) {
    const imagem = comFallbackDeImagem(
      el("img", { src: receita.imagem, alt: receita.titulo, loading: "lazy", width: "400", height: "300" })
    );
    return el("a", { href: `receita.html?id=${encodeURIComponent(receita.id)}`, class: "cartao-receita" }, [
      el("div", { class: "cartao-imagem" }, [imagem]),
      el("div", { class: "cartao-corpo" }, [
        el("span", { class: "cartao-categoria", texto: receita.categoria }),
        el("h3", { texto: receita.titulo }),
        receita.resumo ? el("p", { texto: receita.resumo }) : null,
        el("div", { class: "cartao-meta" }, [
          el("span", { texto: `⏱ ${receita.tempo}` }),
          el("span", { texto: `🍽 ${receita.porcoes}` }),
        ]),
      ]),
    ]);
  }

  // ---------- Página de receitas ----------

  function iniciarPaginaReceitas(todas) {
    const grade = document.getElementById("grade");
    const filtrosEl = document.getElementById("filtros");
    const campoBusca = document.getElementById("campoBusca");
    const botaoLimpar = document.getElementById("limparBusca");
    const contagem = document.getElementById("contagem");

    const categorias = ["Todas", ...new Set(todas.map((r) => r.categoria))];
    const params = new URLSearchParams(window.location.search);

    let categoriaAtiva = categorias.includes(params.get("categoria")) ? params.get("categoria") : "Todas";
    let termoBusca = (params.get("q") || "").trim();
    campoBusca.value = termoBusca;

    const chips = categorias.map((categoria) => {
      const chip = el("button", { type: "button", class: "filtro-chip", texto: categoria });
      chip.addEventListener("click", () => {
        categoriaAtiva = categoria;
        atualizarChips();
        renderizar();
      });
      filtrosEl.appendChild(chip);
      return chip;
    });

    function atualizarChips() {
      chips.forEach((chip) => {
        const ativo = chip.textContent === categoriaAtiva;
        chip.classList.toggle("ativo", ativo);
        chip.setAttribute("aria-pressed", String(ativo));
      });
    }

    let atraso;
    campoBusca.addEventListener("input", () => {
      clearTimeout(atraso);
      atraso = setTimeout(() => {
        termoBusca = campoBusca.value.trim();
        renderizar();
      }, 120);
      botaoLimpar.hidden = !campoBusca.value;
    });
    campoBusca.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
    botaoLimpar.addEventListener("click", () => {
      campoBusca.value = "";
      termoBusca = "";
      botaoLimpar.hidden = true;
      campoBusca.focus();
      renderizar();
    });

    function sincronizarEndereco() {
      const novo = new URLSearchParams();
      if (categoriaAtiva !== "Todas") novo.set("categoria", categoriaAtiva);
      if (termoBusca) novo.set("q", termoBusca);
      const consulta = novo.toString();
      try {
        history.replaceState(null, "", window.location.pathname + (consulta ? "?" + consulta : "") + window.location.hash);
      } catch (erro) {
        /* abrir direto do arquivo (file://) pode bloquear — não é problema */
      }
    }

    function renderizar() {
      const termos = normalizar(termoBusca).split(/\s+/).filter(Boolean);

      const filtradas = todas.filter((r) => {
        if (categoriaAtiva !== "Todas" && r.categoria !== categoriaAtiva) return false;
        const alvo = normalizar([r.titulo, r.resumo, r.categoria, r.ingredientes.join(" ")].join(" "));
        return termos.every((t) => alvo.includes(t));
      });

      grade.textContent = "";

      if (todas.length === 0) {
        grade.appendChild(el("p", { class: "sem-resultados", texto: "Ainda não há receitas publicadas. Volte em breve!" }));
        contagem.textContent = "";
        return;
      }

      if (filtradas.length === 0) {
        grade.appendChild(el("p", { class: "sem-resultados", texto: "Nenhuma receita encontrada. Tente outro termo ou categoria." }));
        contagem.textContent = "Nenhuma receita encontrada.";
      } else {
        const fragmento = document.createDocumentFragment();
        filtradas.forEach((r) => fragmento.appendChild(criarCartao(r)));
        grade.appendChild(fragmento);
        contagem.textContent = filtradas.length === 1 ? "1 receita encontrada" : `${filtradas.length} receitas encontradas`;
      }

      sincronizarEndereco();
    }

    botaoLimpar.hidden = !campoBusca.value;
    atualizarChips();
    renderizar();
  }

  // ---------- Página de dicas ----------

  function iniciarPaginaDicas(todas) {
    const grade = document.getElementById("gradeDicas");
    const filtrosEl = document.getElementById("filtros");
    const campoBusca = document.getElementById("campoBusca");
    const botaoLimpar = document.getElementById("limparBusca");
    const contagem = document.getElementById("contagem");

    const categorias = ["Todas", ...new Set(todas.map((d) => d.categoria))];
    const params = new URLSearchParams(window.location.search);

    let categoriaAtiva = categorias.includes(params.get("categoria")) ? params.get("categoria") : "Todas";
    let termoBusca = (params.get("q") || "").trim();
    campoBusca.value = termoBusca;

    const chips = categorias.map((categoria) => {
      const chip = el("button", { type: "button", class: "filtro-chip", texto: categoria });
      chip.addEventListener("click", () => {
        categoriaAtiva = categoria;
        atualizarChips();
        renderizar();
      });
      filtrosEl.appendChild(chip);
      return chip;
    });

    function atualizarChips() {
      chips.forEach((chip) => {
        const ativo = chip.textContent === categoriaAtiva;
        chip.classList.toggle("ativo", ativo);
        chip.setAttribute("aria-pressed", String(ativo));
      });
    }

    let atraso;
    campoBusca.addEventListener("input", () => {
      clearTimeout(atraso);
      atraso = setTimeout(() => {
        termoBusca = campoBusca.value.trim();
        renderizar();
      }, 120);
      botaoLimpar.hidden = !campoBusca.value;
    });
    campoBusca.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
    botaoLimpar.addEventListener("click", () => {
      campoBusca.value = "";
      termoBusca = "";
      botaoLimpar.hidden = true;
      campoBusca.focus();
      renderizar();
    });

    function sincronizarEndereco() {
      const novo = new URLSearchParams();
      if (categoriaAtiva !== "Todas") novo.set("categoria", categoriaAtiva);
      if (termoBusca) novo.set("q", termoBusca);
      const consulta = novo.toString();
      try {
        history.replaceState(null, "", window.location.pathname + (consulta ? "?" + consulta : "") + window.location.hash);
      } catch (erro) {
        /* abrir direto do arquivo (file://) pode bloquear — não é problema */
      }
    }

    const ICONES = { Cozinha: "🍳", Despensa: "🫙", Quintal: "🌱", Economia: "💰" };

    function criarCartaoDica(dica) {
      return el("article", { class: "cartao-dica" }, [
        el("span", { class: "dica-icone", "aria-hidden": "true", texto: ICONES[dica.categoria] || "💡" }),
        el("span", { class: "cartao-categoria", texto: dica.categoria }),
        el("h3", { texto: dica.titulo }),
        el("p", { texto: dica.texto }),
      ]);
    }

    function renderizar() {
      const termos = normalizar(termoBusca).split(/\s+/).filter(Boolean);

      const filtradas = todas.filter((d) => {
        if (categoriaAtiva !== "Todas" && d.categoria !== categoriaAtiva) return false;
        const alvo = normalizar([d.titulo, d.texto, d.categoria].join(" "));
        return termos.every((t) => alvo.includes(t));
      });

      grade.textContent = "";

      if (todas.length === 0) {
        grade.appendChild(el("p", { class: "sem-resultados", texto: "Ainda não há dicas publicadas. Volte em breve!" }));
        contagem.textContent = "";
        return;
      }

      if (filtradas.length === 0) {
        grade.appendChild(el("p", { class: "sem-resultados", texto: "Nenhuma dica encontrada. Tente outro termo ou categoria." }));
        contagem.textContent = "Nenhuma dica encontrada.";
      } else {
        const fragmento = document.createDocumentFragment();
        filtradas.forEach((d) => fragmento.appendChild(criarCartaoDica(d)));
        grade.appendChild(fragmento);
        contagem.textContent = filtradas.length === 1 ? "1 dica encontrada" : `${filtradas.length} dicas encontradas`;
      }

      sincronizarEndereco();
    }

    botaoLimpar.hidden = !campoBusca.value;
    atualizarChips();
    renderizar();
  }

  // ---------- Página de receita ----------

  function iniciarPaginaReceita(todas) {
    const id = new URLSearchParams(window.location.search).get("id");
    const indice = todas.findIndex((r) => r.id === id);
    const receita = indice > -1 ? todas[indice] : null;

    const topo = document.getElementById("receitaTopo");
    const conteudo = document.getElementById("receitaConteudo");
    const navegacao = document.getElementById("receitaNavegacao");

    topo.textContent = "";

    if (!receita) {
      document.title = "Receita não encontrada — Lá no meu Quintal";
      topo.appendChild(
        el("div", { class: "receita-info" }, [
          el("h1", { texto: "Receita não encontrada" }),
          el("p", { texto: "Essa receita pode ter mudado de endereço ou ainda não foi publicada." }),
          el("p", {}, [el("a", { href: "receitas.html", texto: "← Voltar para todas as receitas" })]),
        ])
      );
      conteudo.remove();
      navegacao.remove();
      return;
    }

    document.title = `${receita.titulo} — Lá no meu Quintal`;
    const meta = document.getElementById("metaDescricao");
    if (meta && receita.resumo) meta.setAttribute("content", receita.resumo);
    document.getElementById("trilhaCategoria").textContent = receita.categoria;

    // Topo
    const imagem = comFallbackDeImagem(el("img", { src: receita.imagem, alt: receita.titulo }));
    const botaoCompartilhar = el("button", { type: "button", class: "botao-acao", texto: "Compartilhar" });
    const botaoImprimir = el("button", { type: "button", class: "botao-acao", texto: "Imprimir" });
    const aviso = el("span", { class: "aviso-acao", role: "status", "aria-live": "polite" });

    botaoImprimir.addEventListener("click", () => window.print());
    botaoCompartilhar.addEventListener("click", async () => {
      const dados = { title: receita.titulo, text: receita.resumo, url: window.location.href };
      try {
        if (navigator.share) {
          await navigator.share(dados);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          avisar("Link copiado!");
        } else {
          avisar("Copie o endereço na barra do navegador.");
        }
      } catch (erro) {
        if (erro && erro.name !== "AbortError") avisar("Não foi possível compartilhar.");
      }
    });

    let temporizador;
    function avisar(mensagem) {
      aviso.textContent = mensagem;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => (aviso.textContent = ""), 2500);
    }

    topo.appendChild(el("div", { class: "receita-imagem" }, [imagem]));
    topo.appendChild(
      el("div", { class: "receita-info" }, [
        el("span", { class: "receita-categoria", texto: receita.categoria }),
        el("h1", { texto: receita.titulo }),
        receita.resumo ? el("p", { texto: receita.resumo }) : null,
        el("div", { class: "receita-meta" }, [
          blocoMeta(receita.tempo, "Tempo"),
          blocoMeta(receita.porcoes, "Rendimento"),
          blocoMeta(receita.dificuldade, "Dificuldade"),
        ]),
        el("div", { class: "receita-acoes" }, [botaoCompartilhar, botaoImprimir, aviso]),
      ])
    );

    // Conteúdo
    conteudo.textContent = "";

    const colunaIngredientes = el("div", {}, [el("h2", { class: "bloco-titulo", texto: "Ingredientes" })]);
    if (receita.ingredientes.length) {
      const ul = el("ul", { class: "lista-ingredientes" });
      receita.ingredientes.forEach((item, i) => {
        const marcador = el("input", { type: "checkbox", id: `ing-${i}` });
        ul.appendChild(el("li", {}, [el("label", { for: `ing-${i}` }, [marcador, el("span", { texto: item })])]));
      });
      colunaIngredientes.appendChild(ul);
      colunaIngredientes.appendChild(el("p", { class: "nota-lista", texto: "Toque nos itens para ir marcando o que já separou." }));
    } else {
      colunaIngredientes.appendChild(el("p", { class: "nota-lista", texto: "Ingredientes não informados." }));
    }

    const colunaPreparo = el("div", {}, [el("h2", { class: "bloco-titulo", texto: "Modo de preparo" })]);
    if (receita.modoDePreparo.length) {
      const ol = el("ol", { class: "lista-modo" });
      receita.modoDePreparo.forEach((passo) => ol.appendChild(el("li", { texto: passo })));
      colunaPreparo.appendChild(ol);
    } else {
      colunaPreparo.appendChild(el("p", { class: "nota-lista", texto: "Modo de preparo não informado." }));
    }
    if (receita.dica) {
      colunaPreparo.appendChild(
        el("div", { class: "dica" }, [el("strong", { texto: "Dica da casa: " }), receita.dica])
      );
    }

    conteudo.appendChild(colunaIngredientes);
    conteudo.appendChild(colunaPreparo);

    // Anterior / próxima
    navegacao.textContent = "";
    const anterior = todas.length > 1 ? todas[(indice - 1 + todas.length) % todas.length] : null;
    const proxima = todas.length > 1 ? todas[(indice + 1) % todas.length] : null;
    if (anterior) navegacao.appendChild(linkReceita(anterior, "← Anterior", "anterior"));
    if (proxima) navegacao.appendChild(linkReceita(proxima, "Próxima →", "proxima"));
  }

  function blocoMeta(valor, rotulo) {
    return el("div", {}, [el("strong", { texto: valor }), el("span", { texto: rotulo })]);
  }

  function linkReceita(receita, rotulo, classe) {
    return el("a", { href: `receita.html?id=${encodeURIComponent(receita.id)}`, class: `receita-vizinha ${classe}` }, [
      el("small", { texto: rotulo }),
      el("span", { texto: receita.titulo }),
    ]);
  }
})();
