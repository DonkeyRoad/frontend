import { MapPin, Package, Check, Calendar, CheckCircle, Mountain, Bell, Truck, AlertTriangle } from "lucide-react";
import { UNSPLASH_IMAGES } from "../data/images";
import type { Page } from "../types";

export function HowItWorksPage({ setPage }: { setPage: (p: Page) => void }) {
  const steps = [
    {
      n: "01", icon: <Calendar size={26} />,
      title: "걷기 일정을 계획하세요",
      body: (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            매일 걷고 싶은 거리를 정한 다음, 매일 밤 묵을 마을이나 도시를 선택하세요.
            각 코스 페이지에는 거점 간 거리가 표시되어 있어 자신의 속도에 맞는 일정을 짜는 데 도움이 됩니다.
          </p>
        </>
      ),
    },
    {
      n: "02", icon: <MapPin size={26} />,
      title: "숙소를 예약하세요",
      body: (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            원하시는 민박, 게스트하우스, 호텔 또는 여관에 직접 숙소를 예약하세요.
            저희는 <strong className="text-foreground">고객님이 머무시는 곳 문 앞까지 직접 배달</strong>해 드리기 때문에
            숙박하시는 곳의 정확한 이름과 주소가 필요합니다.
          </p>
          <div className="bg-background border border-accent/20 rounded-lg px-4 py-3 text-xs text-label font-medium">
            저희는 고객님을 대신하여 숙소를 예약해 드리지 않습니다.
          </div>
        </>
      ),
    },
    {
      n: "03", icon: <Package size={26} />,
      title: "짐 운송 서비스를 추가하세요",
      body: (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            원하는 코스 예약 도구를 사용하여 출발 도시와 각 숙박지를 선택하세요.
            인원수와 짐 개수를 입력하신 후, 숙소 정보를 추가해 주시면 배송지를 정확하게 파악할 수 있습니다.
          </p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {[
              "가격은 가방 하나당, 이동 횟수당 계산됩니다.",
              "각 코스 페이지에는 최소 요구 사항 및 특별 참고 사항이 안내됩니다.",
              "가방 1개당 최대 무게는 20kg입니다.",
            ].map(t => (
              <li key={t} className="flex items-start gap-2">
                <Check size={13} className="text-accent flex-shrink-0 mt-0.5" />{t}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      n: "04", icon: <Truck size={26} />,
      title: "저희가 가방을 수거하고 배달해 드립니다",
      body: (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            매일 아침, 이름표를 붙인 가방을 지정된 시간까지 숙소 리셉션이나 약속된 수거 장소에 놓아주세요.
            고객님이 도착하시기 전에 다음 숙소로 가져다 드리겠습니다.
          </p>
          <div className="bg-background border border-accent/20 rounded-lg px-4 py-3 text-xs text-label font-medium">
            특정 숙박 시설의 출입이 제한될 경우, 가장 적절한 대체 운송 방법을 안내해 드립니다.
          </div>
        </>
      ),
    },
    {
      n: "05", icon: <CheckCircle size={26} />,
      title: "걸어서 도착하고, 휴식을 취하세요",
      body: (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed">
            하루 일정을 마치고 짐이 기다리고 있다는 사실에 안심하고 편히 쉬세요.
            무거운 배낭도, 우회도, 운송 걱정도 없습니다. 오직 눈앞에 펼쳐진 트레일만이 있을 뿐입니다.
          </p>
        </>
      ),
    },
  ];

  const notices = [
    { icon: <MapPin size={18} />, text: "정확한 숙소 정보(이름·주소)는 방문 배송을 위해 필수입니다." },
    { icon: <Package size={18} />, text: "각 가방의 무게는 20kg을 초과해서는 안 됩니다." },
    { icon: <AlertTriangle size={18} />, text: "일부 외딴 지역의 경우 추가 요금이 발생할 수 있습니다." },
    { icon: <Bell size={18} />, text: "예약 후 숙소를 변경하시는 경우 가능한 한 빨리 알려주세요." },
    { icon: <Mountain size={18} />, text: "트레일 탐색은 본인의 책임입니다. 일부 코스는 이정표가 부족할 수 있습니다." },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-surface-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">How It Works</p>
          <h1 className="text-5xl font-bold mb-6 font-serif">무거운 짐은 동키로드에 맡기세요</h1>
          <p className="text-white/75 leading-relaxed max-w-2xl mx-auto text-[14px]">동키로드는 동서트레일 운영 구간에서 믿을 수 있는 도어 투 도어 짐 운송 서비스를 제공합니다. 원하는 속도로 걷고, 원하는 숙소에서 머무르세요. 짐은 동키로드가 다음 숙소까지 안전하게 운송해 드리므로 배낭 하나만 메고 편안한 트레킹을 즐기실 수 있습니다.</p>
          <div className="mt-8 inline-flex items-center gap-2 bg-card/10 border border-white/20 rounded-full px-5 py-2.5 text-sm text-white/80">
            <Check size={15} className="text-accent" />
            저희는 숙박 예약을 해드리지 않습니다. 고객님이 머무시는 곳으로 직접 배송해 드립니다.
          </div>
        </div>
      </div>

      {/* Photo + intro */}
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <img
                src={UNSPLASH_IMAGES.howit}
                alt="동서트레일 짐 배송 서비스"
                className="rounded-xl w-full h-[420px] object-cover shadow-xl"
              />
            </div>
            <div>
              <p className="text-label text-sm font-semibold uppercase tracking-widest mb-3">5가지 간단한 단계로</p>
              <h2 className="text-4xl font-bold text-foreground mb-5 font-serif">
                짐 없이 트레일을<br />온전히 즐기세요
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                일정을 계획하고, 숙소를 직접 예약하고, 동키로드에 짐 배송을 맡기세요.
                나머지는 저희가 처리합니다. 아래 단계를 따라 쉽게 시작할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setPage("booking"); window.scrollTo(0, 0); }}
                  className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded transition-colors">
                  지금 예약하기
                </button>
                <button onClick={() => { setPage("faq"); window.scrollTo(0, 0); }}
                  className="border-2 border-foreground text-foreground hover:bg-secondary font-bold px-6 py-3 rounded transition-colors">
                  자주 묻는 질문
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="space-y-0">
            {steps.map(({ n, icon, title, body }, idx) => (
              <div key={n} className="relative flex gap-8">
                {/* Vertical connector */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-surface-dark text-white flex items-center justify-center flex-shrink-0 shadow-md z-10">
                    {icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-surface-dark/20 my-2" style={{ minHeight: "2.5rem" }} />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-12 flex-1 ${idx === steps.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-label text-xs font-bold tracking-widest mb-1.5">STEP {n}</p>
                  <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important notices */}
      <div className="bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 font-serif">
            알아두면 중요한 사항
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {notices.map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 bg-background rounded-lg p-4">
                <div className="text-label flex-shrink-0 mt-0.5">{icon}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="bg-surface-dark rounded-xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3 font-serif">
              시작할 준비 되셨나요?
            </h2>
            <p className="text-white/70 mb-2 max-w-xl mx-auto leading-relaxed">
              원하는 코스를 선택하고, 여정을 계획하고, 숙소를 예약한 후, 짐 운송 서비스까지 온라인으로 예약하세요.
            </p>
            <p className="text-white/50 text-sm mb-8">
              전체 코스의 일부만 걷거나 여러 코스를 연결하려면 문의해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => { document.getElementById("featured-routes") ? (setPage("home"), setTimeout(() => document.getElementById("featured-routes")?.scrollIntoView({ behavior: "smooth" }), 80)) : (setPage("home"), window.scrollTo(0, 0)); }}
                className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded transition-colors">
                코스 찾아보기
              </button>
              <button onClick={() => { setPage("booking"); window.scrollTo(0, 0); }}
                className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded transition-colors">
                짐 배송 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
