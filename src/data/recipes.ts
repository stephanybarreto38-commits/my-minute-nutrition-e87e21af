export interface Recipe {
  id: string;
  foodIds: string[]; // foods this recipe belongs to / uses
  titleEs: string;
  titleEn: string;
  timeMin: number;
  method: 'steam' | 'boil' | 'raw' | 'bake' | 'saute';
  methodBadges: ('BLW' | 'BLISS' | 'Purés')[];
  stepsEs: string[];
  stepsEn: string[];
  adultVersionEs: string;
  adultVersionEn: string;
  adultIngredientsEs: string[];
  adultIngredientsEn: string[];
}

export const RECIPES: Recipe[] = [
  // ── AGUACATE ──────────────────────────────────────────────────────────
  {
    id: 'avocado-solo',
    foodIds: ['avocado'],
    titleEs: 'Aguacate en tiras BLW',
    titleEn: 'Avocado BLW strips',
    timeMin: 2,
    method: 'raw',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Cortar aguacate maduro en tiras gruesas del tamaño de un dedo adulto',
      'Opcionalmente espolvorear semillas de cáñamo para mejor agarre',
      'Servir directamente — textura perfecta para bebés de 6m+',
    ],
    stepsEn: [
      'Cut ripe avocado into thick finger-sized strips',
      'Optionally sprinkle hemp seeds for better grip',
      'Serve directly — perfect texture for 6m+ babies',
    ],
    adultVersionEs: 'Tostada con aguacate, sal rosada, limón, tomate cherry y huevo pochado.',
    adultVersionEn: 'Toast with avocado, pink salt, lemon, cherry tomatoes and poached egg.',
    adultIngredientsEs: ['Sal rosada', 'Limón', 'Tomate cherry', 'Pan integral'],
    adultIngredientsEn: ['Pink salt', 'Lemon', 'Cherry tomatoes', 'Whole grain bread'],
  },
  {
    id: 'avocado-pure',
    foodIds: ['avocado'],
    titleEs: 'Puré de aguacate (Purés)',
    titleEn: 'Avocado purée',
    timeMin: 3,
    method: 'raw',
    methodBadges: ['Purés'],
    stepsEs: [
      'Aguacate muy maduro aplastado con tenedor',
      'Agregar unas gotitas de limón para evitar que se oxide',
      'Servir con cuchara o como dip',
    ],
    stepsEn: [
      'Mash very ripe avocado with a fork',
      'Add a few drops of lemon to prevent oxidation',
      'Serve with spoon or as a dip',
    ],
    adultVersionEs: 'Guacamole: aguacate + cebolla morada + cilantro + limón + jalapeño.',
    adultVersionEn: 'Guacamole: avocado + red onion + cilantro + lime + jalapeño.',
    adultIngredientsEs: ['Cebolla morada', 'Cilantro', 'Limón', 'Jalapeño'],
    adultIngredientsEn: ['Red onion', 'Cilantro', 'Lime', 'Jalapeño'],
  },

  // ── BANANA ────────────────────────────────────────────────────────────
  {
    id: 'banana-solo',
    foodIds: ['banana'],
    titleEs: 'Banana en tiras',
    titleEn: 'Banana strips',
    timeMin: 2,
    method: 'raw',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Pelar banana y cortar por la mitad a lo largo',
      'Dejar la cáscara en la mitad inferior para facilitar el agarre',
      'Servir directamente — ideal primer alimento',
    ],
    stepsEn: [
      'Peel banana and cut in half lengthwise',
      'Leave the peel on the bottom half to help with grip',
      'Serve directly — ideal first food',
    ],
    adultVersionEs: 'Batido de banana con leche de almendras, cacao en polvo y mantequilla de maní.',
    adultVersionEn: 'Banana smoothie with almond milk, cocoa powder and peanut butter.',
    adultIngredientsEs: ['Leche de almendras', 'Cacao en polvo', 'Mantequilla de maní'],
    adultIngredientsEn: ['Almond milk', 'Cocoa powder', 'Peanut butter'],
  },

  // ── MANGO ─────────────────────────────────────────────────────────────
  {
    id: 'mango-solo',
    foodIds: ['mango'],
    titleEs: 'Mango en bastones',
    titleEn: 'Mango sticks',
    timeMin: 5,
    method: 'raw',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Mango muy maduro, pelado y cortado en bastones gruesos',
      'Si está muy firme, al vapor 5 min para ablandar',
      'Refrigerar 5 min antes de servir — facilita el agarre',
    ],
    stepsEn: [
      'Very ripe mango, peeled and cut into thick sticks',
      'If too firm, steam 5 min to soften',
      'Refrigerate 5 min before serving — improves grip',
    ],
    adultVersionEs: 'Ensalada de mango con pepino, chile, limón y sal — estilo colombiano.',
    adultVersionEn: 'Mango salad with cucumber, chili, lime and salt — Colombian style.',
    adultIngredientsEs: ['Pepino', 'Chile tajín', 'Limón', 'Sal'],
    adultIngredientsEn: ['Cucumber', 'Chili powder', 'Lime', 'Salt'],
  },

  // ── PERA ──────────────────────────────────────────────────────────────
  {
    id: 'pear-steamed',
    foodIds: ['pear'],
    titleEs: 'Pera al vapor',
    titleEn: 'Steamed pear',
    timeMin: 10,
    method: 'steam',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Pera pelada al vapor 8–10 min hasta estar blanda',
      'BLW: servir en cuartos sin pepitas',
      'Purés: mixear con un poco de agua de cocción',
    ],
    stepsEn: [
      'Steamed peeled pear 8–10 min until soft',
      'BLW: serve in quarters without seeds',
      'Purée: blend with a little cooking water',
    ],
    adultVersionEs: 'Peras caramelizadas con canela y miel sobre yogur griego.',
    adultVersionEn: 'Caramelized pears with cinnamon and honey over Greek yogurt.',
    adultIngredientsEs: ['Canela', 'Miel', 'Yogur griego', 'Nueces'],
    adultIngredientsEn: ['Cinnamon', 'Honey', 'Greek yogurt', 'Walnuts'],
  },

  // ── DURAZNO ───────────────────────────────────────────────────────────
  {
    id: 'peach-steamed',
    foodIds: ['peach'],
    titleEs: 'Durazno al vapor',
    titleEn: 'Steamed peach',
    timeMin: 8,
    method: 'steam',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Durazno pelado, sin hueso, al vapor 6–8 min',
      'BLW: en gajos gruesos',
      'Purés: triturar suave',
    ],
    stepsEn: [
      'Peeled, pitted peach, steam 6–8 min',
      'BLW: in thick wedges',
      'Purée: blend smooth',
    ],
    adultVersionEs: 'Smoothie bowl con durazno, granola, semillas de chía y frutos rojos.',
    adultVersionEn: 'Peach smoothie bowl with granola, chia seeds and berries.',
    adultIngredientsEs: ['Granola', 'Semillas de chía', 'Frutos rojos', 'Yogur'],
    adultIngredientsEn: ['Granola', 'Chia seeds', 'Berries', 'Yogurt'],
  },

  // ── MANZANA ───────────────────────────────────────────────────────────
  {
    id: 'apple-steamed',
    foodIds: ['apple'],
    titleEs: 'Manzana al vapor',
    titleEn: 'Steamed apple',
    timeMin: 12,
    method: 'steam',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Manzana pelada sin centro al vapor 10–12 min',
      'BLW: en gajos gruesos, fáciles de agarrar',
      'Purés: mezclar con canela — clásico primer puré',
    ],
    stepsEn: [
      'Peeled and cored apple, steam 10–12 min',
      'BLW: in thick wedges, easy to grasp',
      'Purée: blend with cinnamon — classic first purée',
    ],
    adultVersionEs: 'Compota de manzana y canela para acompañar pancakes o avena.',
    adultVersionEn: 'Apple and cinnamon compote to serve with pancakes or oatmeal.',
    adultIngredientsEs: ['Canela', 'Azúcar mascabado', 'Mantequilla', 'Vainilla'],
    adultIngredientsEn: ['Cinnamon', 'Brown sugar', 'Butter', 'Vanilla'],
  },

  // ── PAPAYA ────────────────────────────────────────────────────────────
  {
    id: 'papaya-solo',
    foodIds: ['papaya'],
    titleEs: 'Papaya fresca en tiras',
    titleEn: 'Fresh papaya strips',
    timeMin: 3,
    method: 'raw',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Papaya muy madura pelada, sin semillas, en tiras gruesas',
      'La textura suave la hace ideal para bebés',
      'También se puede machacar fácilmente para purés',
    ],
    stepsEn: [
      'Very ripe papaya, peeled, seeds removed, in thick strips',
      'The soft texture makes it ideal for babies',
      'Can also be easily mashed for purées',
    ],
    adultVersionEs: 'Ensalada de papaya verde estilo thai con limón, chile y salsa de pescado.',
    adultVersionEn: 'Green papaya salad Thai style with lime, chili and fish sauce.',
    adultIngredientsEs: ['Limón', 'Chile', 'Salsa de pescado', 'Maní'],
    adultIngredientsEn: ['Lime', 'Chili', 'Fish sauce', 'Peanuts'],
  },

  // ── ZANAHORIA ─────────────────────────────────────────────────────────
  {
    id: 'carrot-solo',
    foodIds: ['carrot'],
    titleEs: 'Zanahoria en bastones al vapor',
    titleEn: 'Steamed carrot batons',
    timeMin: 15,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Zanahoria pelada en bastones gruesos (tamaño palma adulta)',
      'Al vapor 15 min hasta estar blanda pero firme',
      'Dejar enfriar 2 min antes de servir',
    ],
    stepsEn: [
      'Peeled carrot in thick batons (adult palm-sized)',
      'Steam 15 min until soft but still firm',
      'Cool 2 min before serving',
    ],
    adultVersionEs: 'Hummus de zanahoria asada con ajo, limón, tahini y aceite de oliva.',
    adultVersionEn: 'Roasted carrot hummus with garlic, lemon, tahini and olive oil.',
    adultIngredientsEs: ['Ajo', 'Limón', 'Tahini', 'Aceite de oliva'],
    adultIngredientsEn: ['Garlic', 'Lemon', 'Tahini', 'Olive oil'],
  },

  // ── CALABAZA ──────────────────────────────────────────────────────────
  {
    id: 'squash-pure',
    foodIds: ['squash'],
    titleEs: 'Puré de calabaza',
    titleEn: 'Squash purée',
    timeMin: 25,
    method: 'bake',
    methodBadges: ['Purés', 'BLW'],
    stepsEs: [
      'Calabaza en mitades al horno 200°C por 25 min',
      'Extraer la pulpa y mixear suave',
      'BLW: servir en cuñas blandas directamente',
    ],
    stepsEn: [
      'Squash halved in oven 200°C for 25 min',
      'Scoop pulp and blend smooth',
      'BLW: serve in soft wedges directly',
    ],
    adultVersionEs: 'Sopa crema de calabaza con leche de coco, jengibre y cúrcuma.',
    adultVersionEn: 'Creamy squash soup with coconut milk, ginger and turmeric.',
    adultIngredientsEs: ['Leche de coco', 'Jengibre', 'Cúrcuma', 'Cebolla'],
    adultIngredientsEn: ['Coconut milk', 'Ginger', 'Turmeric', 'Onion'],
  },

  // ── BRÓCOLI ───────────────────────────────────────────────────────────
  {
    id: 'broccoli-solo',
    foodIds: ['broccoli'],
    titleEs: 'Brócoli al vapor',
    titleEn: 'Steamed broccoli',
    timeMin: 10,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Ramas de brócoli al vapor 8–10 min',
      'Dejar el tallo largo — sirve de "mango" para el bebé',
      'Debe quedar blando pero sin deshacerse',
    ],
    stepsEn: [
      'Broccoli florets steam 8–10 min',
      'Keep the stem long — it works as a "handle" for baby',
      'Should be soft but not falling apart',
    ],
    adultVersionEs: 'Brócoli salteado con ajo, aceite de oliva, limón y hojuelas de chile.',
    adultVersionEn: 'Sautéed broccoli with garlic, olive oil, lemon and chili flakes.',
    adultIngredientsEs: ['Ajo', 'Aceite de oliva', 'Limón', 'Hojuelas de chile'],
    adultIngredientsEn: ['Garlic', 'Olive oil', 'Lemon', 'Chili flakes'],
  },
  {
    id: 'broccoli-chicken',
    foodIds: ['broccoli', 'chicken'],
    titleEs: 'Brócoli al vapor con pollo',
    titleEn: 'Steamed broccoli with chicken',
    timeMin: 20,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Brócoli en ramas largas al vapor 8 min',
      'Pollo desmenuzado al vapor 20 min',
      'Servir juntos — rico en hierro y vitamina C',
    ],
    stepsEn: [
      'Steam broccoli florets 8 min',
      'Shred chicken and steam 20 min',
      'Serve together — rich in iron and vitamin C',
    ],
    adultVersionEs: 'Salteado de brócoli y pollo con ajo, salsa de soya, aceite de sésamo y arroz.',
    adultVersionEn: 'Broccoli and chicken stir-fry with garlic, soy sauce, sesame oil and rice.',
    adultIngredientsEs: ['Ajo', 'Salsa de soya', 'Aceite de sésamo', 'Arroz integral'],
    adultIngredientsEn: ['Garlic', 'Soy sauce', 'Sesame oil', 'Brown rice'],
  },

  // ── BATATA ────────────────────────────────────────────────────────────
  {
    id: 'sweetpotato-solo',
    foodIds: ['sweetpotato'],
    titleEs: 'Batata al horno en tiras',
    titleEn: 'Baked sweet potato strips',
    timeMin: 30,
    method: 'bake',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Batata pelada en tiras al horno 200°C por 25–30 min',
      'Sin aceite ni sal — la batata ya es naturalmente dulce',
      'BLW: en tiras. Purés: machacar con leche materna',
    ],
    stepsEn: [
      'Peeled sweet potato strips in oven 200°C for 25–30 min',
      'No oil or salt — sweet potato is naturally sweet',
      'BLW: in strips. Purée: mash with breast milk',
    ],
    adultVersionEs: 'Batatas asadas con aceite de oliva, romero, ajo y sal rosada.',
    adultVersionEn: 'Roasted sweet potatoes with olive oil, rosemary, garlic and pink salt.',
    adultIngredientsEs: ['Aceite de oliva', 'Romero', 'Ajo', 'Sal rosada'],
    adultIngredientsEn: ['Olive oil', 'Rosemary', 'Garlic', 'Pink salt'],
  },
  {
    id: 'broccoli-sweetpotato-pure',
    foodIds: ['broccoli', 'sweetpotato'],
    titleEs: 'Puré verde de brócoli y batata',
    titleEn: 'Green broccoli and sweet potato purée',
    timeMin: 20,
    method: 'steam',
    methodBadges: ['Purés'],
    stepsEs: [
      'Batata al vapor 15 min',
      'Brócoli al vapor 10 min',
      'Mixear con leche materna hasta textura deseada',
    ],
    stepsEn: [
      'Steam sweet potato 15 min',
      'Steam broccoli 10 min',
      'Blend with breast milk to desired texture',
    ],
    adultVersionEs: 'Sopa crema de brócoli y camote con cebolla, ajo y caldo de pollo.',
    adultVersionEn: 'Creamy broccoli and sweet potato soup with onion, garlic and chicken stock.',
    adultIngredientsEs: ['Cebolla', 'Ajo', 'Caldo de pollo', 'Crema de coco'],
    adultIngredientsEn: ['Onion', 'Garlic', 'Chicken stock', 'Coconut cream'],
  },

  // ── POLLO ─────────────────────────────────────────────────────────────
  {
    id: 'chicken-solo',
    foodIds: ['chicken'],
    titleEs: 'Pollo desmenuzado al vapor',
    titleEn: 'Shredded steamed chicken',
    timeMin: 25,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Pechuga de pollo al vapor 20–25 min',
      'Desmenuzar muy bien — sin pedazos grandes',
      'BLW: en tiras largas. Purés: mixear con caldo sin sal',
    ],
    stepsEn: [
      'Chicken breast steamed 20–25 min',
      'Shred very well — no large pieces',
      'BLW: in long strips. Purée: blend with no-salt broth',
    ],
    adultVersionEs: 'Pollo desmechado en ensalada con aguacate, limón, cilantro y cebolla.',
    adultVersionEn: 'Shredded chicken salad with avocado, lime, cilantro and onion.',
    adultIngredientsEs: ['Aguacate', 'Limón', 'Cilantro', 'Cebolla'],
    adultIngredientsEn: ['Avocado', 'Lime', 'Cilantro', 'Onion'],
  },
  {
    id: 'carrot-chicken',
    foodIds: ['carrot', 'chicken'],
    titleEs: 'Pollo con zanahoria al vapor',
    titleEn: 'Steamed chicken with carrot',
    timeMin: 20,
    method: 'steam',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Zanahoria en bastones al vapor 15 min',
      'Pollo desmenuzado al vapor 20 min',
      'Servir juntos — rico en hierro y betacaroteno',
    ],
    stepsEn: [
      'Steam carrot batons 15 min',
      'Shred chicken and steam 20 min',
      'Serve together — rich in iron and beta-carotene',
    ],
    adultVersionEs: 'Pollo al horno con zanahorias glaseadas con miel (solo adultos), romero y ajo.',
    adultVersionEn: 'Roasted chicken with honey-glazed carrots (adults only), rosemary and garlic.',
    adultIngredientsEs: ['Miel', 'Romero', 'Ajo', 'Aceite de oliva'],
    adultIngredientsEn: ['Honey', 'Rosemary', 'Garlic', 'Olive oil'],
  },

  // ── HUEVO ─────────────────────────────────────────────────────────────
  {
    id: 'egg-scrambled',
    foodIds: ['egg'],
    titleEs: 'Huevo revuelto para bebé',
    titleEn: 'Baby scrambled egg',
    timeMin: 5,
    method: 'saute',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Huevo entero batido en sartén antiadherente sin aceite',
      'Cocinar bien revuelto a fuego medio — sin sal',
      'BLW: en tiras. Purés: revuelto suave con cuchara',
    ],
    stepsEn: [
      'Whole beaten egg in non-stick pan without oil',
      'Cook well scrambled over medium heat — no salt',
      'BLW: in strips. Purée: soft scramble with spoon',
    ],
    adultVersionEs: 'Huevos revueltos con queso, cebollín, tomate y sal rosada.',
    adultVersionEn: 'Scrambled eggs with cheese, chives, tomato and pink salt.',
    adultIngredientsEs: ['Queso', 'Cebollín', 'Tomate', 'Sal rosada'],
    adultIngredientsEn: ['Cheese', 'Chives', 'Tomato', 'Pink salt'],
  },

  // ── LENTEJAS ──────────────────────────────────────────────────────────
  {
    id: 'lentils-solo',
    foodIds: ['lentils'],
    titleEs: 'Lentejas aplastadas',
    titleEn: 'Mashed lentils',
    timeMin: 30,
    method: 'boil',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Lentejas rojas o verdes cocidas 25–30 min hasta muy blandas',
      'BLW: formar pequeñas tortitas aplastadas en la bandeja',
      'Purés: mixear con agua de cocción hasta textura suave',
    ],
    stepsEn: [
      'Red or green lentils cooked 25–30 min until very soft',
      'BLW: form small flattened patties on the tray',
      'Purée: blend with cooking water to smooth texture',
    ],
    adultVersionEs: 'Dal de lentejas con leche de coco, cúrcuma, comino y cilantro fresco.',
    adultVersionEn: 'Lentil dal with coconut milk, turmeric, cumin and fresh cilantro.',
    adultIngredientsEs: ['Leche de coco', 'Cúrcuma', 'Comino', 'Cilantro'],
    adultIngredientsEn: ['Coconut milk', 'Turmeric', 'Cumin', 'Cilantro'],
  },
  {
    id: 'lentil-mash',
    foodIds: ['lentils', 'sweetpotato'],
    titleEs: 'Puré de lentejas y batata',
    titleEn: 'Lentil and sweet potato mash',
    timeMin: 35,
    method: 'boil',
    methodBadges: ['Purés', 'BLW'],
    stepsEs: [
      'Lentejas cocidas 30 min hasta que ablanden',
      'Batata al vapor 15 min por separado',
      'Mixear juntos con leche materna o agua de cocción',
    ],
    stepsEn: [
      'Cook lentils 30 min until soft',
      'Steam sweet potato 15 min separately',
      'Blend together with breast milk or cooking water',
    ],
    adultVersionEs: 'Dal de lentejas con leche de coco, cúrcuma, comino y cilantro fresco.',
    adultVersionEn: 'Coconut lentil dal with turmeric, cumin and fresh cilantro.',
    adultIngredientsEs: ['Leche de coco', 'Cúrcuma', 'Comino', 'Cilantro'],
    adultIngredientsEn: ['Coconut milk', 'Turmeric', 'Cumin', 'Cilantro'],
  },

  // ── AVENA ─────────────────────────────────────────────────────────────
  {
    id: 'oats-porridge',
    foodIds: ['oats'],
    titleEs: 'Papilla de avena',
    titleEn: 'Oat porridge',
    timeMin: 10,
    method: 'boil',
    methodBadges: ['Purés', 'BLW'],
    stepsEs: [
      'Avena fina cocida con agua o leche materna 5–8 min',
      'Revolver constantemente hasta textura cremosa',
      'BLW: servir en cuchara precargada o en plato para que explore',
    ],
    stepsEn: [
      'Fine oats cooked with water or breast milk 5–8 min',
      'Stir constantly until creamy texture',
      'BLW: serve on preloaded spoon or plate for exploration',
    ],
    adultVersionEs: 'Overnight oats con leche, frutos rojos, semillas de chía y miel.',
    adultVersionEn: 'Overnight oats with milk, berries, chia seeds and honey.',
    adultIngredientsEs: ['Leche', 'Frutos rojos', 'Semillas de chía', 'Miel'],
    adultIngredientsEn: ['Milk', 'Berries', 'Chia seeds', 'Honey'],
  },

  // ── PAPA ──────────────────────────────────────────────────────────────
  {
    id: 'potato-mash',
    foodIds: ['potato'],
    titleEs: 'Puré de papa suave',
    titleEn: 'Smooth potato mash',
    timeMin: 20,
    method: 'boil',
    methodBadges: ['Purés', 'BLW'],
    stepsEs: [
      'Papa pelada y cocida 15–20 min hasta muy blanda',
      'Machacar con leche materna — sin sal, sin mantequilla',
      'BLW: en cuñas cocidas muy blandas',
    ],
    stepsEn: [
      'Peeled potato boiled 15–20 min until very soft',
      'Mash with breast milk — no salt, no butter',
      'BLW: in very soft cooked wedges',
    ],
    adultVersionEs: 'Puré de papa con mantequilla, sal, pimienta y cebollín.',
    adultVersionEn: 'Potato mash with butter, salt, pepper and chives.',
    adultIngredientsEs: ['Mantequilla', 'Sal', 'Pimienta', 'Cebollín'],
    adultIngredientsEn: ['Butter', 'Salt', 'Pepper', 'Chives'],
  },

  // ── SALMÓN ────────────────────────────────────────────────────────────
  {
    id: 'salmon-steamed',
    foodIds: ['salmon'],
    titleEs: 'Salmón al vapor en láminas',
    titleEn: 'Steamed salmon flakes',
    timeMin: 12,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Filete de salmón al vapor 10–12 min — sin piel ni espinas',
      'Desmenuzar en láminas grandes fáciles de agarrar',
      'Verificar que no haya espinas antes de servir',
    ],
    stepsEn: [
      'Salmon fillet steamed 10–12 min — no skin or bones',
      'Flake into large pieces easy to grasp',
      'Check for bones before serving',
    ],
    adultVersionEs: 'Salmón a la plancha con limón, alcaparras, eneldo y papa al vapor.',
    adultVersionEn: 'Grilled salmon with lemon, capers, dill and steamed potato.',
    adultIngredientsEs: ['Limón', 'Alcaparras', 'Eneldo', 'Aceite de oliva'],
    adultIngredientsEn: ['Lemon', 'Capers', 'Dill', 'Olive oil'],
  },

  // ── FRIJOLES NEGROS ───────────────────────────────────────────────────
  {
    id: 'blackbeans-mash',
    foodIds: ['blackbeans'],
    titleEs: 'Frijoles negros aplastados',
    titleEn: 'Mashed black beans',
    timeMin: 5,
    method: 'raw',
    methodBadges: ['BLW', 'BLISS', 'Purés'],
    stepsEs: [
      'Frijoles negros cocidos (o de lata bien enjuagados)',
      'Aplastar con tenedor hasta consistencia suave',
      'BLW: formar pequeñas bolitas aplastadas en la bandeja',
    ],
    stepsEn: [
      'Cooked black beans (or canned, well rinsed)',
      'Mash with fork to smooth consistency',
      'BLW: form small flattened balls on the tray',
    ],
    adultVersionEs: 'Frijoles negros con arroz, aguacate, plátano maduro y pico de gallo.',
    adultVersionEn: 'Black beans with rice, avocado, ripe plantain and pico de gallo.',
    adultIngredientsEs: ['Arroz', 'Aguacate', 'Plátano maduro', 'Tomate'],
    adultIngredientsEn: ['Rice', 'Avocado', 'Ripe plantain', 'Tomato'],
  },

  // ── AGUACATE + TOSTADA ────────────────────────────────────────────────
  {
    id: 'avocado-toast',
    foodIds: ['avocado', 'bread'],
    titleEs: 'Tostada de aguacate para bebé',
    titleEn: 'Baby avocado toast',
    timeMin: 5,
    method: 'raw',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Pan de centeno tostado cortado en palitos',
      'Aguacate maduro aplastado con tenedor',
      'Unas gotitas de limón',
    ],
    stepsEn: [
      'Toast rye bread and cut into sticks',
      'Mash ripe avocado with fork',
      'Add a few drops of lemon juice',
    ],
    adultVersionEs: 'Agregar sal rosa, pimienta, tomate cherry, huevo pochado y semillas de sésamo.',
    adultVersionEn: 'Add pink salt, pepper, cherry tomatoes, poached egg and sesame seeds.',
    adultIngredientsEs: ['Sal rosa', 'Tomate cherry', 'Huevo', 'Semillas de sésamo'],
    adultIngredientsEn: ['Pink salt', 'Cherry tomatoes', 'Egg', 'Sesame seeds'],
  },

  // ── AGUACATE + ZANAHORIA ──────────────────────────────────────────────
  {
    id: 'avocado-carrot-pure',
    foodIds: ['avocado', 'carrot'],
    titleEs: 'Puré verde de aguacate y zanahoria',
    titleEn: 'Green avocado and carrot purée',
    timeMin: 15,
    method: 'steam',
    methodBadges: ['Purés'],
    stepsEs: [
      'Zanahoria al vapor 15 min',
      'Aguacate maduro aplastado',
      'Mixear suave o dejar con grumos para avanzar en textura',
    ],
    stepsEn: [
      'Steam carrot 15 min',
      'Mash ripe avocado',
      'Blend smooth or leave lumpy for texture progression',
    ],
    adultVersionEs: 'Guacamole express: aguacate + cebolla morada + cilantro + limón + jalapeño.',
    adultVersionEn: 'Quick guacamole: avocado + red onion + cilantro + lime + jalapeño.',
    adultIngredientsEs: ['Cebolla morada', 'Cilantro', 'Limón', 'Jalapeño'],
    adultIngredientsEn: ['Red onion', 'Cilantro', 'Lime', 'Jalapeño'],
  },

  // ── PLÁTANO ───────────────────────────────────────────────────────────
  {
    id: 'plantain-baked',
    foodIds: ['plantain'],
    titleEs: 'Plátano maduro al horno',
    titleEn: 'Baked ripe plantain',
    timeMin: 20,
    method: 'bake',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Plátano maduro (negro) en mitades al horno 180°C 15–20 min',
      'Queda naturalmente dulce y suave',
      'BLW: en tiras. Purés: machacar con tenedor',
    ],
    stepsEn: [
      'Very ripe (black) plantain halved in oven 180°C 15–20 min',
      'Naturally sweet and soft',
      'BLW: in strips. Purée: mash with fork',
    ],
    adultVersionEs: 'Tajadas fritas con queso costeño, aguacate y hogao.',
    adultVersionEn: 'Fried sweet plantain with white cheese, avocado and hogao sauce.',
    adultIngredientsEs: ['Queso costeño', 'Aguacate', 'Tomate', 'Cebolla'],
    adultIngredientsEn: ['White cheese', 'Avocado', 'Tomato', 'Onion'],
  },

  // ── YUCA ──────────────────────────────────────────────────────────────
  {
    id: 'cassava-boiled',
    foodIds: ['cassava'],
    titleEs: 'Yuca cocida en bastones',
    titleEn: 'Boiled cassava sticks',
    timeMin: 25,
    method: 'boil',
    methodBadges: ['BLW', 'Purés'],
    stepsEs: [
      'Yuca pelada sin fibra central, en trozos, cocida 20–25 min',
      'Debe quedar muy blanda — aplastar con dedo fácilmente',
      'BLW: en bastones. Purés: machacar con leche materna',
    ],
    stepsEn: [
      'Peeled cassava without central fiber, in pieces, boiled 20–25 min',
      'Should be very soft — easily squished with a finger',
      'BLW: in sticks. Purée: mash with breast milk',
    ],
    adultVersionEs: 'Yuca frita crujiente con hogao, ají pique y limón.',
    adultVersionEn: 'Crispy fried cassava with hogao sauce, hot sauce and lime.',
    adultIngredientsEs: ['Hogao', 'Ají', 'Limón', 'Sal'],
    adultIngredientsEn: ['Hogao sauce', 'Hot sauce', 'Lime', 'Salt'],
  },

  // ── QUINOA ────────────────────────────────────────────────────────────
  {
    id: 'quinoa-porridge',
    foodIds: ['quinoa'],
    titleEs: 'Papilla de quinoa',
    titleEn: 'Quinoa porridge',
    timeMin: 20,
    method: 'boil',
    methodBadges: ['Purés', 'BLISS'],
    stepsEs: [
      'Quinoa enjuagada cocida 15 min con el doble de agua',
      'Mixear con leche materna o agua hasta textura suave',
      'Excelente fuente de proteína completa y hierro',
    ],
    stepsEn: [
      'Rinsed quinoa cooked 15 min with double the water',
      'Blend with breast milk or water to smooth texture',
      'Excellent source of complete protein and iron',
    ],
    adultVersionEs: 'Bowl de quinoa con verduras asadas, aguacate, huevo y tahini.',
    adultVersionEn: 'Quinoa bowl with roasted vegetables, avocado, egg and tahini.',
    adultIngredientsEs: ['Verduras asadas', 'Aguacate', 'Huevo', 'Tahini'],
    adultIngredientsEn: ['Roasted vegetables', 'Avocado', 'Egg', 'Tahini'],
  },

  // ── PEPINO ────────────────────────────────────────────────────────────
  {
    id: 'cucumber-sticks',
    foodIds: ['cucumber'],
    titleEs: 'Palitos de pepino',
    titleEn: 'Cucumber sticks',
    timeMin: 3,
    method: 'raw',
    methodBadges: ['BLW'],
    stepsEs: [
      'Pepino pelado en bastones gruesos — sin semillas',
      'Refrigerar 10 min antes de servir — el frío ayuda a dentición',
      'Supervisar siempre — riesgo de atragantamiento moderado',
    ],
    stepsEn: [
      'Peeled cucumber in thick sticks — seeds removed',
      'Refrigerate 10 min before serving — cold helps teething',
      'Always supervise — moderate choking risk',
    ],
    adultVersionEs: 'Ensalada de pepino con yogur, ajo, menta y eneldo estilo tzatziki.',
    adultVersionEn: 'Cucumber salad with yogurt, garlic, mint and dill tzatziki style.',
    adultIngredientsEs: ['Yogur', 'Ajo', 'Menta', 'Eneldo'],
    adultIngredientsEn: ['Yogurt', 'Garlic', 'Mint', 'Dill'],
  },

  // ── ARROZ ─────────────────────────────────────────────────────────────
  {
    id: 'rice-porridge',
    foodIds: ['rice'],
    titleEs: 'Papilla de arroz',
    titleEn: 'Rice porridge',
    timeMin: 25,
    method: 'boil',
    methodBadges: ['Purés'],
    stepsEs: [
      'Arroz blanco cocido con el triple de agua 20 min',
      'Mixear hasta textura muy suave y cremosa',
      'Base neutra perfecta para mezclar con otros purés',
    ],
    stepsEn: [
      'White rice cooked with triple the water for 20 min',
      'Blend to very smooth creamy texture',
      'Neutral base perfect for mixing with other purées',
    ],
    adultVersionEs: 'Arroz con pollo colombiano con hogao, cilantro y aguacate.',
    adultVersionEn: 'Colombian chicken rice with hogao sauce, cilantro and avocado.',
    adultIngredientsEs: ['Hogao', 'Cilantro', 'Aguacate', 'Pollo'],
    adultIngredientsEn: ['Hogao sauce', 'Cilantro', 'Avocado', 'Chicken'],
  },
];

export function getRecipesByFoodId(foodId: string): Recipe[] {
  return RECIPES.filter(r => r.foodIds.includes(foodId));
}

export function getRecipesByIngredients(availableFoodIds: string[]): Recipe[] {
  return RECIPES.filter(r =>
    r.foodIds.every(id => availableFoodIds.includes(id))
  );
}
