import { useState } from "react";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="pt-16">
      <div className="bg-surface-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-5xl font-bold mb-4 font-serif">문의하기</h1>
          <p className="text-white/70 max-w-xl">궁금하신 점이 있으시면 언제든지 연락해주세요.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            {[
              { icon: <Phone size={20} />, title: "전화 문의", lines: ["1588-0000", "평일 09:00~18:00"] },
              { icon: <Mail size={20} />, title: "이메일 문의", lines: ["hello@donkeyroad.kr", "24시간 이내 답변"] },
              { icon: <MapPin size={20} />, title: "주소", lines: ["서울특별시 마포구", "동서트레일 서비스센터"] },
            ].map(({ icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 bg-secondary text-foreground rounded flex items-center justify-center flex-shrink-0">{icon}</div>
                <div>
                  <p className="font-bold text-foreground mb-1">{title}</p>
                  {lines.map(l => <p key={l} className="text-muted-foreground text-sm">{l}</p>)}
                </div>
              </div>
            ))}
            <div className="bg-background p-5 rounded-lg">
              <h3 className="font-bold text-foreground mb-2">운영 시간</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>평일</span><span>09:00 ~ 18:00</span></div>
                <div className="flex justify-between"><span>토요일</span><span>09:00 ~ 13:00</span></div>
                <div className="flex justify-between"><span>일요일/공휴일</span><span>휴무</span></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-card border border-foreground/10 rounded-lg p-8">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">문의가 접수되었습니다</h3>
                <p className="text-muted-foreground text-sm">빠른 시일 내에 이메일로 답변 드리겠습니다.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-foreground underline">새 문의 작성</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">문의 양식</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">이름</label>
                      <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="홍길동"
                        className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">이메일</label>
                      <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="example@email.com"
                        className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">문의 유형</label>
                    <select value={form.subject} onChange={e => update("subject", e.target.value)}
                      className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors bg-secondary">
                      <option value="">선택해주세요</option>
                      <option>예약 문의</option>
                      <option>취소/환불 문의</option>
                      <option>배송 문의</option>
                      <option>단체 예약 문의</option>
                      <option>기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">문의 내용</label>
                    <textarea value={form.message} onChange={e => update("message", e.target.value)}
                      rows={6} placeholder="문의 내용을 자세히 입력해주세요."
                      className="w-full border-2 border-foreground/15 rounded p-3 text-sm focus:border-foreground outline-none transition-colors resize-none" />
                  </div>
                  <button onClick={() => setSent(true)}
                    className="w-full bg-surface-dark hover:bg-brand text-white font-bold py-3 rounded transition-colors">
                    문의 보내기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
