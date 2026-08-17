/**
 * 네이버 지도 Web Dynamic Map SDK 로더.
 *
 * 엔드포인트는 NCP 통합 이후 기준이다.
 *   현행: https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=...
 *   구형: openapi.map.naver.com + ncpClientId (govClientId/finClientId 포함, deprecated)
 *
 * 인증 실패(키 오류·서비스 URL 미등록)는 스크립트 로드 자체는 성공한 뒤
 * SDK 가 window.navermap_authFailure 를 호출하는 방식으로 통보된다.
 * 그래서 load 이벤트만으로는 성공 여부를 알 수 없다.
 */

export type NaverMapsStatus = "ready" | "auth-failed" | "load-error";

const SCRIPT_ID = "naver-maps-sdk";

let pending: Promise<NaverMapsStatus> | null = null;

/** 인증 실패는 로드 성공 이후에 통보될 수 있어 별도 구독자 목록으로 관리한다. */
const authFailureSubscribers = new Set<() => void>();

export function onNaverMapsAuthFailure(handler: () => void): () => void {
  authFailureSubscribers.add(handler);
  return () => authFailureSubscribers.delete(handler);
}

export function loadNaverMaps(keyId: string): Promise<NaverMapsStatus> {
  if (window.naver?.maps) return Promise.resolve("ready");
  if (pending) return pending;

  pending = new Promise<NaverMapsStatus>(resolve => {
    window.navermap_authFailure = () => {
      resolve("auth-failed");
      authFailureSubscribers.forEach(fn => fn());
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => {
      // authFailure 가 먼저 불렸다면 이 resolve 는 무시된다.
      resolve(window.naver?.maps ? "ready" : "auth-failed");
    });
    script.addEventListener("error", () => resolve("load-error"));

    if (!existing) {
      script.id = SCRIPT_ID;
      script.async = true;
      // submodules=geocoder — 주소↔좌표 변환(naver.maps.Service)을 브라우저에서 쓰기 위함.
      // Geocoding REST API 와 달리 시크릿 키가 필요 없고, 서비스 URL 등록으로 동일하게 보호된다.
      // NCP 콘솔에서 Geocoding 을 체크하지 않았다면 이 서브모듈 호출만 실패하고 지도는 정상 동작한다.
      script.src =
        `https://oapi.map.naver.com/openapi/v3/maps.js` +
        `?ncpKeyId=${encodeURIComponent(keyId)}&submodules=geocoder`;
      document.head.appendChild(script);
    }
  });

  // 실패한 로드는 다시 시도할 수 있도록 캐시를 비운다.
  pending.then(status => {
    if (status !== "ready") pending = null;
  });

  return pending;
}
