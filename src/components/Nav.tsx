import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Page } from "../types";

export function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: { label: string; id: Page | "scroll-routes" }[] = [
    { label: "트레일 코스", id: "scroll-routes" },
    { label: "소식", id: "articles" },
    { label: "지도", id: "map" },
    { label: "이용 방법", id: "how-it-works" },
    { label: "자주 묻는 질문", id: "faq" },
    { label: "문의하기", id: "contact" },
    { label: "리뷰", id: "reviews" },
    { label: "About Us", id: "about" },
  ];
  const go = (p: Page) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };
  const goRoutes = () => {
    setMenuOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => {
        document.getElementById("featured-routes")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById("featured-routes")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleLink = (id: Page | "scroll-routes") => {
    if (id === "scroll-routes") goRoutes();
    else go(id as Page);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(244,239,227,0.92)] backdrop-blur-sm border-b border-[rgba(63,92,58,0.12)] text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go("home")} className="flex items-center gap-1.5">
            <span className="font-bold text-[21px] text-brand font-serif">동키로드</span>
            <span className="text-[11px] font-semibold tracking-[2.2px] text-[#8a9678] mt-0.5">DONKEYROAD</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button key={l.id} onClick={() => handleLink(l.id)}
                className={`text-sm font-medium px-3 py-2 rounded transition-colors hover:text-primary ${page === l.id ? "text-primary" : "text-muted-foreground"}`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => go("login")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">로그인</button>
            <button onClick={() => go("booking")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full transition-colors">
              짐 배송 예약
            </button>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-[rgba(63,92,58,0.1)] px-4 pb-4">
          {links.map(l => (
            <button key={l.id} onClick={() => handleLink(l.id)}
              className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground border-b border-[rgba(63,92,58,0.08)]">
              {l.label}
            </button>
          ))}
          <div className="flex gap-3 mt-4">
            <button onClick={() => go("login")} className="flex-1 text-sm border border-[rgba(63,92,58,0.3)] text-muted-foreground py-2 rounded-full text-center">로그인</button>
            <button onClick={() => go("booking")} className="flex-1 text-sm bg-primary text-primary-foreground py-2 rounded-full font-semibold text-center">짐 배송 예약</button>
          </div>
        </div>
      )}
    </nav>
  );
}
