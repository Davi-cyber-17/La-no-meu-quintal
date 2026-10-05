/*
  RECEITAS — "Lá no meu Quintal"
  ---------------------------------------------------
  Para adicionar uma receita nova, copie o modelo abaixo,
  cole no final da lista (antes do ] final) e preencha os campos.
  Não precisa mexer em mais nada — o site lê tudo daqui.

  {
    id: "identificador-unico-sem-espaco",
    titulo: "Nome da receita",
    categoria: "Doces" | "Salgados" | "Bebidas" | "Massas" | "Conservas",
    resumo: "Uma frase curta e gostosa sobre a receita.",
    imagem: "assets/logo.jpeg",   // troque pelo caminho da foto da receita
    tempo: "30 min",
    porcoes: "6 porções",
    dificuldade: "Fácil" | "Média" | "Difícil",
    ingredientes: [
      "2 xícaras de farinha de trigo",
      "1 colher (chá) de fermento"
    ],
    modoDePreparo: [
      "Misture os ingredientes secos.",
      "Adicione o restante e leve ao forno por 40 minutos."
    ],
    dica: "Uma observação da vovó, uma substituição, algo assim. (opcional)"
  }
*/

const receitas = [
  {
    id: "bolo-de-fuba-cremoso",
    titulo: "Bolo de fubá cremoso",
    categoria: "Doces",
    resumo: "Aquele bolo de fim de tarde, com casquinha dourada e miolo molhadinho.",
    imagem: "assets/logo.jpeg",
    tempo: "1h",
    porcoes: "10 porções",
    dificuldade: "Fácil",
    ingredientes: [
      "3 ovos",
      "2 xícaras de açúcar",
      "1 xícara de óleo",
      "2 xícaras de leite",
      "1 xícara de fubá",
      "1 xícara de farinha de trigo",
      "1 colher (sopa) de fermento em pó",
      "1 colher (chá) de erva-doce (opcional)"
    ],
    modoDePreparo: [
      "Bata no liquidificador os ovos, o açúcar, o óleo e o leite.",
      "Acrescente o fubá e a farinha, batendo até incorporar.",
      "Adicione o fermento por último, misturando com uma colher.",
      "Despeje em uma forma untada e leve ao forno preaquecido a 180°C por cerca de 45 minutos.",
      "Espere amornar antes de desenformar."
    ],
    dica: "Fica ainda melhor gelado, no dia seguinte, com um café coado."
  },
  {
    id: "feijao-tropeiro-de-quintal",
    titulo: "Feijão tropeiro de quintal",
    categoria: "Salgados",
    resumo: "Feijão soltinho com bastante couve, bacon e um ovo frito por cima.",
    imagem: "assets/logo.jpeg",
    tempo: "50 min",
    porcoes: "6 porções",
    dificuldade: "Média",
    ingredientes: [
      "3 xícaras de feijão cozido, sem caldo",
      "200 g de bacon em cubos",
      "200 g de linguiça calabresa em rodelas",
      "2 ovos",
      "1 xícara de couve fatiada fininha",
      "1 xícara de farinha de mandioca",
      "1 cebola picada",
      "2 dentes de alho picados",
      "Cheiro-verde a gosto"
    ],
    modoDePreparo: [
      "Frite o bacon até dourar e reserve, deixando um pouco da gordura na panela.",
      "Nessa gordura, refogue a linguiça, a cebola e o alho.",
      "Adicione o feijão e mexa em fogo médio por uns 5 minutos.",
      "Frite os ovos à parte, mexendo para virar 'ovo mexido' grosso, e junte ao feijão.",
      "Acrescente a couve e a farinha aos poucos, mexendo sempre para não empelotar.",
      "Finalize com o bacon reservado e o cheiro-verde."
    ],
    dica: "A farinha deve entrar aos poucos — cada marca absorve o caldo de um jeito diferente."
  },
  {
    id: "brigadeiro-de-panela",
    titulo: "Brigadeiro de panela",
    categoria: "Doces",
    resumo: "O clássico de toda festa, enrolado na hora ou comido de colher ainda quente.",
    imagem: "assets/logo.jpeg",
    tempo: "20 min",
    porcoes: "20 unidades",
    dificuldade: "Fácil",
    ingredientes: [
      "1 lata de leite condensado",
      "1 colher (sopa) de manteiga",
      "3 colheres (sopa) de chocolate em pó",
      "Granulado para enrolar"
    ],
    modoDePreparo: [
      "Misture todos os ingredientes numa panela, em fogo baixo.",
      "Mexa sem parar até desgrudar do fundo da panela.",
      "Deixe esfriar num prato untado por cerca de 1 hora.",
      "Unte as mãos com manteiga e enrole as bolinhas.",
      "Passe no granulado."
    ],
    dica: "Se preferir de colher, sirva morno, direto da panela, num potinho."
  },
  {
    id: "suco-de-maracuja-com-hortela",
    titulo: "Suco de maracujá com hortelã",
    categoria: "Bebidas",
    resumo: "Refrescante, levemente azedinho, com um toque de hortelã do quintal.",
    imagem: "assets/logo.jpeg",
    tempo: "10 min",
    porcoes: "4 copos",
    dificuldade: "Fácil",
    ingredientes: [
      "2 maracujás (polpa)",
      "1 litro de água gelada",
      "4 colheres (sopa) de açúcar, ou a gosto",
      "Folhas de hortelã a gosto",
      "Gelo"
    ],
    modoDePreparo: [
      "Bata a polpa do maracujá com a água por 10 segundos, só para soltar a polpa das sementes.",
      "Coe para separar as sementes.",
      "Volte ao liquidificador com o açúcar, a hortelã e o gelo, e bata rapidamente.",
      "Sirva em seguida."
    ],
    dica: "Bater pouco tempo evita triturar as sementes e deixar o suco amargo."
  }

  // 👉 novas receitas entram aqui embaixo, seguindo o modelo do topo do arquivo
];
