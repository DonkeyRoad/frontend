import { FALLBACK_TEXT } from "./trail";
import type { Stay, TrailSection } from "../types";

export const STAY_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop&auto=format",
];

// 숙소 정보가 없는 마을(구간) — 사용자가 직접 예약한 숙소를 입력하도록 유도한다.
export const SECTIONS_WITHOUT_STAYS = new Set([3, 8, 51]);

export const buildSectionStays = (section: TrailSection): Stay[] => {
  if (SECTIONS_WITHOUT_STAYS.has(section.id)) return [];
  const town = section.from !== FALLBACK_TEXT ? section.from : `${section.id}구간`;
  const region = section.region !== FALLBACK_TEXT ? section.region : "동서트레일";
  const baseAddress = section.shelterAddress !== FALLBACK_TEXT ? section.shelterAddress.split(" / ")[0] : `${region} ${town} 일원`;
  const variants = [
    { suffix: "게스트하우스", intro: `트레일 출발점에서 도보 5분 거리, 이른 아침 짐을 맡기기 좋은 아담한 게스트하우스입니다.` },
    { suffix: "산장스테이", intro: `숲과 가까워 하루의 피로를 풀기 좋은 조용한 숙소로, 주차와 조식이 제공됩니다.` },
  ];
  return variants.map((v, i) => ({
    id: `stay-${section.id}-${i}`,
    name: `${town} ${v.suffix}`,
    intro: v.intro,
    location: baseAddress,
    phone: `0${(section.id % 6) + 4}1-${String((section.id * 137) % 900 + 100)}-${String((section.id * 911) % 9000 + 1000)}`,
    yanolja: `https://www.yanolja.com/search?keyword=${encodeURIComponent(`${town} ${v.suffix}`)}`,
    image: STAY_IMAGES[(section.id + i) % STAY_IMAGES.length],
    mapQuery: baseAddress,
  }));
};

export const mockShelterNames = (sec: TrailSection): string[] => {
  const base = sec.to !== FALLBACK_TEXT ? sec.to : `${sec.id}구간`;
  const region = sec.region !== FALLBACK_TEXT ? sec.region.split(" ")[1] || "" : "";
  return [`${base} 산림대피소`, `${region ? region + " " : ""}${base} 숲길대피소`].filter(Boolean);
};
