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
  {
    id: 'broccoli-chicken',
    foodIds: ['broccoli', 'chicken'],
    titleEs: 'Brócoli al vapor con pollo',
    titleEn: 'Steamed broccoli with chicken',
    timeMin: 20,
    method: 'steam',
    methodBadges: ['BLW', 'BLISS'],
    stepsEs: [
      'Vapor brócoli en ramas largas 8 min',
      'Pollo desmenuzado al vapor 20 min',
      'Servir juntos en la bandeja de bebé',
    ],
    stepsEn: [
      'Steam broccoli florets 8 min',
      'Shred chicken and steam 20 min',
      'Serve together on baby\'s tray',
    ],
    adultVersionEs: 'Salteado de brócoli + pollo con ajo, salsa de soya, aceite de sésamo y arroz integral. Listo en 15 min.',
    adultVersionEn: 'Broccoli + chicken stir-fry with garlic, soy sauce, sesame oil and brown rice. Ready in 15 min.',
    adultIngredientsEs: ['Ajo', 'Salsa de soya', 'Aceite de sésamo', 'Arroz integral'],
    adultIngredientsEn: ['Garlic', 'Soy sauce', 'Sesame oil', 'Brown rice'],
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
    adultVersionEs: 'Sopa crema de brócoli y camote con cebolla, ajo y caldo de pollo. Agregar crema de coco al final.',
    adultVersionEn: 'Creamy broccoli and sweet potato soup with onion, garlic and chicken stock. Finish with coconut cream.',
    adultIngredientsEs: ['Cebolla', 'Ajo', 'Caldo de pollo', 'Crema de coco'],
    adultIngredientsEn: ['Onion', 'Garlic', 'Chicken stock', 'Coconut cream'],
  },
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
    adultVersionEs: 'Pollo al horno con zanahorias glaseadas con miel (solo para adultos), romero y ajo.',
    adultVersionEn: 'Roasted chicken with honey-glazed carrots (adults only), rosemary and garlic.',
    adultIngredientsEs: ['Miel', 'Romero', 'Ajo', 'Aceite de oliva'],
    adultIngredientsEn: ['Honey', 'Rosemary', 'Garlic', 'Olive oil'],
  },
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
  {
    id: 'lentil-mash',
    foodIds: ['lentils', 'sweetpotato'],
    titleEs: 'Puré de lentejas y batata',
    titleEn: 'Lentil and sweet potato mash',
    timeMin: 35,
    method: 'boil',
    methodBadges: ['Purés', 'BLW'],
    stepsEs: [
      'Cocinar lentejas 30 min hasta que ablanden',
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
];

export function getRecipesByFoodId(foodId: string): Recipe[] {
  return RECIPES.filter(r => r.foodIds.includes(foodId));
}

export function getRecipesByIngredients(availableFoodIds: string[]): Recipe[] {
  return RECIPES.filter(r =>
    r.foodIds.every(id => availableFoodIds.includes(id))
  );
}
