export const naverMapUrl = (query: string) => `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;

const JOURNEY_ORDINALS = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열한", "열두"];
export const journeyLabel = (n: number) => `${JOURNEY_ORDINALS[n - 1] ?? `${n}`} 번째 여정`;
