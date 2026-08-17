import { useState } from "react";
import { X } from "lucide-react";
import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { AboutPage } from "../pages/AboutPage";
import { ArticleDetailPage } from "../pages/ArticleDetailPage";
import { ArticlesPage } from "../pages/ArticlesPage";
import { BookingPage } from "../pages/BookingPage";
import { ContactPage } from "../pages/ContactPage";
import { FAQPage } from "../pages/FAQPage";
import { HomePage } from "../pages/HomePage";
import { HowItWorksPage } from "../pages/HowItWorksPage";
import { LegalPage } from "../pages/LegalPage";
import { LoginPage } from "../pages/LoginPage";
import { MapPage } from "../pages/MapPage";
import { MyPage } from "../pages/MyPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import type { FeaturedRouteKey, HubPrefill, JourneyCart, Page } from "../types";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedRoute, setSelectedRoute] = useState<FeaturedRouteKey>("meet");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [carts, setCarts] = useState<JourneyCart[]>([]);
  const [bookingHubPrefill, setBookingHubPrefill] = useState<HubPrefill | null>(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const selectRouteGroup = (key: FeaturedRouteKey) => setSelectedRoute(key);
  const navigate = (p: Page) => { setPage(p); window.scrollTo(0, 0); };
  const saveCart = (cart: JourneyCart) => setCarts(prev => [cart, ...prev]);
  const payCart = (id: string) => setCarts(prev => prev.map(cart => cart.id === id ? { ...cart, status: "CONFIRMED", reservationNo: `DR-2026-${String(Math.floor(80000 + Math.random() * 9999))}` } : cart));

  return (
    <div className="min-h-screen bg-background font-sans">
      <Nav page={page} setPage={navigate} />
      <main>
        {page === "home" && <HomePage setPage={navigate} selectRoute={selectRouteGroup} />}
        {page === "articles" && <ArticlesPage onRead={(index) => { setSelectedArticleIndex(index); navigate("article-detail"); }} />}
        {page === "article-detail" && <ArticleDetailPage index={selectedArticleIndex} setPage={navigate} selectRoute={selectRouteGroup} />}
        {page === "map" && <MapPage selectRoute={selectRouteGroup} onStartJourney={(route, hub) => { selectRouteGroup(route); setBookingHubPrefill(hub); navigate("booking"); }} />}
        {page === "terms" && <LegalPage kind="terms" />}
        {page === "privacy" && <LegalPage kind="privacy" />}
        {page === "compensation" && <LegalPage kind="compensation" />}
        {page === "booking" && <BookingPage setPage={navigate} isLoggedIn={isLoggedIn} onNeedLogin={() => setLoginModalOpen(true)} onSaveCart={saveCart} initialRoute={selectedRoute} hubPrefill={bookingHubPrefill} />}
        {page === "how-it-works" && <HowItWorksPage setPage={navigate} />}
        {page === "faq" && <FAQPage />}
        {page === "contact" && <ContactPage />}
        {page === "login" && <LoginPage setPage={navigate} />}
        {page === "mypage" && <MyPage setPage={navigate} carts={carts} onPayCart={payCart} />}
        {page === "reviews" && <ReviewsPage />}
        {page === "about" && <AboutPage setPage={navigate} />}
      </main>
      {loginModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-foreground/10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-foreground">로그인이 필요합니다</h2><button onClick={() => setLoginModalOpen(false)}><X size={22} /></button></div>
            <p className="text-sm text-muted-foreground mb-5">여정을 장바구니에 담으려면 로그인해야 합니다. 지금까지 입력한 코스, 일정, 숙소, 가방 정보는 유지됩니다.</p>
            <input placeholder="이메일" className="w-full border border-foreground/20 rounded p-3 mb-3" />
            <input placeholder="비밀번호" type="password" className="w-full border border-foreground/20 rounded p-3 mb-4" />
            <button onClick={() => { setIsLoggedIn(true); setLoginModalOpen(false); }} className="w-full bg-surface-dark text-white py-3 rounded font-bold">로그인하고 계속하기</button>
            <button onClick={() => { setLoginModalOpen(false); navigate("login"); }} className="w-full mt-3 text-sm text-foreground underline">회원가입/비밀번호 재설정</button>
          </div>
        </div>
      )}
      {page !== "login" && <Footer setPage={navigate} />}
    </div>
  );
}
