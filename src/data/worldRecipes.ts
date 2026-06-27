export interface WorldRecipe {
  id: string;
  country: 'mexico' | 'india' | 'uk' | 'argentina' | 'espana' | 'uruguay' | 'chile';
  fromMonths: number;
  emoji: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  stepsEs: string[];
  stepsEn: string[];
  adultVersionEs: string;
  adultVersionEn: string;
  methodBadges: ('BLW' | 'BLISS' | 'Purés')[];
  timeMin: number;
}

export const COUNTRIES: {
  id: WorldRecipe['country'];
  flag: string;
  nameEs: string;
  nameEn: string;
}[] = [
  { id: 'mexico',    flag: '🇲🇽', nameEs: 'México',      nameEn: 'Mexico' },
  { id: 'india',     flag: '🇮🇳', nameEs: 'India',       nameEn: 'India' },
  { id: 'uk',        flag: '🇬🇧', nameEs: 'Reino Unido', nameEn: 'United Kingdom' },
  { id: 'argentina', flag: '🇦🇷', nameEs: 'Argentina',   nameEn: 'Argentina' },
  { id: 'espana',    flag: '🇪🇸', nameEs: 'España',      nameEn: 'Spain' },
  { id: 'uruguay',   flag: '🇺🇾', nameEs: 'Uruguay',     nameEn: 'Uruguay' },
  { id: 'chile',     flag: '🇨🇱', nameEs: 'Chile',       nameEn: 'Chile' },
];

