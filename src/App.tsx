import { useState, useEffect } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { getFoodById } from './data/foods';
import MilestoneToast from './components/MilestoneToast';
import BottomNav from './components/BottomNav';
import BabySwitcher from './components/BabySwitcher';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import AdminScreen from './screens/AdminScreen';
import FoodDetailScreen from './screens/FoodDetailScreen';
import ShoppingScreen from './screens/ShoppingScreen';
import FridgeScreen from './screens/FridgeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MethodSheet from './components/MethodSheet';
import FoodQuickModal from './components/FoodQuickModal';
import WorldRecipesScreen from './screens/WorldRecipesScreen';
import MyWeekScreen from './screens/MyWeekScreen';

export default function App() {
  const store = useAppStore();
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);
  const [quickModalFoodId, setQuickModalFoodId] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<{ foodId: string } | null>(null);
  const [inviteFlash, setInviteFlash] = useState<string | null>(null);

  const handleLangToggle = () => store.setLang(store.lang === 'es' ? 'en' : 'es');
  const handleFoodClick = (foodId: string) => setQuickModalFoodId(foodId);
  const handleAddBaby = () => store.navigateTo('onboarding');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('invite');
    const pending = fromUrl ?? sessionStorage.getItem('little_meal_pending_invite');
    if (!pending) return;
    if (fromUrl) sessionStorage.setItem('little_meal_pending_invite', fromUrl);
    if (!store.userId) return;
    (async () => {
      const ok = await store.acceptInvite(pending);
      if (ok) {
        setInviteFlash(store.lang === 'es' ? '¡Invitación aceptada!' : 'Invitation accepted!');
        setTimeout(() => setInviteFlash(null), 3000);
      }
      sessionStorage.removeItem('little_meal_pending_invite');
      const url = new URL(window.location.href);
      url.searchParams.delete('invite');
      window.history.replaceState({}, '', url.toString());
    })();
  }, [store.userId, store.acceptInvite, store.lang]);

  const babyMonths = store.getBabyAgeMonths();
  const babyWeek = store.baby.birthDate
    ? Math.max(0, Math.floor((Date.now() - new Date(store.baby.birthDate).getTime()) / (7 * 24 * 60 * 60 * 1000)))
    : 0;
  const selectedFood = store.selectedFoodId ? getFoodById(store.selectedFoodId) : null;
  const showBabySwitcher =
    store.babies.length > 1 &&
    store.screen !== 'login' &&
    store.screen !== 'onboarding';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-0 md:p-8 relative">
      {showBabySwitcher && (
        <div className="fixed top-3 right-3 z-40 md:absolute md:top-6 md:right-6">
          <BabySwitcher
            lang={store.lang}
            babies={store.babies}
            activeBabyId={store.activeBabyId}
            onSelect={store.setActiveBaby}
            onAddBaby={handleAddBaby}
          />
        </div>
      )}
      {inviteFlash && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full shadow">
          {inviteFlash}
        </div>
      )}
      <div className="w-full md:max-w-5xl md:bg-white md:rounded-3xl md:shadow-xl md:border md:border-gray-100 md:overflow-hidden flex flex-col md:flex-row md:min-h-[700px] md:max-h-[820px]">

        {/* ── SIDEBAR (desktop only) ─────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-56 bg-green-700 text-white flex-shrink-0">
          <div className="px-5 pt-7 pb-6 border-b border-green-600">
            <p className="text-xl font-semibold tracking-tight">🥑 Little Meal</p>
            <p className="text-[11px] text-green-300 mt-0.5">
              {store.baby.name ? `Hola, ${store.baby.name} 👶` : 'Alimentación saludable'}
            </p>
          </div>
          {store.screen !== 'onboarding' && store.screen !== 'login' && (() => {
            const NAV = [
              { screen: 'home' as const,          emoji: '🏠', label: store.lang === 'es' ? 'Inicio' : 'Home' },
              { screen: 'my-week' as const,       emoji: '📅', label: store.lang === 'es' ? 'Mi semana' : 'My week' },
              { screen: 'world-recipes' as const,  emoji: '🌍', label: store.lang === 'es' ? 'Mundo' : 'World' },
              { screen: 'fridge' as const,         emoji: '🧊', label: store.lang === 'es' ? 'Nevera' : 'Fridge' },
              { screen: 'shopping' as const,       emoji: '🛒', label: store.lang === 'es' ? 'Compras' : 'Shopping' },
              { screen: 'profile' as const,        emoji: '👤', label: store.lang === 'es' ? 'Perfil' : 'Profile' },
            ];
            return (
              <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {NAV.map(item => {
                  const active = store.screen === item.screen || (item.screen === 'home' && store.screen === 'food-detail');
                  return (
                    <button
                      key={item.screen}
                      onClick={() => store.navigateTo(item.screen)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                        active
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-green-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{item.emoji}</span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            );
          })()}
          <div className="px-4 pb-5 flex flex-col gap-2">
            {store.isAdmin && store.screen !== 'login' && store.screen !== 'onboarding' && (
              <button
                onClick={() => store.navigateTo('admin')}
                className={`w-full text-[11px] border rounded-lg py-1.5 transition-colors ${
                  store.screen === 'admin'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'text-amber-300 border-amber-500 hover:bg-amber-600/30'
                }`}
              >
                ⚙️ {store.lang === 'es' ? 'Panel Admin' : 'Admin Panel'}
              </button>
            )}
            <button
              onClick={handleLangToggle}
              className="w-full text-[11px] text-green-300 border border-green-600 rounded-lg py-1.5 hover:bg-green-600 transition-colors"
            >
              {store.lang === 'es' ? '🇺🇸 English' : '🇨🇴 Español'}
            </button>
            {store.userEmail && (
              <button
                onClick={store.logoutUser}
                className="w-full text-[11px] text-green-400 hover:text-white transition-colors py-1"
              >
                {store.lang === 'es' ? '↩ Cerrar sesión' : '↩ Sign out'}
              </button>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0 overflow-hidden bg-white">
          {store.screen === 'login' && (
            <LoginScreen
              lang={store.lang}
              onToggleLang={handleLangToggle}
              onLogin={store.loginUser}
            />
          )}
          {store.screen === 'onboarding' && (
            <OnboardingScreen
              lang={store.lang}
              onToggleLang={handleLangToggle}
              onComplete={store.completeOnboarding}
            />
          )}
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
              onToggleLang={handleLangToggle}
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
              onFoodClick={(id) => store.navigateTo('food-detail', id)}
            />
          )}
          {store.screen === 'world-recipes' && (
            <WorldRecipesScreen
              lang={store.lang}
              babyMonths={babyMonths}
            />
          )}
          {store.screen === 'my-week' && (
            <MyWeekScreen
              lang={store.lang}
              currentMethod={store.method}
              babyMonths={babyMonths}
              userKey={store.userId ?? store.userEmail ?? 'guest'}
              onMethodChange={store.setMethod}
              onAddToShopping={store.addWeekToShoppingList}
              onGoToShopping={() => store.navigateTo('shopping')}
            />
          )}
          {store.screen === 'admin' && store.isAdmin && (
            <AdminScreen
              lang={store.lang}
              onBack={() => store.navigateTo('home')}
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
              isAdmin={store.isAdmin}
              userEmail={store.userEmail}
              onOpenAdmin={() => store.navigateTo('admin')}
              onLogout={store.logoutUser}
              onToggleLang={handleLangToggle}
              onAddBaby={handleAddBaby}
              shareBaby={store.shareBaby}
              listShares={store.listShares}
              revokeShare={store.revokeShare}
            />
          )}
          {store.screen !== 'food-detail' && store.screen !== 'fridge' && store.screen !== 'login' && store.screen !== 'onboarding' && (
            <div className="md:hidden">
              <BottomNav
                current={store.screen}
                lang={store.lang}
                babyName={store.baby.name}
                onNavigate={(screen) => store.navigateTo(screen)}
              />
            </div>
          )}
        </div>
      </div>

      {methodSheetOpen && (
        <MethodSheet
          lang={store.lang}
          current={store.method}
          onSelect={(m) => { store.setMethod(m); setMethodSheetOpen(false); }}
          onClose={() => setMethodSheetOpen(false)}
        />
      )}
      {milestone && (() => {
        const food = getFoodById(milestone.foodId);
        if (!food) return null;
        return (
          <MilestoneToast
            lang={store.lang}
            babyName={store.baby.name}
            triedCount={store.triedFoodIds.length}
            lastFoodName={store.lang === 'es' ? food.nameEs : food.nameEn}
            lastFoodEmoji={food.emoji}
            lastFoodCategory={food.category}
            onDismiss={() => setMilestone(null)}
          />
        );
      })()}
      {quickModalFoodId && (
        <FoodQuickModal
          lang={store.lang}
          food={getFoodById(quickModalFoodId)!}
          existingLog={store.foodLogs[quickModalFoodId]}
          onReact={(reaction) => {
            store.quickLog(quickModalFoodId, reaction);
            setMilestone({ foodId: quickModalFoodId });
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
