/**
 * 네이버 지도 JS SDK v3 최소 타입 선언.
 * MapPage 에서 실제로 쓰는 API 만 담았다 — 새 기능을 쓸 때 여기에 추가할 것.
 * 공식 문서: https://navermaps.github.io/maps.js.ncp/docs/
 */
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  const MapTypeId: {
    NORMAL: string;
    TERRAIN: string;
    SATELLITE: string;
    HYBRID: string;
  };

  interface MapOptions {
    center: LatLng;
    zoom: number;
    mapTypeId?: string;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    extend(latlng: LatLng): LatLngBounds;
    isEmpty(): boolean;
  }

  interface FitBoundsOptions {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    panTo(latlng: LatLng): void;
    fitBounds(bounds: LatLngBounds, options?: FitBoundsOptions): void;
  }

  interface MarkerIcon {
    content: string;
    anchor?: Point;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    icon?: MarkerIcon;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  interface PolylineOptions {
    map?: Map;
    path: LatLng[];
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    strokeLineCap?: "butt" | "round" | "square";
    strokeLineJoin?: "miter" | "round" | "bevel";
  }

  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
  }

  namespace Event {
    function addListener(target: object, eventName: string, handler: () => void): void;
  }

  /**
   * geocoder 서브모듈 (SDK URL 에 submodules=geocoder 필요).
   *
   * ⚠ 옵션 필드명 주의: 현행 NCP SDK 는 `query` 다.
   *    구버전 문서(maps.js.en)에 나오는 `address` 가 아니다.
   * ⚠ 좌표 x, y 는 number 가 아니라 문자열로 온다. (x=경도, y=위도)
   */
  namespace Service {
    const Status: { OK: number; ERROR: number };

    interface GeocodeOptions {
      /** 검색할 주소 */
      query: string;
      /** 검색 중심 좌표 "경도,위도" */
      coordinate?: string;
      filter?: string;
      page?: number;
      count?: number;
    }

    interface GeocodeAddress {
      roadAddress: string;
      jibunAddress: string;
      englishAddress: string;
      /** 경도 (문자열) */
      x: string;
      /** 위도 (문자열) */
      y: string;
      /** 검색 중심으로부터의 거리(m) */
      distance: string;
      addressElements: unknown[];
    }

    interface GeocodeResponse {
      v2: {
        status: string;
        addresses: GeocodeAddress[];
        errorMessage?: string;
      };
    }

    function geocode(
      options: GeocodeOptions,
      callback: (status: number, response: GeocodeResponse) => void
    ): void;

    interface ReverseGeocodeOptions {
      coords: LatLng | string;
      sourcecrs?: string;
      targetcrs?: string;
      orders?: string;
    }

    interface ReverseGeocodeResponse {
      v2: {
        status: { code: number; name: string; message: string };
        results: unknown[];
        address: { roadAddress: string; jibunAddress: string };
      };
    }

    function reverseGeocode(
      options: ReverseGeocodeOptions,
      callback: (status: number, response: ReverseGeocodeResponse) => void
    ): void;
  }
}

interface Window {
  naver?: typeof naver;
  /**
   * 인증 실패 시 SDK 가 호출하는 전역 콜백.
   * 키가 틀리거나 NCP 에 서비스 URL 이 등록되지 않았을 때 불린다.
   */
  navermap_authFailure?: () => void;
}
