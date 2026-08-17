import { useState } from "react";
import { Check, Truck } from "lucide-react";
import { BOOKING_OPTIONS } from "../data/service";

export function ServiceProductsSection({ onBook }: { onBook: () => void }) {
  const [activeTab, setActiveTab] = useState<"basic" | "options" | "tour">("basic");

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">서비스 구성</p>
          <h2 className="text-4xl font-bold text-foreground font-serif">필요한 것만 골라 담는<br />트레일 여행 서비스</h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-xl mx-auto">짐배송을 기본으로, 텐트·미식 옵션은 필요할 때만 추가하세요.<br />내 여행 방식대로 구성할 수 있습니다.</p>
        </div>

        {/* Tab */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-background rounded-full p-1 gap-1">
            {([["basic", "① 기본 — 짐배송"], ["options", "② 옵션 선택"], ["tour", "③ 캠핑 투어"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === key ? "bg-surface-dark text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ① 기본 */}
        {activeTab === "basic" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-2xl overflow-hidden border border-foreground/10">
              <div className="bg-surface-dark px-6 py-4">
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">① 기본 상품</p>
                <h3 className="text-2xl font-bold text-white font-serif">짐배송</h3>
                <p className="text-white/70 text-sm mt-1">가방·구간당 정찰제 — 다음 숙소·야영장·락커로 배송</p>
              </div>
              <div className="divide-y divide-foreground/8">
                {[
                  { label: "짐배송 단건", desc: "가방 1개 · 구간 1회", price: "15,000~20,000원", badge: null },
                  { label: "다구간 선결제", desc: "2구간 이상 선결제 시 할인 적용", price: "구간당 17,000원 내외", badge: "할인" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between px-6 py-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-foreground text-sm">{row.label}</span>
                        {row.badge && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{row.badge}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{row.desc}</p>
                    </div>
                    <span className="font-bold text-foreground text-sm shrink-0">{row.price}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-secondary text-xs text-[#6a5c48] flex gap-2">
                <span>※</span><span>가방 1개당 15kg 이하, 1인 최대 3개 · 오전 08:00 인계 → 당일 오후 16:00 목표 도착 · 분실·파손 보상 최대 12만 원</span>
              </div>
            </div>
            <div className="text-center mt-8">
              <button onClick={onBook} className="bg-primary hover:bg-primary-hover text-white font-bold px-10 py-4 rounded-full transition-colors">짐 배송 예약하기</button>
            </div>
          </div>
        )}

        {/* ② 옵션 */}
        {activeTab === "options" && (
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-8">짐배송 예약 시 1인·1박 기준으로 필요한 옵션만 선택해 추가합니다.<br />음식·주류는 지역 주민이 판매·환불 주체이며, 동키로드는 예약·연결만 담당합니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BOOKING_OPTIONS.map(opt => (
                <div key={opt.id} className="bg-background border border-foreground/10 rounded-xl p-5 flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-surface-dark flex items-center justify-center shrink-0">
                    {opt.id === "tent-rental" && <span className="text-base">⛺</span>}
                    {opt.id === "tent-setup" && <span className="text-base">🔧</span>}
                    {opt.id === "tent-laundry" && <span className="text-base">🧺</span>}
                    {opt.id === "home-delivery" && <Truck size={16} className="text-white" />}
                    {opt.id === "local-dinner" && <span className="text-base">🌿</span>}
                    {opt.id === "finish-drink" && <span className="text-base">🍶</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm">{opt.label}</span>
                      <span className="text-primary font-bold text-xs shrink-0">{opt.priceLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    {opt.tentOnly && <span className="inline-block mt-2 text-[10px] bg-secondary text-[#6a5c48] px-2 py-0.5 rounded-full font-medium">야영장 선택 시</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-label mt-6">※ 옵션 가격은 8월 프리 파일럿 검증 후 확정됩니다.</p>
            <div className="text-center mt-6">
              <button onClick={onBook} className="bg-primary hover:bg-primary-hover text-white font-bold px-10 py-4 rounded-full transition-colors">옵션 포함 예약하기</button>
            </div>
          </div>
        )}

        {/* ③ 캠핑 투어 */}
        {activeTab === "tour" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-surface-dark rounded-2xl overflow-hidden text-white">
              <div className="px-6 pt-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">날짜 지정 모객형</span>
                  <span className="text-white/60 text-xs">정원 8~12명</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 font-serif">서포티드 캠핑 투어</h3>
                <p className="text-white/70 text-sm leading-relaxed">짐배송 + 장비 + 지역 만찬 + 현지 프로그램을 일괄 구성한 1박 2일 상품. 비수기·평일 수요를 만드는 앵커 상품입니다.</p>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-white/10">
                {[["1박 2일", "일정"], ["8~12명", "정원"], ["루트 1개", "코스 단위"], ["15~25만 원", "1인 가격"]].map(([val, lbl]) => (
                  <div key={lbl} className="text-center">
                    <p className="font-bold text-lg">{val}</p>
                    <p className="text-white/50 text-xs mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5">
                <p className="text-accent text-xs font-bold uppercase tracking-wider mb-3">포함 내역</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["짐배송 (전 구간)", "텐트·침낭 등 장비 일체", "지역 만찬 세트", "현지 해설·프로그램", "설치·철수 대행", "이동 셔틀 연계"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <Check size={13} className="text-accent shrink-0" />{item}
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-xs mt-5">※ 투어 일정은 별도 공지 예정 — 문의 후 예약 가능합니다.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button onClick={() => { window.scrollTo(0, 0); }} className="border-2 border-foreground text-foreground hover:bg-secondary font-bold px-10 py-4 rounded-full transition-colors">투어 문의하기</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
