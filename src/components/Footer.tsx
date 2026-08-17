import { MapPin, Phone, Mail } from "lucide-react";
import type { Page } from "../types";

export function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };
  return (
    <footer className="bg-[#28351f] text-[#9db184]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="font-bold text-on-dark text-[20px] font-serif">동키로드</span>
              <span className="text-[11px] font-semibold tracking-[2.2px] text-[#8ea079]">DONKEYROAD</span>
            </div>
            <p className="text-sm leading-relaxed">짐 없이 걷는 길, 짐이 지나며 살아나는 마을 — 동키로드</p>
          </div>
          <div>
            <h4 className="text-label-on-dark font-semibold mb-4 text-xs uppercase tracking-wider">서비스</h4>
            <ul className="space-y-2 text-sm">
              {[["이용 방법", "how-it-works"], ["짐 배송 예약", "booking"]].map(([label, id]) => (
                <li key={id}><button onClick={() => go(id as Page)} className="hover:text-on-dark transition-colors">{label}</button></li>
              ))}
              <li><button onClick={() => { go("home"); setTimeout(() => document.getElementById("featured-routes")?.scrollIntoView({ behavior: "smooth" }), 80); }} className="hover:text-on-dark transition-colors">트레일 코스</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label-on-dark font-semibold mb-4 text-xs uppercase tracking-wider">고객 지원</h4>
            <ul className="space-y-2 text-sm">
              {[["자주 묻는 질문", "faq"], ["문의하기", "contact"], ["로그인", "login"], ["마이페이지", "mypage"]].map(([label, id]) => (
                <li key={id}><button onClick={() => go(id as Page)} className="hover:text-on-dark transition-colors">{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-label-on-dark font-semibold mb-4 text-xs uppercase tracking-wider">연락처</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} className="text-[#8ea079]" /><span>카카오톡 채널 | 동키로드</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-[#8ea079]" /><span>donkeyroad.official@gmail.com</span></li>
              <li className="flex items-start gap-2"><MapPin size={14} className="text-[#8ea079] mt-0.5" /><span>인스타그램: @donkeyroad.official</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[rgba(195,208,166,0.16)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7c8f6b]">
          <p>상호 동키로드 주식회사 · 대표 김동키 · 사업자등록번호 123-45-67890 · 통신판매업 2026-서울마포-0000 · 서울특별시 마포구 월드컵북로 00 · 1588-0000 · hello@donkeyroad.kr · 개인정보보호책임자 이트레일</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <button onClick={() => go("terms")} className="hover:text-on-dark transition-colors">이용약관</button>
            <button onClick={() => go("privacy")} className="hover:text-on-dark transition-colors text-label-on-dark">개인정보처리방침</button>
            <button onClick={() => go("compensation")} className="hover:text-on-dark transition-colors">분실·파손 보상</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
