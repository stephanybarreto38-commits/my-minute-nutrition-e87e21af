import { useState } from 'react';
import { useAppStore } from './hooks/useAppStore';
import type { Lang } from './data/translations';
import { t } from './data/translations';
import { getFoodById } from './data/foods';

import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';

// Lazy screens — import inline to keep bundle manageable
import FoodDetailScreen from './screens/FoodDetailScreen';
import ShoppingScreen from './screens/ShoppingScreen';
import FridgeScreen from './screens/FridgeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MethodSheet from './components/MethodSheet';
import FoodQuickModal from './components/FoodQuickModal';

export default function App() {
  const store = useAppStore();
  const tx = t[store.lang];

  const [methodSheetOpen, setMethodSheetOpen] = useState(false);
  const [quickModalFoodId, setQuickModalFoodId] = useState<string | null>(null);

  const handleLangToggle = (lang: Lang) => store.setLang(lang);

  const handleFoodClick = (foodId: string) => {
    setQuickModalFoodId(foodId);
  };

  const babyMonths = store.getBabyAgeMonths();
  const babyWeek = 10; // TODO: derive from birthDate

  const selectedFood = store.selectedFoodId ? getFoodById(store.selectedFoodId) : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4">
      {/* Phone frame on desktop, full screen on mobile */}
      <div className="w-full max-w-sm bg-white flex flex-col min-h-screen md:min-h-0 md:h-[812px] md:rounded-2xl md:border md:border-gray-200 overflow-hidden shadow-sm">

        {/* SCREENS */}
        {store.screen === 'home' && (
          <HomeScreen
            lang={store.lang}
            method={store.method}
            babyName={store.baby.name}
            babyMonths={babyMonths}
            babyWeek={babyWeek}
            foodLogs={store.foodLogs}
            triedFoodIds={store.triedFoodIds}
            onFoodClick={handleFoodClick}
            onNavigate={store.navigateTo}
            onMethodOpen={() => setMethodSheetOpen(true)}
          />
        )}

        {store.screen === 'food-detail' && selectedFood && (
          <FoodDetailScreen
            lang={store.lang}
            food={selectedFood}
            log={store.foodLogs[selectedFood.id]}
            method={store.method}
            onBack={() => store.navigateTo('home')}
            onSaveLog={store.saveLog}
            onAddToShopping={store.addToShoppingList}
          />
        )}

        {store.screen === 'shopping' && (
          <ShoppingScreen
            lang={store.lang}
            items={store.shoppingList}
            onToggle={store.toggleShoppingItem}
            onClear={store.clearCheckedItems}
          />
        )}

        {store.screen === 'fridge' && (
          <FridgeScreen
            lang={store.lang}
            babyName={store.baby.name}
            triedFoodIds={store.triedFoodIds}
            onBack={() => store.navigateTo('home')}
            onFoodClick={(id) => {
              store.navigateTo('food-detail', id);
            }}
          />
        )}

        {store.screen === 'profile' && (
          <ProfileScreen
            lang={store.lang}
            baby={store.baby}
            babyMonths={babyMonths}
            method={store.method}
            foodLogs={store.foodLogs}
            totalFoods={120}
            onMethodChange={store.setMethod}
          />
        )}

        {/* BOTTOM NAV (hidden on food-detail and fridge) */}
        {store.screen !== 'food-detail' && store.screen !== 'fridge' && (
          <BottomNav
            current={store.screen}
            lang={store.lang}
            babyName={store.baby.name}
            onNavigate={(screen) => {
              store.navigateTo(screen);
            }}
          />
        )}
      </div>

      {/* METHOD SHEET */}
      {methodSheetOpen && (
        <MethodSheet
          lang={store.lang}
          current={store.method}
          onSelect={(m) => {
            store.setMethod(m);
            setMethodSheetOpen(false);
          }}
          onClose={() => setMethodSheetOpen(false)}
        />
      )}

      {/* FOOD QUICK MODAL */}
      {quickModalFoodId && (
        <FoodQuickModal
          lang={store.lang}
          food={getFoodById(quickModalFoodId)!}
          existingLog={store.foodLogs[quickModalFoodId]}
          onReact={(reaction) => {
            store.quickLog(quickModalFoodId, reaction);
            setQuickModalFoodId(null);
          }}
          onSeePrep={() => {
            store.navigateTo('food-detail', quickModalFoodId);
            setQuickModalFoodId(null);
          }}
          onClose={() => setQuickModalFoodId(null)}
        />
      )}
    </div>
  );
}
