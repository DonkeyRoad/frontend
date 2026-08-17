/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 네이버 지도 Web Dynamic Map 인증용 Key ID (NCP 콘솔 발급).
   * 미설정·인증 실패 시 MapPage 는 SVG 개략도로 폴백한다.
   */
  readonly VITE_NAVER_MAP_KEY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
