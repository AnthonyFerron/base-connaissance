const { PrismaClient } = require("./generated");
const prisma = new PrismaClient();

async function main() {
  console.log("Début du seeding...");

  // Créer les générations
  const generations = await Promise.all([
    prisma.generation.upsert({
      where: { name: "Kanto" },
      update: {},
      create: {
        name: "Kanto",
        generationNumber: 1,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Johto" },
      update: {},
      create: {
        name: "Johto",
        generationNumber: 2,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Hoenn" },
      update: {},
      create: {
        name: "Hoenn",
        generationNumber: 3,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Sinnoh" },
      update: {},
      create: {
        name: "Sinnoh",
        generationNumber: 4,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Unys" },
      update: {},
      create: {
        name: "Unys",
        generationNumber: 5,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Kalos" },
      update: {},
      create: {
        name: "Kalos",
        generationNumber: 6,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Alola" },
      update: {},
      create: {
        name: "Alola",
        generationNumber: 7,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Galar" },
      update: {},
      create: {
        name: "Galar",
        generationNumber: 8,
      },
    }),
    prisma.generation.upsert({
      where: { name: "Paldea" },
      update: {},
      create: {
        name: "Paldea",
        generationNumber: 9,
      },
    }),
  ]);

  console.log("Générations créées:", generations.length);

  // Créer les types
  const types = await Promise.all([
    prisma.type.upsert({
      where: { name: "Plante" },
      update: {},
      create: {
        name: "Plante",
        color: "#78C850",
        image: "/types/grass.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Poison" },
      update: {},
      create: {
        name: "Poison",
        color: "#A040A0",
        image: "/types/poison.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Feu" },
      update: {},
      create: {
        name: "Feu",
        color: "#F08030",
        image: "/types/fire.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Eau" },
      update: {},
      create: {
        name: "Eau",
        color: "#6890F0",
        image: "/types/water.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Électrik" },
      update: {},
      create: {
        name: "Électrik",
        color: "#F8D030",
        image: "/types/electric.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Psy" },
      update: {},
      create: {
        name: "Psy",
        color: "#F85888",
        image: "/types/psychic.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Normal" },
      update: {},
      create: {
        name: "Normal",
        color: "#A8A878",
        image: "/types/normal.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Combat" },
      update: {},
      create: {
        name: "Combat",
        color: "#C03028",
        image: "/types/fighting.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Vol" },
      update: {},
      create: {
        name: "Vol",
        color: "#A890F0",
        image: "/types/flying.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Sol" },
      update: {},
      create: {
        name: "Sol",
        color: "#E0C068",
        image: "/types/ground.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Roche" },
      update: {},
      create: {
        name: "Roche",
        color: "#B8A038",
        image: "/types/rock.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Insecte" },
      update: {},
      create: {
        name: "Insecte",
        color: "#A8B820",
        image: "/types/bug.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Spectre" },
      update: {},
      create: {
        name: "Spectre",
        color: "#705898",
        image: "/types/ghost.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Acier" },
      update: {},
      create: {
        name: "Acier",
        color: "#B8B8D0",
        image: "/types/steel.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Dragon" },
      update: {},
      create: {
        name: "Dragon",
        color: "#7038F8",
        image: "/types/dragon.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Ténèbres" },
      update: {},
      create: {
        name: "Ténèbres",
        color: "#705848",
        image: "/types/dark.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Fée" },
      update: {},
      create: {
        name: "Fée",
        color: "#EE99AC",
        image: "/types/fairy.svg",
      },
    }),
    prisma.type.upsert({
      where: { name: "Glace" },
      update: {},
      create: {
        name: "Glace",
        color: "#98D8D8",
        image: "/types/ice.svg",
      },
    }),
  ]);

  console.log("Types créés:", types.length);

  // Créer un utilisateur admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@pokedoc.com" },
    update: {},
    create: {
      email: "admin@pokedoc.com",
      name: "Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const antho = await prisma.user.upsert({
    where: { email: "anthony.ferron74@gmail.com" },
    update: {},
    create: {
      email: "anthony.ferron74@gmail.com",
      name: "Antho",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("Utilisateur admin créé:", adminUser.name, antho.name);

  // Créer quelques Pokémon
  const bulbizarre = await prisma.pokemon.upsert({
    where: { name: "Bulbizarre" },
    update: {},
    create: {
      name: "Bulbizarre",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png",
      content: {
        idpokedex: 1,
        description:
          "Bulbizarre passe son temps à faire la sieste sous le soleil. Il y a une graine sur son dos. En absorbant les rayons du soleil, la graine grandit progressivement.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [
          { id: types.find((t) => t.name === "Plante")?.id },
          { id: types.find((t) => t.name === "Poison")?.id },
        ],
      },
    },
  });

  const salameche = await prisma.pokemon.upsert({
    where: { name: "Salamèche" },
    update: {},
    create: {
      name: "Salamèche",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png",
      content: {
        idpokedex: 4,
        description:
          "Salamèche préfère les endroits chauds. En cas de pluie, de la vapeur se forme autour de l'extrémité de sa queue.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Feu")?.id }],
      },
    },
  });

  const reptincel = await prisma.pokemon.upsert({
    where: { name: "Reptincel" },
    update: {},
    create: {
      name: "Reptincel",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/005.png",
      content: {
        idpokedex: 5,
        description:
          "En agitant sa queue, Reptincel peut élever la température autour de lui à des niveaux torrides. Ses griffes sont très aiguisées.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Feu")?.id }],
      },
    },
  });

  const dracaufeu = await prisma.pokemon.upsert({
    where: { name: "Dracaufeu" },
    update: {},
    create: {
      name: "Dracaufeu",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/006.png",
      content: {
        idpokedex: 6,
        description:
          "Dracaufeu parcourt les cieux pour trouver des adversaires à sa mesure. Il crache un feu si chaud qu'il peut faire fondre n'importe quoi.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [
          { id: types.find((t) => t.name === "Feu")?.id },
          { id: types.find((t) => t.name === "Vol")?.id },
        ],
      },
    },
  });

  const carapuce = await prisma.pokemon.upsert({
    where: { name: "Carapuce" },
    update: {},
    create: {
      name: "Carapuce",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png",
      content: {
        idpokedex: 7,
        description:
          "La carapace de Carapuce se solidifie après sa naissance et devient plus résistante. Ce Pokémon crache de puissants jets d'eau.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Eau")?.id }],
      },
    },
  });

  const carabaffe = await prisma.pokemon.upsert({
    where: { name: "Carabaffe" },
    update: {},
    create: {
      name: "Carabaffe",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/008.png",
      content: {
        idpokedex: 8,
        description:
          "Carabaffe a une queue recouverte d'une épaisse fourrure qui devient de plus en plus foncée avec l'âge. Les égratignures sur sa carapace témoignent de son expérience au combat.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Eau")?.id }],
      },
    },
  });

  const tortank = await prisma.pokemon.upsert({
    where: { name: "Tortank" },
    update: {},
    create: {
      name: "Tortank",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/009.png",
      content: {
        idpokedex: 9,
        description:
          "Tortank dispose de canons à eau qui émergent de sa carapace. Ils sont très précis et peuvent toucher des cibles à plus de 160 kilomètres.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Eau")?.id }],
      },
    },
  });

  const pikachu = await prisma.pokemon.upsert({
    where: { name: "Pikachu" },
    update: {},
    create: {
      name: "Pikachu",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png",
      content: {
        idpokedex: 25,
        description:
          "Quand Pikachu relâche de l'électricité à partir de ses joues, il peut arriver que ses oreilles se dressent, comme pour écouter quelque chose.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Électrik")?.id }],
      },
    },
  });

  const mew = await prisma.pokemon.upsert({
    where: { name: "Mew" },
    update: {},
    create: {
      name: "Mew",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/151.png",
      content: {
        idpokedex: 151,
        description:
          "Mew possède le code génétique de tous les Pokémon. Il peut se rendre invisible à volonté, ce qui lui permet de passer totalement inaperçu.",
      },
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [{ id: types.find((t) => t.name === "Psy")?.id }],
      },
    },
  });

  // Pokémon de Sinnoh (4ème génération)
  const tortipouss = await prisma.pokemon.upsert({
    where: { name: "Tortipouss" },
    update: {},
    create: {
      name: "Tortipouss",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/387.png",
      content: {
        idpokedex: 387,
        description:
          "La coquille sur le dos de Tortipouss est faite de terre. Quand il boit de l'eau, elle devient plus dure.",
      },
      generationId: generations.find((g) => g.name === "Sinnoh")?.id || 4,
      types: {
        connect: [{ id: types.find((t) => t.name === "Plante")?.id }],
      },
    },
  });

  const boskara = await prisma.pokemon.upsert({
    where: { name: "Boskara" },
    update: {},
    create: {
      name: "Boskara",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/388.png",
      content: {
        idpokedex: 388,
        description:
          "Il vit près des lacs dans les forêts. Il sort la tête de l'eau pour grignoter les bourgeons des arbres en bordure.",
      },
      generationId: generations.find((g) => g.name === "Sinnoh")?.id || 4,
      types: {
        connect: [{ id: types.find((t) => t.name === "Plante")?.id }],
      },
    },
  });

  const torterra = await prisma.pokemon.upsert({
    where: { name: "Torterra" },
    update: {},
    create: {
      name: "Torterra",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/389.png",
      content: {
        idpokedex: 389,
        description:
          "De petits Pokémon bâtissent occasionnellement leur nid sur son dos immobile. Ce Pokémon ne s'en aperçoit pas.",
      },
      generationId: generations.find((g) => g.name === "Sinnoh")?.id || 4,
      types: {
        connect: [
          { id: types.find((t) => t.name === "Plante")?.id },
          { id: types.find((t) => t.name === "Sol")?.id },
        ],
      },
    },
  });

  // Pokémon de Kalos (6ème génération)
  const grenousse = await prisma.pokemon.upsert({
    where: { name: "Grenousse" },
    update: {},
    create: {
      name: "Grenousse",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/656.png",
      content: {
        idpokedex: 656,
        description:
          "Il sécrète une mousse flexible sur sa poitrine et son dos. Elle amortit les coups qu'il reçoit et qu'il porte.",
      },
      generationId: generations.find((g) => g.name === "Kalos")?.id || 6,
      types: {
        connect: [{ id: types.find((t) => t.name === "Eau")?.id }],
      },
    },
  });

  const croâporal = await prisma.pokemon.upsert({
    where: { name: "Croâporal" },
    update: {},
    create: {
      name: "Croâporal",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/657.png",
      content: {
        idpokedex: 657,
        description:
          "Il peut bondir à plus de 600 mètres en utilisant la mousse de ses pattes. Il prend ses ennemis par surprise en leur sautant dessus.",
      },
      generationId: generations.find((g) => g.name === "Kalos")?.id || 6,
      types: {
        connect: [{ id: types.find((t) => t.name === "Eau")?.id }],
      },
    },
  });

  const amphinobi = await prisma.pokemon.upsert({
    where: { name: "Amphinobi" },
    update: {},
    create: {
      name: "Amphinobi",
      photo:
        "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/658.png",
      content: {
        idpokedex: 658,
        description:
          "Il apparaît et disparaît à volonté comme un ninja. Il tranche ses ennemis avec des étoiles de jet faites d'eau compressée.",
      },
      generationId: generations.find((g) => g.name === "Kalos")?.id || 6,
      types: {
        connect: [
          { id: types.find((t) => t.name === "Eau")?.id },
          { id: types.find((t) => t.name === "Ténèbres")?.id },
        ],
      },
    },
  });

  console.log(
    "Pokémon créés:",
    [
      bulbizarre,
      salameche,
      reptincel,
      dracaufeu,
      carapuce,
      carabaffe,
      tortank,
      pikachu,
      mew,
      tortipouss,
      boskara,
      torterra,
      grenousse,
      croâporal,
      amphinobi,
    ].length
  );

  // Créer quelques commentaires
  await prisma.commentaire.create({
    data: {
      text: "Bulbizarre est un excellent choix pour commencer l'aventure !",
      authorId: adminUser.id,
      pokemonId: bulbizarre.id,
    },
  });

  await prisma.commentaire.create({
    data: {
      text: "Pikachu est vraiment adorable et très populaire !",
      authorId: adminUser.id,
      pokemonId: pikachu.id,
    },
  });

  console.log("Commentaires créés: 2");

  //Creer questions quiz
  const questionsData = [
    {
      question: "Quel est le type principal de Pikachu ?",
      image: null,
      correct: "Électrik",
      choices: ["Électrik", "Feu", "Plante", "Normal"],
    },
    {
      question: "Quel Pokémon est le starter eau de Kanto ?",
      image: null,
      correct: "Carapuce",
      choices: ["Carapuce", "Piplup", "Moustillon", "Gobou"],
    },
    {
      question: "Quel Pokémon est connu comme le Pokémon génétique ?",
      image: null,
      correct: "Mewtwo",
      choices: ["Mew", "Mewtwo", "Deoxys", "Genesect"],
    },
    {
      question: "Quel type est super efficace contre les Pokémon Feu ?",
      image: null,
      choices: ["Eau", "Électrik", "Fée", "Normal"],
      correct: "Eau",
    },
    {
      question: "Lequel de ces Pokémon peut évoluer avec une pierre feu ?",
      image: null,
      choices: ["Evoli", "Pikachu", "Tarsal", "Caninos"],
      correct: "Caninos",
    },
    {
      question: "Quel Pokémon est le numéro 1 du Pokédex national ?",
      image: null,
      choices: ["Bulbizarre", "Pikachu", "Mew", "Arceus"],
      correct: "Bulbizarre",
    },
    {
      question: "Quel type est immunisé contre les attaques Électrik ?",
      image: null,
      choices: ["Sol", "Eau", "Acier", "Normal"],
      correct: "Sol",
    },
    {
      question: "Quel Pokémon est la mascotte officielle de Pokémon ?",
      image: null,
      choices: ["Pikachu", "Sacha", "Ronflex", "Dracaufeu"],
      correct: "Pikachu",
    },
    {
      question: "Quelle région est introduite dans Pokémon Or & Argent ?",
      image: null,
      choices: ["Kanto", "Kalos", "Johto", "Galar"],
      correct: "Johto",
    },
    {
      question:
        "Combien de formes différentes peut prendre Evoli via évolution ?",
      image: null,
      choices: ["5", "7", "8", "9"],
      correct: "8",
    },
  ];

  for (const q of questionsData) {
    await prisma.quizQuestion.create({
      data: {
        question: q.question,
        image: q.image,
        difficulty: q.difficulty ?? "medium",
        answers: {
          create: q.choices.map((c) => ({
            text: c,
            isCorrect: c === q.correct,
          })),
        },
      },
    });
  }

  console.log("Questions de quiz créées: 10");

  // Créer une requête d'ajout pour le Pokémon Gobu
  await prisma.request.create({
    data: {
      name: "Gobu",
      photo: "/pokemon/goblin-pokemon.png",
      content: {
        idpokedex: 999,
        description:
          "Gobu est un Pokémon mystérieux découvert récemment. Il ressemble à un petit gobelin et vit dans les caves sombres. Sa nature curieuse le pousse à collectionner des objets brillants.",
      },
      actionType: "AJOUT",
      status: "EN_ATTENTE",
      authorId: adminUser.id,
      pokemonId: bulbizarre.id, // Référence temporaire obligatoire
      generationId: generations.find((g) => g.name === "Kanto")?.id || 1,
      types: {
        connect: [
          { id: types.find((t) => t.name === "Ténèbres")?.id },
          { id: types.find((t) => t.name === "Normal")?.id },
        ],
      },
    },
  });

  console.log("Requête d'ajout créée: 1");
  console.log("Seeding terminé avec succès !");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
