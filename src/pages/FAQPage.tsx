import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "예약은 언제까지 해야 하나요?", a: "출발일 최소 하루 전(오후 5시)까지 예약을 완료해주세요. 당일 예약은 오전 6시까지 가능하지만 추가 요금(₩2,000)이 발생합니다." },
    { q: "짐의 무게 제한이 있나요?", a: "기본 요금에 포함된 배낭은 개당 20kg까지 허용됩니다. 20~30kg 사이의 짐은 개당 ₩3,000의 추가 요금이 발생합니다. 30kg 이상의 짐은 접수가 불가합니다." },
    { q: "짐을 맡기는 시간은 언제인가요?", a: "출발 거점에서의 짐 접수는 오전 7시~9시입니다. 이 시간 이후에는 접수가 어려우니 반드시 시간을 지켜주세요." },
    { q: "짐을 받는 시간은 언제인가요?", a: "도착 거점에서 오후 5시~8시 사이에 짐을 찾으실 수 있습니다. 배송 완료 시 SMS로 알림을 보내드립니다." },
    { q: "예약 취소나 변경이 가능한가요?", a: "출발 48시간 전까지는 무료로 취소 또는 변경이 가능합니다. 24~48시간 전 취소 시 50% 환불, 24시간 미만 취소 시에는 환불이 불가합니다." },
    { q: "짐이 분실되거나 손상되면 어떻게 하나요?", a: "DonkeyRoad는 배송 중 발생하는 분실 또는 손상에 대해 보상을 제공합니다. 기본 플랜의 경우 최대 10만원, 프리미엄 플랜은 최대 50만원까지 보상됩니다. 문제 발생 즉시 고객센터로 연락해주세요." },
    { q: "어떤 구간에서 서비스를 이용할 수 있나요?", a: "동서트레일 전체 55구간에서 서비스를 이용할 수 있습니다. 일부 오지 구간의 경우 배송 시간이 다를 수 있으니 예약 시 확인해주세요." },
    { q: "단체로 예약할 수 있나요?", a: "5인 이상의 단체 예약은 문의하기 페이지를 통해 별도 문의해주세요. 단체 할인 및 특별 서비스를 제공해드립니다." },
  ];
  return (
    <div className="pt-16">
      <div className="bg-surface-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h1 className="text-5xl font-bold mb-4 font-serif">자주 묻는 질문</h1>
          <p className="text-white/70 max-w-xl">DonkeyRoad 이용 전 궁금하신 점들을 모았습니다.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-foreground/10 rounded-lg overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-background transition-colors">
                <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-foreground flex-shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-background rounded-lg">
          <p className="text-foreground font-semibold mb-2">원하시는 답변을 못 찾으셨나요?</p>
          <p className="text-muted-foreground text-sm mb-4">고객센터로 연락해주시면 친절하게 답변드리겠습니다.</p>
          <button className="bg-surface-dark text-white font-semibold px-6 py-3 rounded hover:bg-brand transition-colors text-sm">
            문의하기
          </button>
        </div>
      </div>
    </div>
  );
}
