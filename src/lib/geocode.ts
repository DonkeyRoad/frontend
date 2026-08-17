/**
 * 주소 → 좌표 변환. Dynamic Map 의 geocoder 서브모듈을 쓰므로 브라우저에서 동작한다.
 * (naver-maps.ts 가 submodules=geocoder 로 SDK 를 로드한 뒤에만 사용 가능)
 */

export type LatLng = { lat: number; lng: number };

/** 같은 주소를 두 번 조회하지 않는다. 세션 동안 유지된다. */
const cache = new Map<string, LatLng | null>();

/**
 * CSV 주소에 섞인 설명을 걷어낸다. 지오코더는 순수 지번/도로명만 인식하므로
 * 괄호 설명이 붙어 있으면 결과가 0건으로 나온다.
 *   "충남 홍성군 홍성읍 월산리(백월산 코끼리바위 옆)" → "충남 홍성군 홍성읍 월산리"
 *   "경북 울진군 금강송면 하원리 72번지 일원 (불영계곡 주변)" → "경북 울진군 금강송면 하원리 72"
 */
export function cleanAddress(raw: string): string {
  return raw
    .replace(/\([^)]*\)/g, " ")     // 괄호 설명
    .replace(/일원/g, " ")
    .replace(/번지/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 조회 후보를 넓은 순으로 만든다.
 * 번지까지 붙은 주소가 지오코더에 없는 경우가 있어(예: 47·55구간),
 * 실패하면 번지를 떼고 리(里) 단위로 재시도한다. 정확도는 떨어지지만 핀은 찍힌다.
 *   "경북 울진군 금강송면 하원리 72" → ["경북 울진군 금강송면 하원리 72", "경북 울진군 금강송면 하원리"]
 *   "충남 서산시 인지면 풍전리 산4"  → ["충남 서산시 인지면 풍전리 산4",  "충남 서산시 인지면 풍전리"]
 */
export function addressCandidates(raw: string): string[] {
  const base = cleanAddress(raw);
  if (!base) return [];
  const out = [base];

  // 2차: 번지를 뗀 리(里) 단위
  const withoutNumber = base.replace(/\s*산?\s*\d+(-\d+)?\s*$/, "").trim();
  if (withoutNumber && withoutNumber !== base) out.push(withoutNumber);

  // 3차: 그것도 없으면 읍·면 단위까지 물러선다
  const parts = (withoutNumber || base).split(" ");
  if (parts.length > 3) {
    const upper = parts.slice(0, -1).join(" ");
    if (upper && !out.includes(upper)) out.push(upper);
  }
  return out;
}

function geocodeOne(query: string): Promise<LatLng | null> {
  const cached = cache.get(query);
  if (cached !== undefined) return Promise.resolve(cached);

  return new Promise(resolve => {
    const svc = window.naver?.maps.Service;
    if (!svc) { resolve(null); return; }

    svc.geocode({ query }, (status, response) => {
      const hit = status === svc.Status.OK ? response.v2.addresses?.[0] : undefined;
      // 주의: x=경도, y=위도이고 둘 다 문자열로 온다.
      const point = hit ? { lat: Number(hit.y), lng: Number(hit.x) } : null;
      cache.set(query, point);
      resolve(point);
    });
  });
}

/** 후보를 순서대로 시도해 먼저 성공하는 좌표를 돌려준다. */
export async function geocode(rawQuery: string): Promise<LatLng | null> {
  const candidates = addressCandidates(rawQuery);
  for (const candidate of candidates) {
    const point = await geocodeOne(candidate);
    if (point) return point;
  }
  // 전부 실패하면 원인을 알 수 있게 남긴다. 어떤 주소가 문제인지 콘솔에서 바로 보인다.
  console.warn("[geocode] 좌표를 찾지 못했습니다:", rawQuery, "· 시도한 후보:", candidates);
  return null;
}

/**
 * 여러 주소를 동시에 조회한다. 네이버 쪽 부하와 속도의 절충으로 4개씩 끊어서 보낸다.
 * 실패한 주소는 결과에서 빠진다(에러로 만들지 않는다).
 */
export async function geocodeAll<T>(
  items: T[],
  toQuery: (item: T) => string,
  concurrency = 4
): Promise<Map<T, LatLng>> {
  const result = new Map<T, LatLng>();
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const points = await Promise.all(chunk.map(item => geocode(toQuery(item))));
    chunk.forEach((item, idx) => {
      const p = points[idx];
      if (p) result.set(item, p);
    });
  }
  return result;
}
