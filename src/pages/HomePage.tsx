import { MapPin, Package, ChevronRight, Star, ArrowRight, Calendar, CheckCircle, Mountain, Truck } from "lucide-react";
import { ServiceProductsSection } from "../components/ServiceProductsSection";
import { WeatherRecommendSection } from "../components/WeatherRecommendSection";
import { ARTICLE_DATA } from "../data/articles";
import { UNSPLASH_IMAGES, ctaBgImg } from "../data/images";
import { FEATURED_ROUTE_GROUPS } from "../data/trail";
import type { FeaturedRouteKey, Page } from "../types";

export function HomePage({ setPage, selectRoute }: { setPage: (p: Page) => void; selectRoute: (key: FeaturedRouteKey) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end pb-24 bg-surface-dark">
        <div className="absolute inset-0">
          <img src={UNSPLASH_IMAGES.hero} alt="동서트레일 풍경" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <div className="inline-block bg-[rgba(30,42,24,0.42)] border border-[rgba(244,239,227,0.35)] text-on-dark text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">동서트레일 봉화·울진에서 운영 중</div>
            <h1 className="font-bold text-white mb-5 font-serif" style={{ fontSize: "clamp(2.4rem, 5vw, 3.2rem)", lineHeight: "1.32", letterSpacing: "-0.02em" }}>
              짐 없이 걷는 길,<br />짐이 지나며 살아나는 마을
            </h1>
            <p className="text-on-dark text-[17px] mb-2 leading-relaxed">동키로드는 장거리 트레커의 짐을 다음 목적지까지 옮기고, 텐트와 지역 먹거리까지 준비하는 트레일 여행 서비스입니다.</p>
            <p className="text-[#d6dcc4] text-[16px] mb-8 leading-relaxed">무거운 배낭은 동키로드에 맡기고, 길과 풍경을 온전히 즐겨보세요.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => go("booking")}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-8 py-4 rounded-full text-base transition-colors shadow-[0px_8px_11px_rgba(20,28,16,0.4)]">
                짐 배송 예약하기
              </button>
              <button onClick={() => go("how-it-works")}
                className="border border-[rgba(244,239,227,0.55)] bg-[rgba(244,239,227,0.14)] hover:bg-[rgba(244,239,227,0.22)] text-primary-foreground font-semibold px-8 py-4 rounded-full text-base transition-colors">
                동키로드 알아보기
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Promo Video */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">동키로드 소개 영상</p>
            <h2 className="text-4xl font-bold text-foreground font-serif">짐 없이 걷는 트레일</h2>
            <p className="text-muted-foreground mt-3 text-base">동서트레일의 새로운 경험을 영상으로 만나보세요.</p>
          </div>
          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-ink"
            style={{ aspectRatio: "16/9" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/wlj48-k40W4?rel=0&modestbranding=1"
              title="동키로드 홍보 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20" style={{ background: "linear-gradient(to bottom, #efeada, #e2dbc8)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">5단계로 이용하세요</p>
            <h2 className="text-4xl font-bold text-foreground font-serif">무거운 짐은 동키로드에 맡기세요</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              여행 일정과 숙소는 자유롭게 선택하세요. 짐은 동키로드가 다음 숙소까지 안전하게 운송해 드립니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: <Calendar size={26} />, step: "01", title: "일정 계획", desc: "하루에 걸을 구간과 숙박할 마을을 정하세요." },
              { icon: <MapPin size={26} />, step: "02", title: "숙소 예약", desc: "숙박할 마을의 원하는 숙소를 직접 예약하세요." },
              { icon: <Package size={26} />, step: "03", title: "짐 배송 신청", desc: "배송할 날짜와 구간을 선택하고 짐 배송 서비스를 신청하세요." },
              { icon: <Truck size={26} />, step: "04", title: "짐 맡기기", desc: "아침에 지정된 장소에 짐을 맡기면 다음 숙소까지 배송해드립니다." },
              { icon: <CheckCircle size={26} />, step: "05", title: "가볍게 도착", desc: "짐 걱정 없이 트레일을 즐기고, 편안한 저녁을 보내세요." },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="relative text-center p-6 bg-card rounded-xl shadow-[0px_8px_24px_rgba(44,49,40,0.1)] hover:shadow-[0px_12px_30px_rgba(44,49,40,0.14)] transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-surface-dark text-white rounded-full mb-4">{icon}</div>
                <p className="text-label text-xs font-bold tracking-widest mb-2">STEP {step}</p>
                <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => go("how-it-works")} className="inline-flex items-center gap-2 text-foreground font-semibold hover:gap-3 transition-all">
              자세히 알아보기 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Routes */}
      <section id="featured-routes" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">운영 중인 코스</p>
              <h2 className="text-4xl font-bold text-foreground font-serif">두 개의 대표 코스에서<br />짐 이동 서비스를 이용할 수 있습니다</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {FEATURED_ROUTE_GROUPS.map(group => (
              <div key={group.key} className="bg-card border border-[rgba(63,92,58,0.12)] rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative bg-secondary overflow-hidden group" style={{ aspectRatio: "4/3" }}>
                  <img src={UNSPLASH_IMAGES[group.image as keyof typeof UNSPLASH_IMAGES]} alt={`${group.title} 대표 풍경`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />

                  <div className="absolute top-4 right-4 bg-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full">예약 가능</div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-label text-xs font-semibold uppercase tracking-widest mb-2">운영 중 · 짐 이동 서비스</p>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-serif">{group.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{group.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-background rounded-lg p-3 mb-4">
                    <div className="text-center"><p className="font-bold text-foreground">{group.distance}</p><p className="text-muted-foreground mt-0.5">총 거리</p></div>
                    <div className="text-center border-x border-foreground/10"><p className="font-bold text-foreground">{group.estDays}</p><p className="text-muted-foreground mt-0.5">예상 소요</p></div>
                    <div className="text-center"><p className="font-bold text-foreground">{group.range[1] - group.range[0] + 1}개</p><p className="text-muted-foreground mt-0.5">구간</p></div>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {group.keywords.map(keyword => <span key={keyword} className="bg-secondary text-foreground text-xs font-medium px-2.5 py-1 rounded-full">{keyword}</span>)}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button onClick={() => { selectRoute(group.key); go("booking"); window.scrollTo(0, 0); }}
                      className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3 rounded transition-colors">
                      짐 배송 예약하기 <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Products */}
      <ServiceProductsSection onBook={() => go("booking")} />

      {/* Weather-based Recommendation */}
      <WeatherRecommendSection onBook={(key) => { selectRoute(key); go("booking"); }} onDetail={(key) => { selectRoute(key); go("booking"); }} />

      {/* Trail Stories */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[#8ea079] text-sm font-semibold uppercase tracking-widest mb-2">NEWS & STORIES</p>
              <h2 className="text-4xl font-bold text-on-dark font-serif">트레일 소식</h2>
              <p className="text-label-on-dark text-sm mt-3">코스별 여행기와 추천 경로, 최신 운영 소식을 만나보세요.</p>
            </div>
            <button onClick={() => go("articles")} className="flex items-center gap-2 text-label-on-dark font-semibold hover:text-on-dark transition-colors">소식 전체 보기 <ArrowRight size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLE_DATA.slice(0, 3).map(article => (
              <article key={article.title} className="group bg-card border border-[rgba(63,92,58,0.12)] rounded-[20px] p-6 shadow-[0px_10px_30px_rgba(44,49,40,0.12)] hover:shadow-[0px_16px_40px_rgba(44,49,40,0.18)] transition-all cursor-pointer">
                <p className="text-xs text-label font-bold tracking-widest mb-3">{article.category}</p>
                <h3 className="font-bold text-foreground text-xl mb-3 leading-snug">{article.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{article.desc}</p>
                <div className="flex items-center justify-between text-sm font-semibold text-foreground"><span>{article.date}</span><ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">이용 후기</p>
            <h2 className="text-4xl font-bold text-foreground font-serif">트레이커들의 이야기</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "김민준", route: "동서트레일 예약 이용자", text: "처음에 반신반의했는데 정말 제때 짐이 도착했어요. 덕분에 지리산 구간을 정말 가볍게 즐길 수 있었습니다. 다음에도 꼭 이용할게요!", stars: 5 },
              { name: "박지영", route: "동서트레일 예약 이용자", text: "CSV에 등록된 구간 정보를 보고 예약하니 출발지와 도착지를 확인하기 쉬웠어요. 직원분들도 친절하시고 짐도 안전하게 왔어요.", stars: 5 },
              { name: "이승호", route: "동서트레일 예약 이용자", text: "마지막 구간을 짐 없이 걸으면서 정말 감동적이었습니다. 동서트레일 완주를 가볍게 마무리하는 데 DonkeyRoad가 큰 역할을 했어요.", stars: 5 },
            ].map(({ name, route, text, stars }) => (
              <div key={name} className="bg-card p-6 rounded-lg border border-foreground/10">
                <div className="flex gap-1 mb-3">
                  {Array(stars).fill(0).map((_, i) => <Star key={i} size={14} className="fill-[#D4A853] text-[#D4A853]" />)}
                </div>
                <p className="text-[#1A1F1B] text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="border-t border-foreground/10 pt-4">
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{route}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ctaBgImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <Mountain size={40} className="text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 font-serif">지금 바로 예약하세요</h2>
          <p className="text-white/70 mb-8 leading-relaxed">충남 1~12구간과 경북 47~55구간에서 우선 운영합니다. 13~46구간은 미개통으로 순차 추가 예정입니다.</p>
          <button onClick={() => go("booking")}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-10 py-4 rounded-full text-base transition-colors shadow-[0px_8px_11px_rgba(20,28,16,0.4)]">
            짐 배송 예약하기
          </button>
        </div>
      </section>
    </div>
  );
}
