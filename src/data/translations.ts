export type Lang = 'es' | 'en';

export const t = {
  es: {
    // App / nav
    appName: 'MamiNutri',
    nav: {
      home: 'Inicio',
      shopping: 'Compras',
      profile: 'Mia',
    },

    // Home screen
    home: {
      greeting: (name: string) => `Hola, ${name}`,
      ageLabel: (months: number, weeks: number) => `${months} meses · Semana ${weeks}`,
      progressLabel: 'Alimentos probados',
      cookCta: '¿Qué cocino hoy?',
      cookCtaSub: (name: string) => `Recetas con alimentos que ${name} ya probó`,
      ageFilterAll: 'Desde 6m',
      ageFilter8: 'Desde 8m',
      ageFilter12: 'Desde 12m',
      legend: {
        tried: 'Probado',
        introduce: 'Introducir ahora',
        soon: 'Próximamente',
        avoid: 'Evitar',
      },
      seeMore: (n: number, label: string) => `Ver ${n} ${label} más`,
      seeLess: 'Ver menos',
    },

    // Stage banner
    stage: {
      pill: (months: string) => `Etapa ${months} meses`,
      title: 'Es momento de introducir nuevos alimentos',
      sub: '1 alimento nuevo cada 1–3 días. Espera y observa antes del siguiente.',
      suggested: (name: string) => `Sugerido esta semana: ${name}`,
      suggestedSub: 'Primera vez · Observa posibles reacciones',
      tryBtn: 'Probar',
    },

    // Method
    method: {
      title: 'Elige tu método',
      blwDesc: 'Bebé come solo con sus manos',
      blissDesc: 'BLW más seguro + hierro garantizado',
      puresDesc: 'Método tradicional con cuchara',
      puresTitle: 'Purés y papillas',
      note: 'Puedes cambiar de método en cualquier momento. Las 3 preparaciones siempre están disponibles.',
      changed: (m: string) => `Método cambiado a ${m}`,
    },

    // Food categories
    category: {
      fruits: 'Frutas',
      vegetables: 'Verduras',
      proteins: 'Proteínas',
      grains: 'Cereales y tubérculos',
      fruitsPlural: 'frutas',
      vegetablesPlural: 'verduras',
      proteinsPlural: 'proteínas',
      grainsPlural: 'cereales',
    },

    // Food card labels
    food: {
      tried: 'Probado',
      newThis: 'Nuevo',
      suggested: 'Sugerido',
      allergen: 'Alérgeno',
      fromMonths: (m: number) => `desde ${m}m`,
      avoidUntil: (m: number) => `desde ${m}m`,
      count: (tried: number, total: number) => `${tried} probados · ${total} total`,
      addToList: 'Agregar a lista de compras',
    },

    // Food detail
    detail: {
      backBtn: 'Inicio',
      chokingRisk: 'Riesgo atragantamiento #',
      fromMonths: (m: number) => `Desde ${m}m`,
      tabs: {
        prep: 'Preparación',
        menu: 'Menú',
        log: 'Registro',
      },
      cookTime: (min: string) => `Tiempo de cocción al vapor: ${min} min según textura deseada.`,
      adultVersion: 'Versión adulto',
      addAdultIngredients: 'Agregar ingredientes adulto',
    },

    // Methods preparation
    prep: {
      blw: {
        step1: 'Vapor 8 min hasta que ablande pero no se deshaga',
        step2: 'Cortar en trozos del tamaño de la palma — nunca en círculos',
        step3: 'Sin sal, sin condimentos',
      },
      bliss: {
        step1: 'Combinar con alimento rico en hierro (ej. pollo desmenuzado)',
        step2: 'Agregar fuente de energía: aceite de oliva extra virgen',
        step3: 'Misma presentación en trozos grandes',
      },
      pures: {
        title: 'Purés / Cuchara',
        step1: 'Vapor 12–15 min hasta que quede muy blando',
        step2: 'Mixear con leche materna para textura suave',
        step3: 'Después de 9m: dejar con grumos para avanzar en textura',
      },
    },

    // Log / registro
    log: {
      alreadyTried: 'Ya lo probó',
      firstTime: 'Primera vez ofrecida',
      reaction: 'Reacción',
      loved: 'Le encantó',
      normal: 'Normal',
      disliked: 'No le gustó',
      reaction4: 'Reacción',
      notes: 'Notas (opcional)',
      notesPlaceholder: 'Ej: le costó al principio pero después le gustó...',
      save: 'Guardar registro',
    },

    // Quick modal
    modal: {
      firstTime: 'Primera vez hoy',
      howWasIt: '¿Cómo le fue?',
      cancel: 'Cancelar',
      seePrep: 'Ver preparación',
    },

    // Shopping list
    shopping: {
      title: 'Lista de compras',
      clear: 'Limpiar',
      forBaby: 'Para bebé',
      forMom: 'Para mamá',
      baby: 'bebé',
      mom: 'mamá',
      added: 'Agregado a lista de compras',
      empty: 'Lista vacía — agrega alimentos desde las recetas',
    },

    // Fridge / what to cook
    fridge: {
      title: '¿Qué cocino hoy?',
      info: (name: string) => `Solo muestra alimentos que ${name} ya probó — sin sorpresas para su barriguita.`,
      selectLabel: 'Selecciona lo que tienes en casa:',
      showRecipes: 'Ver recetas',
      resultsLabel: 'Recetas con lo que tienes',
      noResults: 'Selecciona más ingredientes para ver recetas.',
    },

    // Profile
    profile: {
      title: (name: string) => `Perfil de ${name}`,
      bornLabel: (date: string) => `Nacida ${date}`,
      statTried: 'Alimentos probados',
      statRecipes: 'Recetas hechas',
      statReaction: 'Reacción registrada',
      statProgress: 'Progreso total',
      activeMethod: 'Método activo',
      active: 'Activo',
    },
  },

  en: {
    appName: 'MamiNutri',
    nav: {
      home: 'Home',
      shopping: 'Shopping',
      profile: 'Mia',
    },

    home: {
      greeting: (name: string) => `Hi, ${name}`,
      ageLabel: (months: number, weeks: number) => `${months} months · Week ${weeks}`,
      progressLabel: 'Foods tried',
      cookCta: 'What should I cook today?',
      cookCtaSub: (name: string) => `Recipes using foods ${name} already tried`,
      ageFilterAll: 'From 6m',
      ageFilter8: 'From 8m',
      ageFilter12: 'From 12m',
      legend: {
        tried: 'Tried',
        introduce: 'Introduce now',
        soon: 'Coming soon',
        avoid: 'Avoid',
      },
      seeMore: (n: number, label: string) => `See ${n} more ${label}`,
      seeLess: 'See less',
    },

    stage: {
      pill: (months: string) => `Stage ${months} months`,
      title: 'Time to introduce new foods',
      sub: '1 new food every 1–3 days. Wait and observe before the next one.',
      suggested: (name: string) => `Suggested this week: ${name}`,
      suggestedSub: 'First time · Watch for reactions',
      tryBtn: 'Try it',
    },

    method: {
      title: 'Choose your method',
      blwDesc: 'Baby self-feeds with finger foods',
      blissDesc: 'Safer BLW + guaranteed iron',
      puresDesc: 'Traditional spoon method',
      puresTitle: 'Purées & spoon',
      note: 'You can change method anytime. All 3 preparation options are always shown.',
      changed: (m: string) => `Method changed to ${m}`,
    },

    category: {
      fruits: 'Fruits',
      vegetables: 'Vegetables',
      proteins: 'Proteins',
      grains: 'Grains & starches',
      fruitsPlural: 'fruits',
      vegetablesPlural: 'vegetables',
      proteinsPlural: 'proteins',
      grainsPlural: 'grains',
    },

    food: {
      tried: 'Tried',
      newThis: 'New',
      suggested: 'Suggested',
      allergen: 'Allergen',
      fromMonths: (m: number) => `from ${m}m`,
      avoidUntil: (m: number) => `from ${m}m`,
      count: (tried: number, total: number) => `${tried} tried · ${total} total`,
      addToList: 'Add to shopping list',
    },

    detail: {
      backBtn: 'Back',
      chokingRisk: 'Choking risk #',
      fromMonths: (m: number) => `From ${m}m`,
      tabs: {
        prep: 'Preparation',
        menu: 'Menu',
        log: 'Log',
      },
      cookTime: (min: string) => `Steaming time: ${min} min depending on desired texture.`,
      adultVersion: 'Adult version',
      addAdultIngredients: 'Add adult ingredients',
    },

    prep: {
      blw: {
        step1: 'Steam 8 min until soft but not mushy',
        step2: 'Cut into palm-sized pieces — never in rounds',
        step3: 'No salt, no seasoning',
      },
      bliss: {
        step1: 'Pair with iron-rich food (e.g., shredded chicken)',
        step2: 'Add energy source: extra virgin olive oil',
        step3: 'Same large-piece presentation',
      },
      pures: {
        title: 'Purée / Spoon',
        step1: 'Steam 12–15 min until very soft',
        step2: 'Blend with breast milk for smooth texture',
        step3: 'After 9m: leave lumpy to build texture tolerance',
      },
    },

    log: {
      alreadyTried: 'Already tried',
      firstTime: 'First time offered',
      reaction: 'Reaction',
      loved: 'Loved it',
      normal: 'Normal',
      disliked: 'Disliked',
      reaction4: 'Reaction',
      notes: 'Notes (optional)',
      notesPlaceholder: 'E.g., hard at first but then liked it...',
      save: 'Save log',
    },

    modal: {
      firstTime: 'First time today',
      howWasIt: 'How did it go?',
      cancel: 'Cancel',
      seePrep: 'See preparation',
    },

    shopping: {
      title: 'Shopping list',
      clear: 'Clear done',
      forBaby: 'For baby',
      forMom: 'For mom',
      baby: 'baby',
      mom: 'mom',
      added: 'Added to shopping list',
      empty: 'List is empty — add foods from recipes',
    },

    fridge: {
      title: 'What should I cook today?',
      info: (name: string) => `Only shows foods ${name} has already tried — no surprises for her tummy.`,
      selectLabel: 'Select what you have at home:',
      showRecipes: 'Show recipes',
      resultsLabel: 'Recipes with what you have',
      noResults: 'Select more ingredients to see recipes.',
    },

    profile: {
      title: (name: string) => `${name}'s profile`,
      bornLabel: (date: string) => `Born ${date}`,
      statTried: 'Foods tried',
      statRecipes: 'Recipes made',
      statReaction: 'Reaction logged',
      statProgress: 'Total progress',
      activeMethod: 'Active method',
      active: 'Active',
    },
  },
} as const;

export type TranslationKey = typeof t;
