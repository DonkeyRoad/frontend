import { useState } from "react";
import { MapPin, Package, Phone, X, Star, Check, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { UNSPLASH_IMAGES } from "../data/images";
import { BOOKING_OPTIONS, capacityLabel, refundPreview } from "../data/service";
import { buildSectionStays, mockShelterNames } from "../data/stays";
import { FALLBACK_TEXT, FEATURED_ROUTE_GROUPS, RECOMMENDED_TEMPLATES, TRAIL_SECTIONS, difficultyColor } from "../data/trail";
import { journeyLabel, naverMapUrl } from "../lib/format";
import type { FeaturedRouteKey, HubPrefill, JourneyCart, JourneyDay, Page, Stay } from "../types";

type BookingStep = "section" | "stay" | "dates";
type StayType = "linked" | "manual" | "camping" | "shelter";

export function BookingPage({ setPage, isLoggedIn, onNeedLogin, onSaveCart, initialRoute = "meet", hubPrefill }: { setPage: (p: Page) => void; isLoggedIn: boolean; onNeedLogin: () => void; onSaveCart: (cart: JourneyCart) => void; initialRoute?: FeaturedRouteKey; hubPrefill?: HubPrefill | null }) {
  const [routeKey] = useState<FeaturedRouteKey>(initialRoute);
  const [itinerary, setItinerary] = useState<JourneyDay[]>([]);

  // 3-step booking state
  const [bookingStep, setBookingStep] = useState<BookingStep>("section");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(hubPrefill?.sectionId ?? null);
  const [selectedStayType, setSelectedStayType] = useState<StayType | null>(null);
  const [selectedStayObj, setSelectedStayObj] = useState<Stay | null>(null);
  const [shelterName, setShelterName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [dayBags, setDayBags] = useState(1);
  const [dayBus, setDayBus] = useState(false);
  const [dayOptions, setDayOptions] = useState<string[]>([]);
  const [manual, setManual] = useState({ name: "", phone: "", address: "", postal: "" });
  const [mapStay, setMapStay] = useState<{ name: string; location: string; query: string } | null>(null);
  const [saved, setSaved] = useState<JourneyCart | null>(null);

  const group = FEATURED_ROUTE_GROUPS.find(g => g.key === routeKey) || FEATURED_ROUTE_GROUPS[0];
  const lastSectionId = itinerary.length > 0 ? itinerary[itinerary.length - 1].sectionId : null;
  const minSectionId = lastSectionId ?? group.range[0];
  const availableSections = TRAIL_SECTIONS.filter(s => s.id >= minSectionId && s.id <= group.range[1]);
  const selectedSection = TRAIL_SECTIONS.find(s => s.id === selectedSectionId) || null;
  const linkedStays = selectedSection ? buildSectionStays(selectedSection) : [];
  const shelterOptions = selectedSection ? mockShelterNames(selectedSection) : [];

  const currentDay = itinerary.length + 1;
  const cap = capacityLabel(arrivalDate || "2026-08-17", dayBags);

  const resetStep = () => {
    setBookingStep("section");
    setSelectedSectionId(null);
    setSelectedStayType(null);
    setSelectedStayObj(null);
    setShelterName("");
    setArrivalDate("");
    setDepartureDate("");
    setDayBags(1);
    setDayBus(false);
    setDayOptions([]);
    setManual({ name: "", phone: "", address: "", postal: "" });
  };

  const handleSelectSection = (id: number) => { setSelectedSectionId(id); setBookingStep("stay"); };

  const handleSelectStay = (type: StayType, stay?: Stay) => {
    setSelectedStayType(type);
    setSelectedStayObj(stay || null);
    setShelterName("");
    setBookingStep("dates");
  };

  const dateDiffNights = (from: string, to: string) => {
    if (!from || !to) return 1;
    return Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
  };

  const canAddManual = manual.name.trim() && manual.phone.trim() && manual.address.trim();
  const canConfirmDates = !!(arrivalDate && departureDate && departureDate > arrivalDate) && (
    selectedStayType === "linked" ? !!selectedStayObj :
    selectedStayType === "manual" || selectedStayType === "camping" ? !!canAddManual :
    selectedStayType === "shelter" ? !!shelterName : false
  );

  const addStop = () => {
    if (!selectedSection || !arrivalDate || !departureDate || !selectedStayType) return;
    const nights = dateDiffNights(arrivalDate, departureDate);
    const stay = selectedStayType === "linked" ? selectedStayObj : null;
    const stayLabel =
      selectedStayType === "linked" ? (stay?.name || "") :
      selectedStayType === "camping" ? `야영장: ${manual.name}` :
      selectedStayType === "shelter" ? `대피소: ${shelterName}` : "직접 입력";
    const stop: JourneyDay = {
      day: currentDay,
      sectionId: selectedSection.id,
      date: arrivalDate,
      nights,
      pickup: selectedSection.from !== FALLBACK_TEXT ? selectedSection.from : `${selectedSection.id}구간`,
      dropoff: selectedSection.to !== FALLBACK_TEXT ? selectedSection.to : `${selectedSection.id}구간`,
      stay: stayLabel,
      customStay: selectedStayType === "manual" ? manual.name : selectedStayType === "camping" ? manual.name : "",
      stayPhone: selectedStayType === "linked" ? stay?.phone : selectedStayType === "shelter" ? "" : manual.phone,
      stayAddress: selectedStayType === "linked" ? stay?.location : selectedStayType === "shelter" ? "" : manual.address,
      stayPostal: selectedStayType === "linked" ? "" : selectedStayType === "shelter" ? "" : manual.postal,
      bags: dayBags,
      bus: dayBus,
      options: dayOptions,
    };
    setItinerary(prev => [...prev, stop]);
    resetStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeStop = (idx: number) => {
    setItinerary(prev => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })));
    resetStep();
  };

  const bags = itinerary.reduce((sum, d) => sum + d.bags, 0);
  const busTotal = itinerary.filter(d => d.bus).length * 6000;
  const optionsTotal = itinerary.reduce((sum, d) =>
    sum + d.options.reduce((s, id) => s + (BOOKING_OPTIONS.find(o => o.id === id)?.price ?? 0), 0), 0);
  const total = bags * 15000 + busTotal + optionsTotal;
  const hasClosed = itinerary.some(d => capacityLabel(d.date, d.bags).closed);
  const totalNights = itinerary.reduce((sum, d) => sum + d.nights, 0);
  const scheduleLabel = itinerary.length > 0 ? `${totalNights}박${totalNights + 1}일` : "일정 구성 중";

  const save = () => {
    if (itinerary.length === 0) return;
    if (!isLoggedIn) { onNeedLogin(); return; }
    const cart: JourneyCart = { id: `CART-${Date.now().toString().slice(-5)}`, routeKey, schedule: scheduleLabel, status: "CART", createdAt: "2026-07-04", days: itinerary, total };
    onSaveCart(cart); setSaved(cart);
  };

  if (saved) return (
    <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-foreground/10 rounded-lg p-8 max-w-xl text-center">
        <CheckCircle size={48} className="mx-auto text-foreground mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-3 font-serif">여정이 장바구니에 저장되었습니다</h1>
        <p className="text-muted-foreground text-sm mb-6">결제는 마이페이지의 <b>내 여행 일정</b>에서만 진행됩니다.</p>
        <div className="bg-background rounded p-4 text-left text-sm mb-6">
          <p className="font-bold text-foreground">{group.title} · {scheduleLabel}</p>
          <p className="text-muted-foreground mt-1">{itinerary.length}개 구간 · 가방 {bags}개 · ₩{total.toLocaleString()}</p>
        </div>
        <button onClick={() => { setPage("mypage"); window.scrollTo(0, 0); }} className="w-full bg-surface-dark text-white font-bold py-3 rounded">내 여행 일정에서 결제하기</button>
      </div>
    </div>
  );

  const [showTemplate, setShowTemplate] = useState(true);
  const template = RECOMMENDED_TEMPLATES[routeKey];

  const stepLabels: { key: BookingStep; label: string }[] = [
    { key: "section", label: "목적지 구간" },
    { key: "stay", label: "숙박지 선택" },
    { key: "dates", label: "날짜 입력" },
  ];
  const currentStepIdx = stepLabels.findIndex(x => x.key === bookingStep);

  return (
    <div className="pt-16 min-h-screen bg-background">

      {/* ── 코스 배너 ── */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img src={UNSPLASH_IMAGES[group.image as keyof typeof UNSPLASH_IMAGES]} alt={group.title}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-8 max-w-4xl mx-auto left-0 right-0">
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-accent/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">예약 가능</span>
              <span className="bg-card/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">{group.sections}</span>
              <span className="bg-card/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">{group.distance}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">{group.title}</h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">{group.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {group.keywords.map(kw => (
                <span key={kw} className="bg-accent/30 border border-accent/40 text-white text-[11px] px-2 py-0.5 rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 스티키 장바구니 바 ── */}
      <div className="sticky top-16 z-40 bg-surface-dark border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-white min-w-0 flex-1">
            <Package size={15} className="text-accent shrink-0" />
            {itinerary.length === 0 ? (
              <span className="text-sm text-white/70">여정을 추가하면 장바구니에 표시됩니다</span>
            ) : (
              <span className="text-sm">
                <b className="text-white">{itinerary.length}개 구간</b>
                <span className="text-white/60 mx-1.5">·</span>
                <span className="text-white/80">{totalNights}박{totalNights + 1}일</span>
                <span className="text-white/60 mx-1.5">·</span>
                <span className="text-white/80">가방 {bags}개</span>
              </span>
            )}
          </div>
          {itinerary.length > 0 && (
            <>
              <span className="text-accent font-bold text-sm">₩{total.toLocaleString()}</span>
              <button
                disabled={hasClosed}
                onClick={save}
                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${hasClosed ? "bg-card/20 text-white/50 cursor-not-allowed" : "bg-primary hover:bg-primary-hover text-white"}`}>
                {hasClosed ? "마감 날짜 있음" : "장바구니에 담기"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── 추천 일정 템플릿 ── */}
        {showTemplate && (
          <section className="bg-surface-dark text-white rounded-xl overflow-hidden">
            <div className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-[#D4A853] fill-[#D4A853]" />
                  <p className="text-accent text-xs font-bold uppercase tracking-wider">추천 일정</p>
                </div>
                <h3 className="font-bold text-lg mb-1">{template.label}</h3>
                <p className="text-white/70 text-xs mb-4">{template.note}</p>
                <div className="flex flex-wrap gap-2">
                  {template.sections.map((secId, dayIdx) => {
                    const sec = TRAIL_SECTIONS.find(s => s.id === secId);
                    const waypoints = sec ? [
                      sec.from !== FALLBACK_TEXT ? sec.from : null,
                      sec.via !== FALLBACK_TEXT ? sec.via : null,
                      sec.to !== FALLBACK_TEXT ? sec.to : null,
                    ].filter(Boolean) as string[] : [];
                    return (
                      <div key={secId} className="bg-card/10 border border-white/20 rounded-lg px-3 py-2 flex-1">
                        <p className="text-[10px] text-accent font-bold mb-0.5">{dayIdx + 1}일차</p>
                        <p className="font-bold text-sm">{secId}구간</p>
                        {waypoints.length > 0 && (
                          <p className="text-white/60 text-[11px] mt-0.5 leading-snug">{waypoints.join(" - ")}</p>
                        )}
                        {sec?.km && <p className="text-white/50 text-[10px] mt-0.5">{sec.km}km{sec.duration !== FALLBACK_TEXT ? ` · ${sec.duration}` : ""}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setShowTemplate(false)} className="text-white/40 hover:text-white transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ── 내 여정 + 장바구니 요약 ── */}
        {itinerary.length > 0 && (
          <section className="bg-card border border-foreground/10 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
              <h2 className="font-bold text-foreground text-xl">내 여정 ({itinerary.length}개 구간)</h2>
              <span className="text-xs text-muted-foreground">{scheduleLabel}</span>
            </div>
            <div className="divide-y divide-foreground/5">
              {itinerary.map((d, idx) => {
                const depDate = (() => { const dep = new Date(d.date); dep.setDate(dep.getDate() + d.nights); return dep.toISOString().slice(0, 10); })();
                return (
                  <div key={`${d.day}-${d.date}`} className="px-6 py-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-dark text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{d.day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-label font-bold uppercase tracking-wider mb-0.5">{journeyLabel(d.day)} · {d.sectionId}구간</p>
                      <p className="font-bold text-foreground text-sm">{d.pickup} → {d.dropoff}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.stay === "직접 입력" ? `${d.customStay} (직접 입력)` : d.stay} · {d.nights}박</p>
                      <p className="text-xs text-muted-foreground">도착 {d.date} → 출발 {depDate} · 가방 {d.bags}개{d.bus ? " · 버스" : ""}</p>
                    </div>
                    <button onClick={() => removeStop(idx)} className="text-xs text-red-500 font-bold shrink-0">삭제</button>
                  </div>
                );
              })}
            </div>

            {/* 요약 + 결제 */}
            <div className="bg-background px-6 py-5 border-t border-foreground/10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm mb-4">
                <div className="flex justify-between col-span-2 sm:col-span-1"><span className="text-muted-foreground">구간</span><b className="text-foreground">{group.title}</b></div>
                <div className="flex justify-between col-span-2 sm:col-span-1"><span className="text-muted-foreground">일정</span><b className="text-foreground">{scheduleLabel}</b></div>
                <div className="flex justify-between col-span-2 sm:col-span-1"><span className="text-muted-foreground">가방</span><b className="text-foreground">{bags}개</b></div>
                <div className="flex justify-between col-span-2 sm:col-span-1"><span className="text-muted-foreground">버스 옵션</span><b className="text-foreground">₩{busTotal.toLocaleString()}</b></div>
                {optionsTotal > 0 && (
                  <div className="flex justify-between col-span-2 sm:col-span-1"><span className="text-muted-foreground">추가 옵션</span><b className="text-foreground">₩{optionsTotal.toLocaleString()}</b></div>
                )}
                <div className="flex justify-between col-span-2 pt-3 border-t border-foreground/10 font-bold text-foreground text-base">
                  <span>예상 결제금액</span><span>₩{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-card border border-accent/20 rounded-lg p-4 mb-4">
                <p className="text-xs font-bold text-foreground mb-2">취소·환불 예상</p>
                <div className="space-y-1">
                  {refundPreview(total).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] text-muted-foreground"><span>{k}</span><b>{v}</b></div>
                  ))}
                </div>
              </div>
              <button disabled={hasClosed || itinerary.length === 0} onClick={save}
                className={`w-full py-3.5 rounded-lg font-bold text-white text-sm transition-colors ${hasClosed || itinerary.length === 0 ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:bg-primary-hover"}`}>
                {hasClosed ? "마감 날짜 변경 필요" : "여정 장바구니에 담기 →"}
              </button>
              <p className="text-xs text-muted-foreground mt-2 text-center">비로그인 상태면 로그인 팝업이 열리고 현재 입력값은 유지됩니다.</p>
            </div>
          </section>
        )}

        {/* ── 현재 여정 구성 ── */}
        <section className="bg-card border border-foreground/10 rounded-xl overflow-hidden">
          {/* 헤더 */}
          <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
            <h2 className="font-bold text-foreground text-xl">{journeyLabel(currentDay)} 구성</h2>
            {lastSectionId && (
              <span className="text-xs bg-secondary text-foreground font-bold px-2.5 py-1 rounded-full">{lastSectionId}구간 이후 선택 가능</span>
            )}
          </div>

          {/* 단계 인디케이터 */}
          <div className="px-6 py-4 border-b border-foreground/5 flex items-center gap-0">
            {stepLabels.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                  ${i < currentStepIdx ? "bg-surface-dark text-white" :
                    i === currentStepIdx ? "bg-primary text-white" :
                    "bg-background text-muted-foreground"}`}>
                  {i < currentStepIdx ? <Check size={11} /> : <span>{i + 1}</span>}
                  {s.label}
                </div>
                {i < stepLabels.length - 1 && <div className={`w-6 h-0.5 mx-0.5 ${i < currentStepIdx ? "bg-surface-dark" : "bg-[#E5E7E2]"}`} />}
              </div>
            ))}
          </div>

          <div className="p-6">

            {/* ── STEP 1: 목적지 구간 선택 ── */}
            {bookingStep === "section" && (
              <>
                <p className="text-muted-foreground text-sm mb-4">
                  {journeyLabel(currentDay)}의 <b className="text-foreground">목적지 구간</b>을 선택하세요.
                  {lastSectionId && <span className="text-label"> ({lastSectionId}~{group.range[1]}구간 표시 중)</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSections.map(sec => {
                    const waypoints = [
                      sec.from !== FALLBACK_TEXT ? sec.from : null,
                      sec.via !== FALLBACK_TEXT ? sec.via : null,
                      sec.to !== FALLBACK_TEXT ? sec.to : null,
                    ].filter(Boolean) as string[];
                    return (
                      <button key={sec.id} onClick={() => handleSelectSection(sec.id)}
                        className="p-4 rounded-lg border border-foreground/15 bg-background text-left hover:border-accent hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-foreground font-black text-base">{sec.id}구간</span>
                          {sec.difficulty !== FALLBACK_TEXT && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${difficultyColor(sec.difficulty)}`}>{sec.difficulty}</span>
                          )}
                        </div>
                        {waypoints.length > 0 && (
                          <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                            {waypoints.join(" - ")}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          {sec.km && <span className="font-medium">{sec.km}km</span>}
                          {sec.km && sec.duration !== FALLBACK_TEXT && <span className="text-foreground/30">·</span>}
                          {sec.duration !== FALLBACK_TEXT && <span>{sec.duration}</span>}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── STEP 2: 숙박지 선택 ── */}
            {bookingStep === "stay" && selectedSection && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-label font-bold mb-0.5">{selectedSection.id}구간 · {selectedSection.to !== FALLBACK_TEXT ? selectedSection.to : `${selectedSection.id}구간`}</p>
                    <p className="font-bold text-foreground">숙박지를 선택하세요</p>
                  </div>
                  <button onClick={() => { setBookingStep("section"); setSelectedSectionId(null); }}
                    className="text-xs text-foreground font-bold underline">구간 다시 선택</button>
                </div>

                <div className="space-y-5">
                  {/* 연계 숙소 */}
                  <div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-dark inline-block" />연계 숙소
                    </p>
                    {linkedStays.length > 0 ? (
                      <div className="space-y-3">
                        {linkedStays.map(stay => (
                          <div key={stay.id} className="rounded-lg border border-foreground/10 overflow-hidden flex flex-col sm:flex-row">
                            <img src={stay.image} alt={stay.name} className="w-full sm:w-40 h-36 sm:h-auto object-cover" />
                            <div className="p-4 flex-1">
                              <h3 className="font-bold text-foreground text-sm">{stay.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stay.intro}</p>
                              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1"><MapPin size={11} className="text-label" />{stay.location}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Phone size={11} className="text-label" />{stay.phone}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <button onClick={() => handleSelectStay("linked", stay)}
                                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-1.5 rounded">선택</button>
                                <button onClick={() => setMapStay({ name: stay.name, location: stay.location, query: stay.mapQuery })}
                                  className="border border-foreground/30 text-foreground text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                                  <MapPin size={11} /> 지도</button>
                                <a href={stay.yanolja} target="_blank" rel="noopener noreferrer"
                                  className="border border-foreground/30 text-foreground text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                                  야놀자 <ExternalLink size={11} /></a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground bg-background rounded-lg px-4 py-3">이 구간에는 연계 숙소 정보가 없습니다.</p>
                    )}
                  </div>

                  {/* 직접 예약 숙소 */}
                  <div className="border border-foreground/10 rounded-lg p-4 bg-background">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-surface-dark inline-block" />직접 예약한 숙소
                        </p>
                        <p className="text-xs text-muted-foreground">민박·펜션·호텔 등 직접 예약하신 숙소에 배송합니다. 이름·전화번호·주소를 입력해주세요.</p>
                      </div>
                      <button onClick={() => handleSelectStay("manual")}
                        className="shrink-0 bg-surface-dark hover:bg-brand text-white text-xs font-bold px-3 py-2 rounded transition-colors">
                        선택
                      </button>
                    </div>
                  </div>

                  {/* 야영장 */}
                  <div className="border border-accent/40 rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />야영장
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">자연휴양림 야영장을 이용하시나요? 예약 후 야영장 정보를 입력해 주세요.</p>
                        <a href="https://www.foresttrip.go.kr/main.do" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-foreground border border-foreground/30 bg-card px-3 py-1.5 rounded hover:bg-secondary transition-colors">
                          숲나들이에서 야영장 예약 <ExternalLink size={11} />
                        </a>
                      </div>
                      <button onClick={() => handleSelectStay("camping")}
                        className="shrink-0 bg-accent hover:bg-[#3a9e6c] text-white text-xs font-bold px-3 py-2 rounded transition-colors">
                        정보 입력
                      </button>
                    </div>
                  </div>

                  {/* 대피소 */}
                  <div className="border border-muted-foreground/20 rounded-lg p-4 bg-stone-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />대피소
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">숲길 대피소를 이용하시나요? 대피소 이름과 이용 날짜만 선택하면 됩니다.</p>
                        <a href="https://www.foresttrip.go.kr/frtrlMain.do" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-foreground border border-foreground/30 bg-card px-3 py-1.5 rounded hover:bg-secondary transition-colors">
                          숲나들이 숲길 대피소 확인 <ExternalLink size={11} />
                        </a>
                      </div>
                      <button onClick={() => handleSelectStay("shelter")}
                        className="shrink-0 bg-muted-foreground hover:bg-[#555c5a] text-white text-xs font-bold px-3 py-2 rounded transition-colors">
                        선택
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: 날짜 + 상세 정보 ── */}
            {bookingStep === "dates" && selectedSection && selectedStayType && (
              <>
                {/* 선택 요약 */}
                <div className="bg-background rounded-lg p-4 mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-label font-bold uppercase tracking-wider mb-0.5">
                      {selectedSection.id}구간 · {
                        selectedStayType === "linked" ? "연계 숙소" :
                        selectedStayType === "manual" ? "직접 예약 숙소" :
                        selectedStayType === "camping" ? "야영장" : "대피소"
                      }
                    </p>
                    <p className="font-bold text-foreground text-sm">
                      {selectedStayType === "linked" ? selectedStayObj?.name :
                       selectedStayType === "shelter" ? (shelterName || "대피소를 선택해주세요") :
                       "정보를 아래에 입력해주세요"}
                    </p>
                    {selectedStayType === "linked" && selectedStayObj && (
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedStayObj.location}</p>
                    )}
                  </div>
                  <button onClick={() => { setBookingStep("stay"); setSelectedStayType(null); setSelectedStayObj(null); setShelterName(""); setArrivalDate(""); setDepartureDate(""); }}
                    className="text-xs text-foreground underline font-bold shrink-0">다시 선택</button>
                </div>

                {/* 직접 예약 숙소 / 야영장 폼 */}
                {(selectedStayType === "manual" || selectedStayType === "camping") && (
                  <div className={`border rounded-lg p-4 mb-5 ${selectedStayType === "camping" ? "border-accent/30 bg-secondary/40" : "border-accent/20 bg-secondary"}`}>
                    <p className="text-sm font-bold text-foreground mb-3">
                      {selectedStayType === "camping" ? "야영장 정보 입력" : "숙소 정보 입력"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))}
                        placeholder={selectedStayType === "camping" ? "야영장 이름 *" : "숙소 이름 *"}
                        className="border border-foreground/15 rounded p-2.5 text-sm bg-secondary" />
                      <input value={manual.phone} onChange={e => setManual(m => ({ ...m, phone: e.target.value }))}
                        placeholder="전화번호 *" className="border border-foreground/15 rounded p-2.5 text-sm bg-secondary" />
                      <input value={manual.address} onChange={e => setManual(m => ({ ...m, address: e.target.value }))}
                        placeholder="주소 *" className="border border-foreground/15 rounded p-2.5 text-sm bg-secondary sm:col-span-2" />
                      <input value={manual.postal} onChange={e => setManual(m => ({ ...m, postal: e.target.value }))}
                        placeholder="우편번호" className="border border-foreground/15 rounded p-2.5 text-sm bg-secondary" />
                    </div>
                  </div>
                )}

                {/* 대피소 이름 선택 */}
                {selectedStayType === "shelter" && (
                  <div className="border border-muted-foreground/20 rounded-lg p-4 mb-5 bg-stone-50">
                    <p className="text-sm font-bold text-foreground mb-3">대피소 선택</p>
                    <select value={shelterName} onChange={e => setShelterName(e.target.value)}
                      className="w-full border-2 border-foreground/20 rounded-lg px-3 py-2.5 text-sm bg-secondary focus:border-foreground outline-none">
                      <option value="">대피소를 선택하세요</option>
                      {shelterOptions.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">목록에 없으면 <a href="https://www.foresttrip.go.kr/frtrlMain.do" target="_blank" rel="noopener noreferrer" className="underline">숲나들이</a>에서 이름을 확인하세요.</p>
                  </div>
                )}

                {/* 날짜 선택 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="flex text-sm font-bold text-foreground mb-2 items-center gap-1">
                      <Calendar size={14} />숙박지 도착일
                    </label>
                    <input type="date" value={arrivalDate}
                      onChange={e => { setArrivalDate(e.target.value); if (departureDate && e.target.value >= departureDate) setDepartureDate(""); }}
                      className="w-full border-2 border-foreground/20 rounded-lg px-3 py-2.5 text-sm focus:border-foreground outline-none bg-secondary transition-colors" />
                    <p className="text-xs text-muted-foreground mt-1">짐이 이 날짜에 배송됩니다</p>
                  </div>
                  <div>
                    <label className="flex text-sm font-bold text-foreground mb-2 items-center gap-1">
                      <Calendar size={14} />숙박지 출발일
                    </label>
                    <input type="date" value={departureDate} min={arrivalDate || undefined}
                      onChange={e => setDepartureDate(e.target.value)}
                      className="w-full border-2 border-foreground/20 rounded-lg px-3 py-2.5 text-sm focus:border-foreground outline-none bg-secondary transition-colors" />
                    <p className="text-xs text-muted-foreground mt-1">이 날짜 아침에 짐을 픽업합니다</p>
                  </div>
                </div>

                {/* 날짜 요약 */}
                {arrivalDate && departureDate && departureDate > arrivalDate && (
                  <div className="flex items-center gap-3 bg-secondary rounded-lg px-4 py-3 mb-4 text-sm">
                    <Check size={15} className="text-foreground shrink-0" />
                    <span className="text-foreground">
                      <b>{arrivalDate}</b> 도착 → <b>{departureDate}</b> 출발 · <b>{dateDiffNights(arrivalDate, departureDate)}박</b>
                    </span>
                    {cap.closed && <span className="ml-auto text-red-600 font-bold text-xs">이 날짜 마감</span>}
                    {!cap.closed && <span className="ml-auto text-green-700 font-bold text-xs">잔여 {cap.left}개</span>}
                  </div>
                )}

                {/* 가방/버스 */}
                <div className="flex flex-wrap items-center gap-5 mb-5 text-sm bg-background rounded-lg px-4 py-3">
                  <label className="flex items-center gap-2">
                    가방
                    <input type="number" min={1} max={3} value={dayBags}
                      onChange={e => setDayBags(Math.min(3, Math.max(1, Number(e.target.value))))}
                      className="w-14 border rounded px-2 py-1 bg-card text-center" />개
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={dayBus} onChange={e => setDayBus(e.target.checked)} />
                    연계 버스 옵션 (+₩6,000)
                  </label>
                </div>

                {/* 추가 옵션 */}
                <div className="mb-5">
                  <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-dark text-white text-[10px] font-bold flex items-center justify-center">+</span>
                    추가 옵션 <span className="text-label font-normal text-xs">(선택 사항 · 1인·1박 기준)</span>
                  </p>
                  <div className="space-y-2">
                    {BOOKING_OPTIONS.filter(opt => !opt.tentOnly || selectedStayType === "camping").map(opt => {
                      const checked = dayOptions.includes(opt.id);
                      return (
                        <label key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "border-primary bg-secondary" : "border-foreground/12 bg-background hover:border-foreground/25"}`}>
                          <input type="checkbox" className="mt-0.5 shrink-0" checked={checked}
                            onChange={() => setDayOptions(prev => checked ? prev.filter(id => id !== opt.id) : [...prev, opt.id])} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                              <span className="text-xs font-bold text-primary shrink-0">+{opt.priceLabel}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selectedStayType !== "camping" && (
                    <p className="text-xs text-label mt-2">※ 텐트 관련 옵션은 야영장 선택 시 표시됩니다.</p>
                  )}
                </div>

                <button disabled={!canConfirmDates} onClick={addStop}
                  className={`w-full py-3.5 rounded-lg font-bold text-white text-sm transition-colors ${canConfirmDates ? "bg-primary hover:bg-primary-hover" : "bg-primary/40 cursor-not-allowed"}`}>
                  {canConfirmDates ? `${journeyLabel(currentDay)} 여정에 추가 →` : "날짜와 숙박지 정보를 모두 입력해주세요"}
                </button>
              </>
            )}
          </div>
        </section>
      </div>

      {mapStay && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setMapStay(null)}>
          <div className="bg-card rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{mapStay.name}</h2>
              <button onClick={() => setMapStay(null)}><X size={22} /></button>
            </div>
            <div className="rounded-lg overflow-hidden border border-foreground/10 bg-secondary h-52 flex flex-col items-center justify-center text-center px-6">
              <MapPin size={36} className="text-label mb-3" />
              <p className="font-bold text-foreground">{mapStay.location}</p>
              <p className="text-xs text-muted-foreground mt-1">지도 미리보기 (네이버 지도 연동 준비 중)</p>
            </div>
            <a href={naverMapUrl(mapStay.query)} target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full bg-surface-dark text-white font-bold py-3 rounded flex items-center justify-center gap-2">
              네이버 지도에서 위치 보기 <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
