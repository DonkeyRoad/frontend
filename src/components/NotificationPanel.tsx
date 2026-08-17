import { Bell, CircleCheck } from "lucide-react";
import type { JourneyCart } from "../types";

export function NotificationPanel({ cart }: { cart: JourneyCart }) {
  const notifications = [
    ["예약 확정", `예약번호 ${cart.reservationNo || "확인 중"}가 발급되었습니다.`, "카카오 알림톡 발송 완료 · 2026.07.15 10:04"],
    ["픽업완료", "동키 매니저가 가방을 인수하면 즉시 알려드립니다.", "알림톡 실패 시 SMS 자동 발송"],
    ["도착", "도착 거점 인계가 완료되면 수령 안내를 발송합니다.", "도착 목표: 당일 오후 4시"],
  ];
  return <div className="bg-card border border-foreground/10 rounded-xl p-6"><div className="flex items-center gap-2 mb-5"><Bell size={19} className="text-label" /><h3 className="font-bold text-foreground">알림 발송 내역</h3></div><div className="space-y-4">{notifications.map(([title, text, meta]) => <div key={title} className="flex gap-3"><div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0"><CircleCheck size={16} className="text-foreground" /></div><div><p className="text-sm font-bold text-foreground">{title}</p><p className="text-sm text-muted-foreground mt-0.5">{text}</p><p className="text-xs text-muted-foreground mt-1">{meta}</p></div></div>)}</div></div>;
}
