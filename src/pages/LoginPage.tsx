import { useState } from "react";
import { Backpack } from "lucide-react";
import type { Page } from "../types";

export function LoginPage({ setPage }: { setPage: (p: Page) => void }) {
  const [tab, setTab] = useState<"login" | "signup" | "reset">("login");
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, age: false, marketing: false });
  const canSignup = agreements.terms && agreements.privacy && agreements.age;
  return (
    <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Backpack size={24} className="text-foreground" />
            <span className="text-xl font-bold text-foreground">DonkeyRoad</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{tab === "login" ? "로그인" : tab === "signup" ? "회원가입" : "비밀번호 재설정"}</h1>
        </div>
        <div className="bg-card rounded-lg border border-foreground/10 p-8">
          <div className="flex mb-6 border-b border-foreground/10">
            {[["login", "로그인"], ["signup", "회원가입"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id as "login" | "signup")}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${tab === id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">이름</label>
                <input placeholder="홍길동" className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">이메일</label>
              <input type="email" placeholder="example@email.com" className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">비밀번호</label>
              <input type="password" placeholder="비밀번호를 입력하세요" className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
            </div>
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">비밀번호 확인</label>
                <input type="password" placeholder="비밀번호를 다시 입력하세요" className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
              </div>
            )}
            {tab === "signup" && (
              <div className="bg-background rounded p-4 space-y-2 text-xs text-muted-foreground">
                {[ ["terms", "이용약관 동의(필수)"], ["privacy", "개인정보 수집·이용 동의(필수)"], ["age", "만 14세 이상 확인(필수)"], ["marketing", "마케팅 정보 수신 동의(선택)"] ].map(([id, label]) => (
                  <label key={id} className="flex items-center justify-between gap-2 text-xs cursor-pointer"><span><input type="checkbox" checked={agreements[id as keyof typeof agreements]} onChange={e => setAgreements(a => ({ ...a, [id]: e.target.checked }))} className="mr-2" />{label}</span><button type="button" className="underline text-foreground">전문 보기</button></label>
                ))}
              </div>
            )}
            <button disabled={tab === "signup" && !canSignup} onClick={() => { setPage("mypage"); window.scrollTo(0, 0); }}
              className={`w-full text-white font-bold py-3 rounded transition-colors ${tab === "signup" && !canSignup ? "bg-surface-dark/40 cursor-not-allowed" : "bg-surface-dark hover:bg-brand"}`}>
              {tab === "login" ? "로그인" : tab === "signup" ? "회원가입" : "재설정 메일 보내기"}
            </button>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground space-x-2">
            <button onClick={() => setTab(tab === "login" ? "signup" : "login")} className="text-foreground font-semibold underline">{tab === "login" ? "회원가입" : "로그인"}</button>
            <span>·</span>
            <button onClick={() => setTab("reset")} className="text-foreground font-semibold underline">비밀번호 재설정</button>
            <p className="mt-2">로그인 5회 연속 실패 시 5분간 시도가 제한됩니다.</p>
          </div>
          <div className="mt-6 pt-6 border-t border-foreground/10">
            <p className="text-xs text-center text-muted-foreground mb-3">소셜 계정으로 빠르게 {tab === "login" ? "로그인" : "가입"}하기</p>
            <div className="grid grid-cols-2 gap-3">
              {["카카오로 시작하기", "네이버로 시작하기"].map(b => (
                <button key={b} className="py-2.5 border-2 border-foreground/15 rounded text-xs font-semibold text-foreground hover:bg-secondary transition-colors">{b}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
