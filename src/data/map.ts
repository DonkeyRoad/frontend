import type { FeaturedRouteKey } from "../types";

export const TRAIL_ROUTE_PATHS: Record<FeaturedRouteKey, [number, number][]> = {
  meet: [
    [36.683, 126.304], // 1구간 꽃지해변 (태안 서쪽 끝)
    [36.730, 126.460], // 서산
    [36.690, 126.630], // 홍성
    [36.640, 126.800], // 예산
    [36.590, 126.970], // 12구간 종착 (내포 방향)
  ],
  experience: [
    [37.075, 128.910], // 47구간 시작 (봉화·울진 내륙)
    [37.150, 129.040],
    [37.270, 129.170],
    [37.400, 129.300],
    [37.495, 129.408], // 55구간 종착 (울진 해안 동쪽 끝)
  ],
};

export const TRAIL_MARKER_POS: Record<FeaturedRouteKey, [number, number]> = {
  meet:       [36.683, 126.304],
  experience: [37.075, 128.910],
};