export const WORLD_RECIPES: WorldRecipe[] = [
  // MÉXICO
  {
    id: 'mx-papaya-limon', country: 'mexico', fromMonths: 6, emoji: '🍈',
    titleEs: 'Papaya con limón suave', titleEn: 'Papaya with mild lime',
    descEs: 'Fruta tropical suave, perfecta como primer alimento. El toque de limón ayuda a la digestión.',
    descEn: 'Soft tropical fruit, perfect as a first food. A touch of lime aids digestion.',
    stepsEs: ['Papaya muy madura pelada y sin semillas', 'Cortar en tiras largas para BLW o machacar para purés', 'Unas gotitas de limón sin sal — solo para dar sabor suave'],
    stepsEn: ['Very ripe papaya, peeled and seeded', 'Cut in long strips for BLW or mash for purées', 'A few drops of lime — no salt, just mild flavor'],
    adultVersionEs: 'Papaya con limón, chile tajín y sal. Clásico mexicano.',
    adultVersionEn: 'Papaya with lime, tajín chili and salt. Classic Mexican.',
    methodBadges: ['BLW', 'Purés'], timeMin: 5,
  },
  {
    id: 'mx-frijoles-negros', country: 'mexico', fromMonths: 6, emoji: '🫘',
    titleEs: 'Frijoles negros aplastados', titleEn: 'Mashed black beans',
    descEs: 'Base de la dieta mexicana. Excelente fuente de hierro y proteína vegetal para bebés.',
    descEn: 'Staple of Mexican diet. Excellent source of iron and plant protein for babies.',
    stepsEs: ['Frijoles negros cocidos sin sal, aplastados con tenedor', 'Si están muy espesos agregar agua de cocción', 'BLW: formar pequeñas bolitas aplastadas en la bandeja'],
    stepsEn: ['Cooked black beans without salt, mashed with fork', 'If too thick add cooking water', 'BLW: form small flattened balls on the tray'],
    adultVersionEs: 'Frijoles de olla con epazote, cebolla y chile. Servir con tortillas.',
    adultVersionEn: 'Pot beans with epazote, onion and chili. Serve with tortillas.',
    methodBadges: ['BLW', 'BLISS', 'Purés'], timeMin: 10,
  },
  {
    id: 'mx-calabaza-canela', country: 'mexico', fromMonths: 6, emoji: '🎃',
    titleEs: 'Puré de calabaza con canela', titleEn: 'Pumpkin purée with cinnamon',
    descEs: 'Dulce y suave. La canela le da un sabor especial al estilo mexicano sin necesidad de azúcar.',
    descEn: 'Sweet and smooth. Cinnamon gives it a special Mexican-style flavor without sugar.',
    stepsEs: ['Calabaza en trozos al vapor 20 min o al horno 25 min', 'Machacar hasta textura muy suave', 'Agregar una pizca de canela — sin azúcar ni sal'],
    stepsEn: ['Pumpkin pieces steamed 20 min or baked 25 min', 'Mash to very smooth texture', 'Add a pinch of cinnamon — no sugar or salt'],
    adultVersionEs: 'Sopa de calabaza con crema, epazote y queso fresco.',
    adultVersionEn: 'Pumpkin soup with cream, epazote and fresh cheese.',
    methodBadges: ['Purés', 'BLW'], timeMin: 25,
  },
  {
    id: 'mx-aguacate-tortilla', country: 'mexico', fromMonths: 8, emoji: '🥑',
    titleEs: 'Aguacate en tortilla suave', titleEn: 'Avocado on soft tortilla',
    descEs: 'La tortilla de maíz blanda es perfecta para bebés de 8m+. Rica en energía y grasas saludables.',
    descEn: 'Soft corn tortilla is perfect for 8m+ babies. Rich in energy and healthy fats.',
    stepsEs: ['Tortilla de maíz calentada y cortada en tiras', 'Aguacate maduro aplastado encima', 'Servir doblada como taquito suave'],
    stepsEn: ['Warm corn tortilla cut into strips', 'Mashed ripe avocado on top', 'Serve folded as a soft little taco'],
    adultVersionEs: 'Tacos de guacamole con tomate, cebolla, cilantro y chile.',
    adultVersionEn: 'Guacamole tacos with tomato, onion, cilantro and chili.',
    methodBadges: ['BLW'], timeMin: 5,
  },
  // INDIA
  {
    id: 'in-khichdi', country: 'india', fromMonths: 6, emoji: '🍚',
    titleEs: 'Khichdi de arroz y lentejas', titleEn: 'Rice and lentil khichdi',
    descEs: 'El primer alimento tradicional de los bebés en India. Proteína completa, suave y nutritivo.',
    descEn: 'Traditional first food for babies in India. Complete protein, soft and nutritious.',
    stepsEs: ['Arroz y lentejas rojas en proporción 1:1, enjuagados', 'Cocinar con 4 partes de agua 20–25 min hasta muy suave', 'Mixear hasta papilla o dejar con textura para BLW'],
    stepsEn: ['Rice and red lentils 1:1 ratio, rinsed', 'Cook with 4 parts water 20–25 min until very soft', 'Blend to porridge or leave textured for BLW'],
    adultVersionEs: 'Khichdi adulto con ghee, comino, cúrcuma y cilantro fresco.',
    adultVersionEn: 'Adult khichdi with ghee, cumin, turmeric and fresh cilantro.',
    methodBadges: ['Purés', 'BLW'], timeMin: 30,
  },
  {
    id: 'in-sweet-potato-dal', country: 'india', fromMonths: 6, emoji: '🍠',
    titleEs: 'Dal de batata y lentejas', titleEn: 'Sweet potato and lentil dal',
    descEs: 'Combinación rica en hierro y betacaroteno. La cúrcuma tiene propiedades antiinflamatorias.',
    descEn: 'Combination rich in iron and beta-carotene. Turmeric has anti-inflammatory properties.',
    stepsEs: ['Lentejas rojas cocidas 20 min', 'Batata al vapor 15 min, aplastada', 'Mezclar con una pizca de cúrcuma — sin sal'],
    stepsEn: ['Red lentils cooked 20 min', 'Sweet potato steamed 15 min, mashed', 'Mix with a pinch of turmeric — no salt'],
    adultVersionEs: 'Dal tadka con ghee, ajo, comino, tomate y garam masala.',
    adultVersionEn: 'Dal tadka with ghee, garlic, cumin, tomato and garam masala.',
    methodBadges: ['Purés', 'BLISS'], timeMin: 25,
  },
  {
    id: 'in-banana-cardamom', country: 'india', fromMonths: 6, emoji: '🍌',
    titleEs: 'Banana con cardamomo', titleEn: 'Banana with cardamom',
    descEs: 'Postre tradicional indio para bebés. El cardamomo es suave y ayuda a la digestión.',
    descEn: 'Traditional Indian baby dessert. Cardamom is gentle and aids digestion.',
    stepsEs: ['Banana madura aplastada con tenedor', 'Una pizca muy pequeña de cardamomo en polvo', 'Mezclar bien y servir a temperatura ambiente'],
    stepsEn: ['Ripe banana mashed with fork', 'A very small pinch of cardamom powder', 'Mix well and serve at room temperature'],
    adultVersionEs: 'Lassi de banana con yogur, cardamomo y una gotita de miel.',
    adultVersionEn: 'Banana lassi with yogurt, cardamom and a drop of honey.',
    methodBadges: ['Purés', 'BLW'], timeMin: 3,
  },
  {
    id: 'in-sabudana', country: 'india', fromMonths: 8, emoji: '🥣',
    titleEs: 'Papilla de tapioca (Sabudana)', titleEn: 'Tapioca porridge (Sabudana)',
    descEs: 'Fácil de digerir, rica en energía. Popular en India para bebés que inician la alimentación.',
    descEn: 'Easy to digest, energy-rich. Popular in India for babies starting solids.',
    stepsEs: ['Tapioca remojada 4 horas, enjuagada', 'Cocinar en agua 10 min hasta transparente y suave', 'Agregar leche materna para cremosidad'],
    stepsEn: ['Tapioca soaked 4 hours, rinsed', 'Cook in water 10 min until transparent and soft', 'Add breast milk for creaminess'],
    adultVersionEs: 'Sabudana khichdi con maní, papa, comino y cilantro.',
    adultVersionEn: 'Sabudana khichdi with peanuts, potato, cumin and cilantro.',
    methodBadges: ['Purés'], timeMin: 15,
  },
  // REINO UNIDO
  {
    id: 'uk-porridge', country: 'uk', fromMonths: 6, emoji: '🥣',
    titleEs: 'Porridge de avena con pera', titleEn: 'Oat porridge with pear',
    descEs: 'El desayuno clásico británico adaptado para bebés. La pera endulza naturalmente sin azúcar.',
    descEn: 'Classic British breakfast adapted for babies. Pear naturally sweetens without sugar.',
    stepsEs: ['Avena fina cocida con agua o leche materna 5 min', 'Pera pelada al vapor 8 min y aplastada', 'Mezclar las dos preparaciones'],
    stepsEn: ['Fine oats cooked with water or breast milk 5 min', 'Peeled pear steamed 8 min and mashed', 'Mix both preparations together'],
    adultVersionEs: 'Porridge con canela, miel, nueces y frutos rojos frescos.',
    adultVersionEn: 'Porridge with cinnamon, honey, walnuts and fresh berries.',
    methodBadges: ['Purés', 'BLW'], timeMin: 15,
  },
  {
    id: 'uk-roast-veg', country: 'uk', fromMonths: 6, emoji: '🥦',
    titleEs: 'Verduras asadas al horno', titleEn: 'Oven roasted vegetables',
    descEs: 'El asado al horno es muy popular en UK. Resalta el sabor dulce natural de las verduras sin sal.',
    descEn: 'Oven roasting is very popular in UK. Enhances natural sweetness of vegetables without salt.',
    stepsEs: ['Zanahoria, calabaza y chirivía en trozos al horno 200°C 25 min', 'Sin aceite ni sal para bebés — las verduras sueltan su jugo', 'BLW: servir en trozos. Purés: triturar con agua de cocción'],
    stepsEn: ['Carrot, squash and parsnip chunks in oven 200°C 25 min', 'No oil or salt for babies — vegetables release their own juice', 'BLW: serve in chunks. Purée: blend with cooking water'],
    adultVersionEs: 'Mismas verduras con aceite de oliva, romero, ajo y sal marina.',
    adultVersionEn: 'Same vegetables with olive oil, rosemary, garlic and sea salt.',
    methodBadges: ['BLW', 'Purés'], timeMin: 30,
  },
  {
    id: 'uk-fish-pie', country: 'uk', fromMonths: 8, emoji: '🐟',
    titleEs: 'Fish pie de salmón y papa', titleEn: 'Salmon and potato fish pie',
    descEs: 'Versión baby del clásico fish pie inglés. Rico en omega-3 y proteína de alta calidad.',
    descEn: 'Baby version of the classic English fish pie. Rich in omega-3 and high quality protein.',
    stepsEs: ['Salmón al vapor 10 min, desmenuzado sin piel ni espinas', 'Papa cocida y aplastada con leche materna', 'Mezclar suavemente — verificar que no haya espinas'],
    stepsEn: ['Salmon steamed 10 min, flaked without skin or bones', 'Potato cooked and mashed with breast milk', 'Gently mix — double-check for bones'],
    adultVersionEs: 'Fish pie con salsa bechamel, guisantes, huevo duro y costra de puré.',
    adultVersionEn: 'Fish pie with bechamel sauce, peas, hard-boiled egg and mashed potato topping.',
    methodBadges: ['Purés', 'BLW'], timeMin: 25,
  },
  // ARGENTINA
  {
    id: 'ar-zapallo', country: 'argentina', fromMonths: 6, emoji: '🎃',
    titleEs: 'Puré de zapallo', titleEn: 'Pumpkin purée',
    descEs: 'El zapallo es uno de los primeros alimentos en Argentina. Suave, dulce y lleno de vitamina A.',
    descEn: 'Pumpkin is one of the first foods in Argentina. Soft, sweet and full of vitamin A.',
    stepsEs: ['Zapallo en trozos cocido al vapor 20 min o hervido', 'Machacar con tenedor o mixear hasta textura deseada', 'BLW: dejar en trozos blandos grandes'],
    stepsEn: ['Pumpkin pieces steamed 20 min or boiled', 'Mash with fork or blend to desired texture', 'BLW: leave in large soft pieces'],
    adultVersionEs: 'Sopa crema de zapallo con crema de leche, nuez moscada y pan tostado.',
    adultVersionEn: 'Creamy pumpkin soup with cream, nutmeg and toasted bread.',
    methodBadges: ['Purés', 'BLW'], timeMin: 25,
  },
  {
    id: 'ar-pure-mixto', country: 'argentina', fromMonths: 6, emoji: '🥕',
    titleEs: 'Puré mixto de verduras', titleEn: 'Mixed vegetable purée',
    descEs: 'Clásico en Argentina. Papa, zanahoria y zapallo juntos forman un puré completo y nutritivo.',
    descEn: 'Classic in Argentina. Potato, carrot and pumpkin together make a complete nutritious purée.',
    stepsEs: ['Papa, zanahoria y zapallo en trozos, hervidos 20 min', 'Machacar juntos agregando agua de cocción', 'Sin sal, sin manteca — los vegetales tienen suficiente sabor'],
    stepsEn: ['Potato, carrot and pumpkin in pieces, boiled 20 min', 'Mash together adding cooking water', 'No salt, no butter — vegetables have enough flavor'],
    adultVersionEs: 'Puré de papas con manteca, sal, pimienta y cebolla de verdeo.',
    adultVersionEn: 'Mashed potatoes with butter, salt, pepper and spring onion.',
    methodBadges: ['Purés'], timeMin: 25,
  },
  {
    id: 'ar-pollo-hervido', country: 'argentina', fromMonths: 6, emoji: '🍗',
    titleEs: 'Pollo hervido desmechado', titleEn: 'Shredded boiled chicken',
    descEs: 'Forma tradicional argentina de preparar pollo para bebés. El caldo sin sal es nutritivo.',
    descEn: 'Traditional Argentine way to prepare chicken for babies. The no-salt broth is nutritious.',
    stepsEs: ['Pechuga de pollo hervida 25 min en agua sin sal', 'Desmechar muy fino con dos tenedores', 'Mezclar con el caldo de cocción para humedad'],
    stepsEn: ['Chicken breast boiled 25 min in water without salt', 'Shred very finely with two forks', 'Mix with cooking broth for moisture'],
    adultVersionEs: 'Sopa de pollo con fideos, zanahoria, apio y cebolla.',
    adultVersionEn: 'Chicken soup with noodles, carrot, celery and onion.',
    methodBadges: ['BLW', 'BLISS', 'Purés'], timeMin: 30,
  },
  {
    id: 'ar-banana-avena', country: 'argentina', fromMonths: 6, emoji: '🍌',
    titleEs: 'Papilla de banana y avena', titleEn: 'Banana and oat porridge',
    descEs: 'Desayuno clásico argentino para bebés. Energético y fácil de preparar.',
    descEn: 'Classic Argentine baby breakfast. Energetic and easy to prepare.',
    stepsEs: ['Avena fina cocida con agua 5 min', 'Banana madura aplastada y agregada al final', 'Mezclar bien — la banana endulza naturalmente'],
    stepsEn: ['Fine oats cooked with water 5 min', 'Ripe banana mashed and added at the end', 'Mix well — banana naturally sweetens'],
    adultVersionEs: 'Overnight oats con banana, miel, chía y granola casera.',
    adultVersionEn: 'Overnight oats with banana, honey, chia and homemade granola.',
    methodBadges: ['Purés', 'BLW'], timeMin: 10,
  },
  // ESPAÑA
  {
    id: 'es-crema-verduras', country: 'espana', fromMonths: 6, emoji: '🥦',
    titleEs: 'Crema de verduras española', titleEn: 'Spanish vegetable cream',
    descEs: 'La crema de verduras es el primer plato español por excelencia para bebés. Nutritiva y suave.',
    descEn: 'Vegetable cream is the quintessential Spanish first dish for babies. Nutritious and smooth.',
    stepsEs: ['Calabacín, zanahoria, judías verdes y puerro cocidos 20 min', 'Mixear con agua de cocción hasta textura muy fina', 'Sin sal — las verduras ya tienen sabor suficiente'],
    stepsEn: ['Zucchini, carrot, green beans and leek cooked 20 min', 'Blend with cooking water to very fine texture', 'No salt — vegetables already have enough flavor'],
    adultVersionEs: 'Misma crema con aceite de oliva virgen extra, sal y picatostes.',
    adultVersionEn: 'Same cream with extra virgin olive oil, salt and croutons.',
    methodBadges: ['Purés'], timeMin: 25,
  },
  {
    id: 'es-papilla-cereales', country: 'espana', fromMonths: 6, emoji: '🥣',
    titleEs: 'Papilla de cereales con fruta', titleEn: 'Cereal porridge with fruit',
    descEs: 'Las papillas de cereales sin gluten (arroz, maíz) son muy populares en España para iniciar.',
    descEn: 'Gluten-free cereal porridges (rice, corn) are very popular in Spain for starting solids.',
    stepsEs: ['Harina de arroz o maíz cocida con agua o leche materna', 'Pera o manzana al vapor aplastada mezclada encima', 'Consistencia líquida al inicio, ir espesando gradualmente'],
    stepsEn: ['Rice or corn flour cooked with water or breast milk', 'Steamed and mashed pear or apple mixed in', 'Liquid consistency at start, gradually thickening'],
    adultVersionEs: 'Arroz con leche español con canela y limón.',
    adultVersionEn: 'Spanish rice pudding with cinnamon and lemon.',
    methodBadges: ['Purés'], timeMin: 15,
  },
  {
    id: 'es-merluza', country: 'espana', fromMonths: 8, emoji: '🐟',
    titleEs: 'Merluza al vapor con patata', titleEn: 'Steamed hake with potato',
    descEs: 'La merluza es el pescado blanco más usado en España para bebés. Suave y de sabor delicado.',
    descEn: 'Hake is the most used white fish in Spain for babies. Mild and delicate flavor.',
    stepsEs: ['Merluza sin piel ni espinas al vapor 8 min', 'Patata cocida aplastada con un poco de aceite de oliva', 'Servir juntos — verificar siempre que no haya espinas'],
    stepsEn: ['Skinless boneless hake steamed 8 min', 'Cooked potato mashed with a little olive oil', 'Serve together — always check for bones'],
    adultVersionEs: 'Merluza a la romana con patatas fritas y ensalada.',
    adultVersionEn: 'Battered hake with french fries and salad.',
    methodBadges: ['Purés', 'BLW'], timeMin: 20,
  },
  // URUGUAY
  {
    id: 'uy-puchero', country: 'uruguay', fromMonths: 6, emoji: '🥕',
    titleEs: 'Puchero de verduras uruguayo', titleEn: 'Uruguayan vegetable puchero',
    descEs: 'El puchero es el caldo nutritivo clásico uruguayo. Para bebés se usan solo las verduras.',
    descEn: 'Puchero is the classic Uruguayan nutritious broth. For babies only the vegetables are used.',
    stepsEs: ['Zanahoria, choclo, papa y zapallo hervidos 25 min en agua', 'Separar las verduras y machacarlas con agua de cocción', 'El caldo puede ofrecerse solo como bebida'],
    stepsEn: ['Carrot, corn, potato and pumpkin boiled 25 min in water', 'Separate vegetables and mash with cooking water', 'The broth can be offered alone as a drink'],
    adultVersionEs: 'Puchero completo con carne, chorizo, morcilla y garbanzos.',
    adultVersionEn: 'Full puchero with meat, chorizo, blood sausage and chickpeas.',
    methodBadges: ['Purés', 'BLW'], timeMin: 30,
  },
  {
    id: 'uy-batata', country: 'uruguay', fromMonths: 6, emoji: '🍠',
    titleEs: 'Batata asada uruguaya', titleEn: 'Uruguayan baked sweet potato',
    descEs: 'En Uruguay la batata asada es un clásico. Para bebés sin miel — el dulzor natural es suficiente.',
    descEn: 'In Uruguay baked sweet potato is a classic. For babies without honey — natural sweetness is enough.',
    stepsEs: ['Batata entera al horno 180°C por 40 min hasta muy blanda', 'Abrir y extraer la pulpa suave', 'Sin miel (prohibida hasta 12 meses) — es naturalmente dulce'],
    stepsEn: ['Whole sweet potato in oven 180°C for 40 min until very soft', 'Open and scoop out the soft flesh', 'No honey (forbidden until 12 months) — naturally sweet'],
    adultVersionEs: 'Batata asada con manteca, sal y un toque de miel.',
    adultVersionEn: 'Baked sweet potato with butter, salt and a touch of honey.',
    methodBadges: ['Purés', 'BLW'], timeMin: 40,
  },
  {
    id: 'uy-arroz-leche', country: 'uruguay', fromMonths: 8, emoji: '🍚',
    titleEs: 'Arroz cremoso con leche materna', titleEn: 'Creamy rice with breast milk',
    descEs: 'Versión baby del arroz con leche uruguayo. Sin azúcar, sin canela en exceso.',
    descEn: 'Baby version of Uruguayan rice pudding. No sugar, no excess cinnamon.',
    stepsEs: ['Arroz blanco cocido hasta muy suave con el triple de agua', 'Agregar leche materna al final para cremosidad', 'Opcionalmente una pizca muy pequeña de canela'],
    stepsEn: ['White rice cooked very soft with triple the water', 'Add breast milk at the end for creaminess', 'Optionally a very small pinch of cinnamon'],
    adultVersionEs: 'Arroz con leche con azúcar, canela, ralladura de limón y vainilla.',
    adultVersionEn: 'Rice pudding with sugar, cinnamon, lemon zest and vanilla.',
    methodBadges: ['Purés'], timeMin: 25,
  },
  // CHILE
  {
    id: 'cl-pure-chileno', country: 'chile', fromMonths: 6, emoji: '🥔',
    titleEs: 'Puré chileno de papa y zanahoria', titleEn: 'Chilean potato and carrot purée',
    descEs: 'El puré es el primer alimento de los bebés chilenos. Papa y zanahoria son la combinación clásica.',
    descEn: 'Purée is the first food for Chilean babies. Potato and carrot are the classic combination.',
    stepsEs: ['Papa y zanahoria peladas, cocidas 20 min hasta muy blandas', 'Machacar juntas con agua de cocción sin sal', 'Textura debe ser muy suave sin grumos'],
    stepsEn: ['Peeled potato and carrot, cooked 20 min until very soft', 'Mash together with cooking water without salt', 'Texture should be very smooth without lumps'],
    adultVersionEs: 'Puré chileno con mantequilla, sal y leche. Acompañar con carne.',
    adultVersionEn: 'Chilean mashed potatoes with butter, salt and milk. Serve with meat.',
    methodBadges: ['Purés'], timeMin: 25,
  },
  {
    id: 'cl-cazuela', country: 'chile', fromMonths: 6, emoji: '🍲',
    titleEs: 'Cazuela de verduras para bebé', titleEn: 'Baby vegetable cazuela',
    descEs: 'Versión baby de la cazuela chilena. Solo verduras, sin sal, rico en nutrientes.',
    descEn: 'Baby version of Chilean cazuela. Vegetables only, no salt, rich in nutrients.',
    stepsEs: ['Zapallo, choclo, papa y zanahoria en caldo de agua sin sal', 'Hervir 25 min — las verduras absorben el sabor del choclo', 'Triturar o servir en trozos según el método'],
    stepsEn: ['Pumpkin, corn, potato and carrot in unsalted water broth', 'Boil 25 min — vegetables absorb the corn flavor', 'Blend or serve in pieces depending on method'],
    adultVersionEs: 'Cazuela chilena completa con pollo, papas, choclo y cilantro.',
    adultVersionEn: 'Full Chilean cazuela with chicken, potatoes, corn and cilantro.',
    methodBadges: ['Purés', 'BLW'], timeMin: 30,
  },
  {
    id: 'cl-salmon-papas', country: 'chile', fromMonths: 8, emoji: '🐟',
    titleEs: 'Salmón del sur al vapor con papas', titleEn: 'Southern-style steamed salmon with potatoes',
    descEs: 'Chile es el segundo productor de salmón del mundo. Fresco y rico en omega-3 para el desarrollo cerebral.',
    descEn: "Chile is the world's second salmon producer. Fresh and rich in omega-3 for brain development.",
    stepsEs: ['Filete de salmón fresco al vapor 10 min sin piel ni espinas', 'Papa cocida y aplastada suavemente', 'Desmenuzar el salmón en láminas grandes verificando espinas'],
    stepsEn: ['Fresh salmon fillet steamed 10 min without skin or bones', 'Potato gently cooked and mashed', 'Flake salmon into large pieces checking for bones'],
    adultVersionEs: 'Salmón al horno con papas, limón, alcaparras y eneldo.',
    adultVersionEn: 'Baked salmon with potatoes, lemon, capers and dill.',
    methodBadges: ['BLW', 'Purés'], timeMin: 20,
  },
];

export function getRecipesByCountry(country: WorldRecipe['country']): WorldRecipe[] {
  return WORLD_RECIPES.filter(r => r.country === country);
}
