import sectionInfoCsv from "../imports/Dongseo_Trail_Section_Info_utf8_csv.csv?raw";
import startEndCsv from "../imports/Dongseo_Trail_start_end.csv?raw";
import type { FeaturedRouteKey, TrailSection } from "../types";

export const FALLBACK_TEXT = "추후 업데이트 예정";

const csvSplit = (line: string) => {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; continue; }
    if (ch === '"') { quoted = !quoted; continue; }
    if (ch === "," && !quoted) { cells.push(cell.trim()); cell = ""; continue; }
    cell += ch;
  }
  cells.push(cell.trim());
  return cells;
};

const csvRows = (raw: string) => raw.split(/\r?\n/).filter(Boolean).map(csvSplit);
const sectionNumber = (value: string) => /^\d+구간$/.test((value || "").trim()) ? Number((value || "").match(/\d+/)?.[0] || 0) : 0;
const valueOrFallback = (value?: string) => value && value.trim() ? value.trim() : FALLBACK_TEXT;
const uniqueJoin = (values: string[]) => Array.from(new Set(values.filter(Boolean))).join(" / ") || FALLBACK_TEXT;

const parseTrailSections = (detailRaw: string, startEndRaw: string): TrailSection[] => {
  const startEnd = new Map<number, Partial<TrailSection>>();
  csvRows(startEndRaw).slice(1).forEach(row => {
    const id = sectionNumber(row[0]);
    if (!id) return;
    const km = Number.parseFloat(row[5]);
    startEnd.set(id, {
      id,
      name: `${id}구간`,
      from: valueOrFallback(row[1]),
      via: valueOrFallback(row[2]),
      to: valueOrFallback(row[3]),
      mainCourse: valueOrFallback(row[4]),
      km: Number.isFinite(km) ? km : null,
      duration: valueOrFallback(row[6]),
      difficulty: valueOrFallback(row[7]),
    });
  });

  const details = new Map<number, { shelters: string[]; addresses: string[]; foods: string[]; region?: string }>();
  csvRows(detailRaw).forEach(row => {
    const id = sectionNumber(row[0]);
    if (!id) return;
    const current = details.get(id) || { shelters: [], addresses: [], foods: [] };
    if (row[5]) current.shelters.push(row[5]);
    if (row[6]) {
      current.addresses.push(row[6]);
      current.region = current.region || row[6].split(" ").slice(0, 2).join(" ");
    }
    if (row[7]) current.foods.push(row[7]);
    details.set(id, current);
  });

  return Array.from({ length: 55 }, (_, index) => {
    const id = index + 1;
    const base = startEnd.get(id);
    const detail = details.get(id);
    return {
      id,
      name: `${id}구간`,
      mainCourse: base?.mainCourse || FALLBACK_TEXT,
      km: base?.km ?? null,
      duration: base?.duration || FALLBACK_TEXT,
      difficulty: base?.difficulty || FALLBACK_TEXT,
      shelter: uniqueJoin(detail?.shelters || []),
      shelterAddress: uniqueJoin(detail?.addresses || []),
      tourismFood: uniqueJoin(detail?.foods || []),
      region: detail?.region || FALLBACK_TEXT,
      from: base?.from || FALLBACK_TEXT,
      via: base?.via || FALLBACK_TEXT,
      to: base?.to || FALLBACK_TEXT,
    };
  });
};

export const TRAIL_SECTIONS = parseTrailSections(sectionInfoCsv, startEndCsv);

export const summarizeRange = (from: number, to: number) => {
  const sections = TRAIL_SECTIONS.filter(section => section.id >= from && section.id <= to);
  const first = sections.find(section => section.from !== FALLBACK_TEXT);
  const last = [...sections].reverse().find(section => section.to !== FALLBACK_TEXT);
  const distance = sections.reduce((sum, section) => sum + (section.km || 0), 0);
  const shelters = sections.flatMap(section => section.shelter.split(" / ")).filter(value => value && value !== FALLBACK_TEXT);
  return {
    start: first?.from || FALLBACK_TEXT,
    finish: last?.to || FALLBACK_TEXT,
    distance: distance > 0 ? `${Number(distance.toFixed(1))}km` : FALLBACK_TEXT,
    season: FALLBACK_TEXT,
    stays: Array.from(new Set(shelters)).slice(0, 3),
  };
};

export const FEATURED_ROUTE_GROUPS = [
  {
    key: "meet" as FeaturedRouteKey,
    title: "충남 1~12구간 코스",
    sections: "12개 구간",
    estDays: "약 12일",
    range: [1, 12],
    image: "trail1",
    description: "해안의 낙조부터 산악의 억새까지, 충남의 다양한 풍경을 만날 수 있는 총 169km, 12개 구간의 트레일입니다. 꽃지해변, 몽산포 숲길, 용봉산 능선, 오서산 억새를 가볍게 걸어보세요.",
    keywords: ["꽃지해변", "몽산포 솔숲", "용봉산 능선", "오서산 억새"],
    ...summarizeRange(1, 12),
  },
  {
    key: "experience" as FeaturedRouteKey,
    title: "경북 47~55구간 코스",
    sections: "9개 구간",
    estDays: "약 9일",
    range: [47, 55],
    image: "trail3",
    description: "백두대간수목원부터 부석사, 가천 남안길, 금강송 원시림을 지나 망양정까지 이어지는 총 134km, 9개 구간의 트레일입니다. 깊은 산길과 동해의 절경을 가볍게 즐겨보세요.",
    keywords: ["백두대간 수목원", "분천 산타마을", "금강송 원시림", "망양정"],
    ...summarizeRange(47, 55),
  },
];

export const RECOMMENDED_TEMPLATES: Record<FeaturedRouteKey, { label: string; nights: number; days: number; sections: number[]; note: string }> = {
  meet: { label: "2박3일 추천 코스", nights: 2, days: 3, sections: [2, 5, 7], note: "충남 서해안 핵심 3구간 — 하루 한 구간씩 여유롭게" },
  experience: { label: "4박5일 추천 코스", nights: 4, days: 5, sections: [47, 49, 51, 53, 55], note: "백두대간 정수 5구간 — 하루 한 구간씩 깊이 있게" },
};

export const difficultyColor = (d: string) => {
  if (d === FALLBACK_TEXT) return "bg-stone-100 text-stone-600";
  if (d.includes("1") || d.includes("2")) return "bg-green-100 text-green-800";
  if (d.includes("3")) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};
