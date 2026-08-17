import type { BookingOption } from "../types";

export const SERVICE_CONDITIONS = {
  bagWeight: "가방 1개당 15kg 이하",
  bagCount: "1인 최대 3개",
  pickupDeadline: "당일 오전 08:00까지 인계",
  arrivalTarget: "당일 오후 16:00 목표 도착",
  operationDays: "화~일 운영 (월요일 휴무)",
  compensation: "분실·파손 보상 가방 1개당 최대 12만 원",
};

export const BOOKING_OPTIONS: BookingOption[] = [
  { id: "tent-rental", label: "텐트 대여", desc: "백패킹 텐트(4㎡ 이하) 대여 + 야영장 선배송", price: 25000, priceLabel: "20,000~30,000원", tentOnly: true },
  { id: "tent-setup", label: "텐트 설치·철수 대행", desc: "도착 전 설치, 출발 후 철수 — 현지 인력 수행", price: 25000, priceLabel: "20,000~30,000원", tentOnly: true },
  { id: "tent-laundry", label: "텐트 건조·세탁 후 집 배송", desc: "귀가 시 젖은 텐트 회수 → 건조·세탁 → 집 배송", price: 40000, priceLabel: "30,000~50,000원", tentOnly: true },
  { id: "home-delivery", label: "짐 집으로 배송", desc: "종주 종료 후 짐을 집까지 택배 발송", price: 12000, priceLabel: "10,000~15,000원" },
  { id: "local-dinner", label: "지역 만찬 세트", desc: "산나물 도시락 등 지역 특산 만찬 텐트 앞 배송", price: 20000, priceLabel: "15,000~25,000원" },
  { id: "finish-drink", label: "완주 한 잔 세트", desc: "봉화 전통주(막걸리)+지역 특산 안주", price: 22000, priceLabel: "15,000~30,000원" },
];

export const LINKED_STAYS = ["태안 꽃지 게스트하우스", "몽산포 솔숲스테이", "홍성 용봉산 산장", "보령 오서 억새민박", "봉화 백두대간 로지", "분천 산타마을 여관", "울진 금강송 스테이", "망양정 바다민박"];
export const CAPACITY_BY_DATE: Record<string, number> = { "2026-08-15": 100, "2026-08-16": 104, "2026-09-03": 97 };
export const capacityLabel = (date: string, bags: number) => { const used = CAPACITY_BY_DATE[date] ?? 42; const next = used + bags; return { used, next, closed: next > 100, left: Math.max(0, 100 - used) }; };
export const yanoljaSearchUrl = (region: string, checkIn: string, checkOut: string, guests = 1) => `https://www.yanolja.com/search?keyword=${encodeURIComponent(region)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
export const refundPreview = (amount: number) => [
  ["첫 픽업 24시간 전까지", `₩${amount.toLocaleString()} (100%)`],
  ["24시간 이내/노쇼", "₩0 (환불 불가)"],
  ["이용 중 잔여 일자 취소", "잔여 일자 요금의 50%"],
  ["악천후·입산통제 등 운영 중단", `₩${amount.toLocaleString()} (100%)`],
];
