import { ShieldAlert, FileText } from "lucide-react";

export function LegalPage({ kind }: { kind: "terms" | "privacy" | "compensation" }) {
  const data = {
    terms: { title: "이용약관", lead: "동키로드 짐 배송 예약, 결제, 취소 및 서비스 이용 조건을 안내합니다.", items: ["예약 상태는 장바구니, 결제진행중, 예약확정, 이용중, 이용완료, 취소요청, 취소완료로 관리됩니다.", "가방은 1개당 20kg 이하 캐리어/배낭만 접수하며 귀중품·고가 장비는 반드시 휴대해야 합니다.", "첫 픽업 기준 24시간 전까지 100% 환불, 24시간 이내/노쇼는 환불 불가입니다."] },
    privacy: { title: "개인정보처리방침", lead: "이름, 연락처, 이메일 등 예약 수행에 필요한 최소 정보만 수집합니다.", items: ["회원 탈퇴 시 개인정보는 즉시 파기하되 전자상거래법상 계약·결제 기록 5년, 소비자 분쟁 기록 3년은 보존합니다.", "비로그인 임시 데이터는 24시간 후 삭제됩니다.", "알림은 카카오 알림톡을 우선 사용하고 실패 시 SMS로 대체합니다."] },
    compensation: { title: "분실·파손 보상 정책", lead: "배송 중 분실·파손 발생 시 접수 절차와 보상 한도를 안내합니다.", items: ["보상 한도는 가방 1개당 12만 원입니다.", "수령 후 7일 이내 사진, 영수증 등 입증 자료와 함께 접수해야 합니다.", "현금, 귀중품, 고가 장비, 전자기기는 보상 대상에서 제외될 수 있으므로 휴대해 주세요."] },
  }[kind];
  return <div className="pt-16"><div className="bg-surface-dark text-white py-16"><div className="max-w-4xl mx-auto px-4 sm:px-6"><FileText className="text-accent mb-4" /><h1 className="text-5xl font-bold mb-4 font-serif">{data.title}</h1><p className="text-white/70">{data.lead}</p></div></div><div className="max-w-4xl mx-auto px-4 sm:px-6 py-12"><div className="bg-card border border-foreground/10 rounded-lg p-8"><ul className="space-y-4">{data.items.map(item => <li key={item} className="flex gap-3 text-sm text-[#3D4638] leading-relaxed"><ShieldAlert size={18} className="text-label shrink-0 mt-0.5" />{item}</li>)}</ul><div className="mt-8 p-4 bg-background rounded text-xs text-muted-foreground">사업자: 동키로드 주식회사 · 대표 김동키 · 사업자등록번호 123-45-67890 · 통신판매업 2026-서울마포-0000 · 개인정보보호책임자 이트레일</div></div></div></div>;
}
