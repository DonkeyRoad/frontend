export type DeliveryStage = "접수" | "픽업완료" | "이동중" | "도착";
export const DELIVERY_STAGES: DeliveryStage[] = ["접수", "픽업완료", "이동중", "도착"];
// NOTE: 목업 로직 — 현재 0·1·2만 반환하므로 DeliveryTimeline의 "도착"(progress === 3)
// 분기는 화면에 나타나지 않는다. 실제 배송 상태 연동 시 함께 정리할 것.
export const deliveryProgress = (day: number): number => day === 1 ? 2 : day === 2 ? 1 : 0;
