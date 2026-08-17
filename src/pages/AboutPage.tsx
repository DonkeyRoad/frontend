import { Check, Heart, Users, Leaf } from "lucide-react";
import type { Page } from "../types";

export function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  const go = (p: Page) => { setPage(p); window.scrollTo(0, 0); };
  const personas = [
    {
      label: "A. 주말 트레커",
      age: "20~30대",
      icon: "🏃",
      traits: ["주말 2~3일 코스 선호", "체력 중상급", "SNS 공유 선호"],
      price: "구간·가방당 1.0~1.5만 원",
    },
    {
      label: "B. 장거리 도보여행자",
      age: "50~60대",
      icon: "🧭",
      traits: ["평일 4~7일 완주", "안전·편의 최우선", "상세 안내 선호"],
      price: "구간·가방당 1.3~2.0만 원",
    },
  ];
  const socialTracks = [
    {
      icon: <Users size={22} className="text-accent" />,
      track: "시니어 일자리",
      content: "60세 이상 '동키 매니저' 채용, 구간·가방당 수수료 지급",
      system: "ADMIN 매니저 관리 및 배차",
    },
    {
      icon: <Heart size={22} className="text-accent" />,
      track: "노인 돌봄 연계",
      content: "수거·배송 동선에서 독거노인 안부 확인",
      system: "ADMIN 돌봄 방문 기록",
    },
    {
      icon: <Leaf size={22} className="text-accent" />,
      track: "동키거점(유휴공간)",
      content: "마을회관·대피소·안내소를 보관·인계 거점으로 활용",
      system: "거점 마스터·맵 표시",
    },
  ];
  const values = [
    { icon: "🎒", title: "가벼운 발걸음", desc: "짐 없이 걷기에만 집중할 수 있도록" },
    { icon: "📱", title: "간편한 예약", desc: "여정 다구간을 한 번에 카드 결제" },
    { icon: "🛡️", title: "안심 이용", desc: "마이페이지 배송 상태 확인 및 확인 이메일" },
    { icon: "🤝", title: "지역 상생", desc: "시니어 일자리·노인 돌봄·유휴공간 활용" },
  ];

  return (
    <div className="pt-16 bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-surface-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">About DonkeyRoad</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 font-serif">
            짐은 저희가,<br />당신은 트레일을
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
            동키로드는 동서트레일(1~55구간) 트레커가 무거운 짐 없이 걷도록,<br />
            여러 구간의 숙소 간 짐 이동을 한 번에 예약·결제하면<br />
            정시 순회로 수거해 다음 숙소로 배송하는 웹 기반 O2O 플랫폼입니다.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">핵심 가치</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map(v => (
            <div key={v.title} className="bg-card rounded-xl p-6 text-center shadow-sm border border-foreground/8 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Flow */}
      <div className="bg-card py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-4">서비스 흐름</h2>
          <p className="text-center text-muted-foreground mb-12">간단한 4단계로 짐 배송이 완료됩니다</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {[
              { step: "01", title: "예약·결제", desc: "출발 구간과 도착 구간, 짐 수량을 선택하고 카드로 결제" },
              { step: "02", title: "출발 거점 맡기기", desc: "마을회관·숙소 거점에 짐을 맡기면 동키 매니저가 수거" },
              { step: "03", title: "직원 배송", desc: "정시 순회 동선으로 다음 거점까지 안전하게 운반" },
              { step: "04", title: "도착 거점 수령", desc: "다음 숙소 거점에서 짐 수령 후 트레일 마무리" },
            ].map((item, i, arr) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-surface-dark text-white flex items-center justify-center font-bold text-lg mb-4 z-10 relative">{item.step}</div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-0.5 bg-accent/40 z-0" style={{ width: "calc(100% - 28px)", left: "calc(50% + 28px)" }} />
                )}
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Personas */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-4">대상 사용자</h2>
        <p className="text-center text-muted-foreground mb-10">동키로드는 이런 분들을 위해 만들어졌습니다</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personas.map(p => (
            <div key={p.label} className="bg-card rounded-2xl border border-foreground/10 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{p.label}</h3>
                  <p className="text-accent text-sm font-semibold">{p.age}</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {p.traits.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-[#3D4638]">
                    <Check size={14} className="text-accent shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <div className="bg-secondary rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">지불 의향</p>
                <p className="font-bold text-foreground text-sm">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Value */}
      <div className="bg-surface-dark text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-4">사회적 가치 3트랙</h2>
          <p className="text-center text-white/70 mb-12">배송 서비스를 넘어, 지역 공동체와 함께 성장합니다</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialTracks.map(t => (
              <div key={t.track} className="bg-card/10 rounded-xl p-6 border border-white/10">
                <div className="mb-4">{t.icon}</div>
                <h3 className="font-bold text-white text-lg mb-3">{t.track}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{t.content}</p>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center bg-background">
        <h3 className="text-2xl font-bold text-foreground mb-3">지금 바로 시작하세요</h3>
        <p className="text-muted-foreground mb-8">가볍게 걷고, 짐은 동키로드에 맡기세요</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => go("booking")}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded transition-colors">
            짐 배송 예약하기
          </button>
          <button onClick={() => go("how-it-works")}
            className="border border-foreground text-foreground hover:bg-surface-dark hover:text-white font-semibold px-8 py-3 rounded transition-colors">
            이용 방법 보기
          </button>
        </div>
      </div>
    </div>
  );
}
