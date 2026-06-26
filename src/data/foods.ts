export type FoodCategory = 'fruits' | 'vegetables' | 'proteins' | 'grains';
export type FoodStatus = 'available' | 'new' | 'avoid';
export type Reaction = 'loved' | 'normal' | 'disliked' | 'reaction' | null;

export interface Food {
  id: string;
  emoji: string;
  nameEs: string;
  nameEn: string;
  category: FoodCategory;
  fromMonths: number; // minimum age in months
  status: FoodStatus;
  isAllergen: boolean;
  chokingRisk: boolean;
  laxative?: boolean;
  flags?: string[]; // extra info flags
}

export interface FoodLog {
  foodId: string;
  tried: boolean;
  reaction: Reaction;
  notes: string;
  date: string;
}

export const FOODS: Food[] = [
  // ── FRUITS ────────────────────────────────────────────────────────
  { id: 'avocado',     emoji: '🥑', nameEs: 'Aguacate',     nameEn: 'Avocado',      category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false, laxative: true },
  { id: 'mango',       emoji: '🥭', nameEs: 'Mango',        nameEn: 'Mango',         category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'banana',      emoji: '🍌', nameEs: 'Banana',       nameEn: 'Banana',        category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'papaya',      emoji: '🍈', nameEs: 'Papaya',       nameEn: 'Papaya',        category: 'fruits',     fromMonths: 6,  status: 'new',       isAllergen: false, chokingRisk: false, laxative: true },
  { id: 'pear',        emoji: '🍐', nameEs: 'Pera',         nameEn: 'Pear',          category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'peach',       emoji: '🍑', nameEs: 'Durazno',      nameEn: 'Peach',         category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'apple',       emoji: '🍎', nameEs: 'Manzana',      nameEn: 'Apple',         category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'watermelon',  emoji: '🍉', nameEs: 'Sandía',       nameEn: 'Watermelon',    category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'blueberry',   emoji: '🫐', nameEs: 'Arándanos',    nameEn: 'Blueberries',   category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: true },
  { id: 'plum',        emoji: '🍑', nameEs: 'Ciruela',      nameEn: 'Plum',          category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false, laxative: true },
  { id: 'kiwi',        emoji: '🥝', nameEs: 'Kiwi',         nameEn: 'Kiwi',          category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'melon',       emoji: '🍈', nameEs: 'Melón',        nameEn: 'Melon',         category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'pineapple',   emoji: '🍍', nameEs: 'Piña',         nameEn: 'Pineapple',     category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'orange',      emoji: '🍊', nameEs: 'Naranja',      nameEn: 'Orange',        category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'guava',       emoji: '🍐', nameEs: 'Guayaba',      nameEn: 'Guava',         category: 'fruits',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'raspberry',   emoji: '🍒', nameEs: 'Frambuesa',    nameEn: 'Raspberry',     category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: true },
  { id: 'fig',         emoji: '🍑', nameEs: 'Higo',         nameEn: 'Fig',           category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'persimmon',   emoji: '🍊', nameEs: 'Caqui',        nameEn: 'Persimmon',     category: 'fruits',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'strawberry',  emoji: '🍓', nameEs: 'Fresa',        nameEn: 'Strawberry',    category: 'fruits',     fromMonths: 12, status: 'avoid',     isAllergen: true,  chokingRisk: false },

  // ── VEGETABLES ────────────────────────────────────────────────────
  { id: 'carrot',      emoji: '🥕', nameEs: 'Zanahoria',    nameEn: 'Carrot',        category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: true },
  { id: 'squash',      emoji: '🎃', nameEs: 'Calabaza',     nameEn: 'Squash',        category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'broccoli',    emoji: '🥦', nameEs: 'Brócoli',      nameEn: 'Broccoli',      category: 'vegetables', fromMonths: 6,  status: 'new',       isAllergen: false, chokingRisk: true },
  { id: 'sweetpotato', emoji: '🍠', nameEs: 'Batata',       nameEn: 'Sweet potato',  category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'cucumber',    emoji: '🥒', nameEs: 'Pepino',       nameEn: 'Cucumber',      category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: true },
  { id: 'cauliflower', emoji: '🥦', nameEs: 'Coliflor',     nameEn: 'Cauliflower',   category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'chayote',     emoji: '🫑', nameEs: 'Chayote',      nameEn: 'Chayote',       category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'beet',        emoji: '🫐', nameEs: 'Remolacha',    nameEn: 'Beet',          category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'asparagus',   emoji: '🌿', nameEs: 'Espárragos',   nameEn: 'Asparagus',     category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'corn',        emoji: '🌽', nameEs: 'Maíz',         nameEn: 'Corn',          category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'bellpepper',  emoji: '🫑', nameEs: 'Pimiento',     nameEn: 'Bell pepper',   category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'tomato',      emoji: '🍅', nameEs: 'Tomate',       nameEn: 'Tomato',        category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'zucchini',    emoji: '🥒', nameEs: 'Zucchini',     nameEn: 'Zucchini',      category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'artichoke',   emoji: '🌿', nameEs: 'Alcachofa',    nameEn: 'Artichoke',     category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'nopal',       emoji: '🌵', nameEs: 'Nopal',        nameEn: 'Nopal',         category: 'vegetables', fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'greenbeans',  emoji: '🫛', nameEs: 'Habichuelas',  nameEn: 'Green beans',   category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'peas',        emoji: '🫛', nameEs: 'Arvejas',      nameEn: 'Peas',          category: 'vegetables', fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: true },
  { id: 'spinach',     emoji: '🥬', nameEs: 'Espinacas',    nameEn: 'Spinach',       category: 'vegetables', fromMonths: 12, status: 'avoid',     isAllergen: false, chokingRisk: false },
  { id: 'celery',      emoji: '🌱', nameEs: 'Apio',         nameEn: 'Celery',        category: 'vegetables', fromMonths: 12, status: 'avoid',     isAllergen: false, chokingRisk: true },

  // ── PROTEINS ──────────────────────────────────────────────────────
  { id: 'chicken',     emoji: '🍗', nameEs: 'Pollo',        nameEn: 'Chicken',       category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'egg',         emoji: '🥚', nameEs: 'Huevo',        nameEn: 'Egg',           category: 'proteins',   fromMonths: 6,  status: 'new',       isAllergen: true,  chokingRisk: false },
  { id: 'lentils',     emoji: '🫘', nameEs: 'Lentejas',     nameEn: 'Lentils',       category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'beef',        emoji: '🥩', nameEs: 'Res',          nameEn: 'Beef',          category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'salmon',      emoji: '🐟', nameEs: 'Salmón',       nameEn: 'Salmon',        category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'blackbeans',  emoji: '🫘', nameEs: 'Frijoles negros', nameEn: 'Black beans', category: 'proteins',  fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'pork',        emoji: '🥩', nameEs: 'Cerdo',        nameEn: 'Pork',          category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'chickpeas',   emoji: '🫘', nameEs: 'Garbanzos',    nameEn: 'Chickpeas',     category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'tofu',        emoji: '🍱', nameEs: 'Tofu',         nameEn: 'Tofu',          category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'edamame',     emoji: '🫛', nameEs: 'Edamame',      nameEn: 'Edamame',       category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: true },
  { id: 'sardines',    emoji: '🐟', nameEs: 'Sardinas',     nameEn: 'Sardines',      category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'mackerel',    emoji: '🐠', nameEs: 'Macarela',     nameEn: 'Mackerel',      category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'lamb',        emoji: '🥩', nameEs: 'Cordero',      nameEn: 'Lamb',          category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'turkey',      emoji: '🍗', nameEs: 'Pavo',         nameEn: 'Turkey',        category: 'proteins',   fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'peanut',      emoji: '🥜', nameEs: 'Maní',         nameEn: 'Peanut',        category: 'proteins',   fromMonths: 6,  status: 'available', isAllergen: true,  chokingRisk: true },

  // ── GRAINS & STARCHES ─────────────────────────────────────────────
  { id: 'rice',        emoji: '🍚', nameEs: 'Arroz',        nameEn: 'Rice',          category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'oats',        emoji: '🥣', nameEs: 'Avena',        nameEn: 'Oats',          category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'potato',      emoji: '🥔', nameEs: 'Papa',         nameEn: 'Potato',        category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'cassava',     emoji: '🥔', nameEs: 'Yuca',         nameEn: 'Cassava',       category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'plantain',    emoji: '🍌', nameEs: 'Plátano',      nameEn: 'Plantain',      category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'quinoa',      emoji: '🌾', nameEs: 'Quinoa',       nameEn: 'Quinoa',        category: 'grains',     fromMonths: 6,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'pasta',       emoji: '🍝', nameEs: 'Pasta',        nameEn: 'Pasta',         category: 'grains',     fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'bread',       emoji: '🍞', nameEs: 'Pan',          nameEn: 'Bread',         category: 'grains',     fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'wheat',       emoji: '🌾', nameEs: 'Trigo',        nameEn: 'Wheat',         category: 'grains',     fromMonths: 8,  status: 'available', isAllergen: true,  chokingRisk: false },
  { id: 'taro',        emoji: '🥔', nameEs: 'Taro',         nameEn: 'Taro',          category: 'grains',     fromMonths: 8,  status: 'available', isAllergen: false, chokingRisk: false },
  { id: 'corn-tortilla', emoji: '🫓', nameEs: 'Tortilla de maíz', nameEn: 'Corn tortilla', category: 'grains', fromMonths: 8, status: 'available', isAllergen: false, chokingRisk: false },
];

export const FOOD_CATEGORIES: { id: FoodCategory; labelEs: string; labelEn: string }[] = [
  { id: 'fruits',     labelEs: 'Frutas',               labelEn: 'Fruits' },
  { id: 'vegetables', labelEs: 'Verduras',              labelEn: 'Vegetables' },
  { id: 'proteins',   labelEs: 'Proteínas',             labelEn: 'Proteins' },
  { id: 'grains',     labelEs: 'Cereales y tubérculos', labelEn: 'Grains & starches' },
];

export function getFoodsByCategory(category: FoodCategory): Food[] {
  return FOODS.filter(f => f.category === category);
}

export function getFoodById(id: string): Food | undefined {
  return FOODS.find(f => f.id === id);
}
