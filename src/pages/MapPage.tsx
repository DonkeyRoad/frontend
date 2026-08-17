import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { UNSPLASH_IMAGES } from "../data/images";
import { TRAIL_MARKER_POS } from "../data/map";
import { FALLBACK_TEXT, FEATURED_ROUTE_GROUPS, TRAIL_SECTIONS } from "../data/trail";
import { geocodeAll } from "../lib/geocode";
import { loadNaverMaps, onNaverMapsAuthFailure } from "../lib/naver-maps";
import type { FeaturedRouteKey, HubPrefill, TrailSection } from "../types";

export function MapPage({ selectRoute, onStartJourney }: { selectRoute: (key: FeaturedRouteKey) => void; onStartJourney: (route: FeaturedRouteKey, hub: HubPrefill) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<FeaturedRouteKey | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const naverMapRef = useRef<naver.maps.Map | null>(null);
  const polylinesRef = useRef<naver.maps.Polyline[]>([]);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const sectionMarkersRef = useRef<naver.maps.Marker[]>([]);
  const [selectedSection, setSelectedSection] = useState<TrailSection | null>(null);
  const [pinState, setPinState] = useState<"idle" | "loading" | "done" | "empty">("idle");

  const keyId = import.meta.env.VITE_NAVER_MAP_KEY_ID ?? "";
  // 키가 없거나, 로드/인증에 실패하면 SVG 개략도로 폴백한다.
  const mapError = !keyId || !mapLoaded;

  // Load Naver Maps SDK
  useEffect(() => {
    if (!keyId) return;
    let alive = true;
    const unsubscribe = onNaverMapsAuthFailure(() => { if (alive) setMapLoaded(false); });
    loadNaverMaps(keyId).then(status => {
      if (alive) setMapLoaded(status === "ready");
    });
    return () => { alive = false; unsubscribe(); };
  }, [keyId]);

  // Init map once SDK is ready
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const N = window.naver?.maps;
    if (!N) return;
    const map = new N.Map(mapRef.current, {
      center: new N.LatLng(36.9, 127.8),
      zoom: 7,
      mapTypeId: N.MapTypeId.TERRAIN,
    });
    naverMapRef.current = map;

    // 페이지를 벗어났다 돌아와도 마커가 중복되지 않도록 정리한다.
    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      naverMapRef.current = null;
    };
  }, [mapLoaded]);

  // 코스 시작 핀 — 글자 없는 초록 원. 두 코스 모두 항상 표시하고,
  // 코스를 고르면 선택되지 않은 쪽을 흐리게 해서 현재 선택을 드러낸다.
  // 위치는 각 코스 첫 구간의 주소를 지오코딩해서 얻는다.
  // (data/map.ts 의 하드코딩 좌표는 실제 위치와 어긋나 있어 폴백으로만 쓴다)
  useEffect(() => {
    const map = naverMapRef.current;
    const N = window.naver?.maps;
    if (!mapLoaded || !map || !N) return;

    let alive = true;
    const starts = FEATURED_ROUTE_GROUPS
      .map(group => ({ group, section: TRAIL_SECTIONS.find(s => s.id === group.range[0]) }))
      .filter(x => x.section && x.section.shelterAddress !== FALLBACK_TEXT);

    geocodeAll(starts, x => x.section!.shelterAddress.split(" / ")[0]).then(points => {
      if (!alive) return;
      starts.forEach(item => {
        const geo = points.get(item);
        const [flat, flng] = TRAIL_MARKER_POS[item.group.key];
        const pos = new N.LatLng(geo?.lat ?? flat, geo?.lng ?? flng);
        const dimmed = active !== null && active !== item.group.key;
        const marker = new N.Marker({
          position: pos,
          map,
          icon: {
            content:
              `<div style="width:22px;height:22px;border-radius:50%;background:#5a7551;` +
              `border:3px solid #fbf7ee;box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:pointer;` +
              `opacity:${dimmed ? 0.3 : 1};"></div>`,
            anchor: new N.Point(11, 11),
          },
        });
        N.Event.addListener(marker, "click", () => setActive(item.group.key));
        markersRef.current.push(marker);
      });
    });

    return () => {
      alive = false;
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [active, mapLoaded]);

  // 코스를 고르면 그 코스의 구간별 핀을 띄운다.
  // 구간 좌표가 데이터에 없어서, CSV 의 대피소 소재지 주소를 지오코딩해 얻는다.
  useEffect(() => {
    const map = naverMapRef.current;
    const N = window.naver?.maps;
    if (!mapLoaded || !map || !N || !active) { setPinState("idle"); return; }

    const group = FEATURED_ROUTE_GROUPS.find(g => g.key === active);
    if (!group) return;
    const targets = TRAIL_SECTIONS.filter(
      s => s.id >= group.range[0] && s.id <= group.range[1] && s.shelterAddress !== FALLBACK_TEXT
    );

    let alive = true;
    setPinState("loading");

    // 구간당 대표 주소 하나만 조회한다. 결과는 lib/geocode 에서 캐시되므로 재클릭 시 즉시 뜬다.
    geocodeAll(targets, s => s.shelterAddress.split(" / ")[0]).then(points => {
      if (!alive) return;
      const bounds = new N.LatLngBounds();
      const path: naver.maps.LatLng[] = [];
      const seenAt = new Map<string, number>();
      const missing: number[] = [];
      let placed = 0;

      targets.forEach(section => {
        const p = points.get(section);
        if (!p) { missing.push(section.id); return; }

        // CSV 상 주소가 같은 구간들이 있다(예: 48·49구간).
        // 그대로 두면 핀이 정확히 겹쳐 하나만 보이므로 살짝 밀어 놓는다.
        const cellKey = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
        const dupIndex = seenAt.get(cellKey) ?? 0;
        seenAt.set(cellKey, dupIndex + 1);
        const nudge = dupIndex * 0.0045;

        const pos = new N.LatLng(p.lat + nudge, p.lng + nudge);
        path.push(pos);                       // 구간 순서대로 이어 폴리라인을 만든다
        const marker = new N.Marker({
          position: pos,
          map,
          icon: {
            content:
              `<div style="width:26px;height:26px;border-radius:50%;background:#fbf7ee;` +
              `border:2.5px solid #3f5c3a;color:#2a332a;font-size:11px;font-weight:800;` +
              `display:flex;align-items:center;justify-content:center;` +
              `box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;">${section.id}</div>`,
            anchor: new N.Point(13, 13),
          },
        });
        N.Event.addListener(marker, "click", () => setSelectedSection(section));
        sectionMarkersRef.current.push(marker);
        bounds.extend(pos);
        placed++;
      });

      // 구간 핀들을 순서대로 연결. 실제 트레일 경로가 아니라 구간 거점을 잇는 개략선이다.
      if (path.length >= 2) {
        polylinesRef.current.push(new N.Polyline({
          map,
          path,
          strokeColor: "#5a7551",
          strokeWeight: 5,
          strokeOpacity: 0.85,
          strokeLineCap: "round",
          strokeLineJoin: "round",
        }));
      }

      if (missing.length) {
        console.warn(`[map] 좌표를 못 찾아 핀이 빠진 구간: ${missing.join(", ")}구간`);
      }
      if (placed > 0) map.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 70 });
      setPinState(placed > 0 ? "done" : "empty");
    });

    return () => {
      alive = false;
      sectionMarkersRef.current.forEach(m => m.setMap(null));
      sectionMarkersRef.current = [];
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      setSelectedSection(null);
    };
  }, [active, mapLoaded]);

  const current = active ? FEATURED_ROUTE_GROUPS.find(g => g.key === active) ?? null : null;
  const sections = current ? TRAIL_SECTIONS.filter(s => s.id >= current.range[0] && s.id <= current.range[1]) : [];
  const difficulty = sections[0]?.difficulty || "난이도 정보 확인";

  const reserve = () => {
    if (!active || !current) return;
    selectRoute(active);
    onStartJourney(active, { sectionId: sections[0]?.id });
  };

  return (
    <div className="pt-16 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-surface-dark text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">TRAIL MAP</p>
          <h1 className="text-5xl font-bold mb-4 font-serif">트레일 코스 지도</h1>
          <p className="text-white/70 max-w-2xl">각 마커를 클릭하면 선택한 트레일에 대한 자세한 정보를 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Map panel */}
          <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
            {mapError ? (
              /* Schematic fallback — no API key */
              <div className="h-[620px] bg-[#DDE7D8] flex flex-col">
                {/* Korea schematic map */}
                <div className="flex-1 relative">
                  <svg viewBox="0 0 800 480" className="w-full h-full">
                    {/* Korea outline */}
                    <path d="M340 40 C395 28 458 34 500 62 C548 94 565 148 550 202 C584 242 594 304 568 354 C548 394 552 432 520 466 C490 500 458 526 418 540 C378 554 340 538 316 512 C292 486 298 450 275 416 C254 384 236 350 244 307 C252 262 226 228 238 184 C252 138 295 112 320 80 Z" fill="#d4e0c8" stroke="#2a332a" strokeWidth="2.5"/>
                    {/* Route 1: 충남 1~12 (west, orange) */}
                    <path d={active === "meet" || !active
                      ? "M280 320 C308 308 336 316 360 326 C388 338 414 346 436 334"
                      : "M280 320 C308 308 336 316 360 326 C388 338 414 346 436 334"}
                      fill="none" stroke={active === "meet" ? "#5a7551" : "#5a7551"} strokeWidth={active === "meet" ? 7 : 4}
                      strokeLinecap="round" strokeOpacity={active === "experience" ? 0.35 : 1} />
                    {/* Route 2: 경북 47~55 (east, green) */}
                    <path d="M466 374 C488 352 508 326 516 296 C524 266 526 236 512 210"
                      fill="none" stroke={active === "experience" ? "#5a7551" : "#5a7551"} strokeWidth={active === "experience" ? 7 : 4}
                      strokeLinecap="round" strokeOpacity={active === "meet" ? 0.35 : 1} />
                    {/* Gap (미개방 구간) dashed */}
                    <path d="M436 334 C446 330 452 348 466 374" fill="none" stroke="#2a332a" strokeWidth="2" strokeDasharray="5 5" opacity=".4"/>
                    {/* Pin 1: 1구간 */}
                    <g className="cursor-pointer" onClick={() => setActive("meet")} style={{ cursor: "pointer" }}>
                      <circle cx="280" cy="320" r="13" fill={active === "meet" ? "#5a7551" : "#2a332a"} stroke="white" strokeWidth="4"/>
                      <text x="280" y="300" textAnchor="middle" fontSize="12" fontWeight="800" fill={active === "meet" ? "#5a7551" : "#2a332a"}>1구간 시작</text>
                    </g>
                    {/* Pin 2: 47구간 */}
                    <g className="cursor-pointer" onClick={() => setActive("experience")} style={{ cursor: "pointer" }}>
                      <circle cx="466" cy="374" r="13" fill={active === "experience" ? "#5a7551" : "#2a332a"} stroke="white" strokeWidth="4"/>
                      <text x="490" y="396" textAnchor="middle" fontSize="12" fontWeight="800" fill={active === "experience" ? "#5a7551" : "#2a332a"}>47구간 시작</text>
                    </g>
                    {/* Legend */}
                    <rect x="20" y="20" width="220" height="80" rx="8" fill="white" opacity=".9"/>
                    <circle cx="40" cy="45" r="6" fill="#5a7551"/>
                    <text x="54" y="49" fontSize="11" fontWeight="700" fill="#2a332a">충남 1~12구간 (운영 중)</text>
                    <circle cx="40" cy="68" r="6" fill="#5a7551"/>
                    <text x="54" y="72" fontSize="11" fontWeight="700" fill="#2a332a">경북 47~55구간 (운영 중)</text>
                    <line x1="32" y1="87" x2="58" y2="87" stroke="#2a332a" strokeWidth="2" strokeDasharray="4 3" opacity=".5"/>
                    <text x="66" y="91" fontSize="11" fill="#4a5347">미개방 구간</text>
                  </svg>
                </div>
                {/* Bottom note */}
                <div className="px-5 py-3 bg-card/60 text-xs text-muted-foreground text-center border-t border-foreground/10">
                  Naver 지도 Key ID(<code className="bg-secondary px-1 rounded">VITE_NAVER_MAP_KEY_ID</code>) 설정 시 실제 지도로 전환됩니다.
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="h-[620px] w-full" />
            )}
          </div>

          {/* Sidebar */}
          <aside className="bg-card border border-foreground/10 rounded-xl p-6 h-fit lg:sticky lg:top-24">
            {!current ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin size={36} className="text-foreground/25 mb-4" />
                <p className="font-bold text-foreground mb-2">마커를 클릭하세요</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  지도의 구간 시작점 마커를 선택하면<br />코스 정보가 여기에 표시됩니다.
                </p>
                <div className="mt-6 space-y-2 w-full">
                  {FEATURED_ROUTE_GROUPS.map(g => (
                    <button key={g.key} onClick={() => setActive(g.key)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary transition-colors">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${g.key === "meet" ? "bg-primary" : "bg-accent"}`} />
                      <div>
                        <p className="text-sm font-bold text-foreground">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.sections} · {g.distance}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <img src={UNSPLASH_IMAGES[current.image as keyof typeof UNSPLASH_IMAGES]}
                  alt={`${current.title} 대표 이미지`}
                  className="w-full h-44 object-cover rounded-lg bg-secondary mb-5" />
                <p className="text-xs text-label font-bold tracking-widest mb-1">선택된 코스</p>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">
                  {current.title}
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">총 거리</p>
                    <b className="text-foreground">{current.distance}</b>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">구간 수</p>
                    <b className="text-foreground">{sections.length}개 구간</b>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">난이도</p>
                    <b className="text-foreground">{difficulty}</b>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">짐 이동</p>
                    <b className="text-accent">운영 중</b>
                  </div>
                </div>
                {/* 구간 핀 상태 / 선택한 구간 상세 */}
                <div className="mb-5">
                  {pinState === "loading" && (
                    <p className="text-xs text-muted-foreground bg-background rounded-lg p-3">
                      구간 위치를 불러오는 중…
                    </p>
                  )}
                  {pinState === "empty" && (
                    <p className="text-xs text-muted-foreground bg-background rounded-lg p-3 leading-relaxed">
                      구간 핀을 표시하지 못했습니다.<br />
                      NCP 콘솔에서 <b className="text-foreground">Geocoding</b> 이 켜져 있는지 확인해 주세요.
                    </p>
                  )}
                  {pinState === "done" && !selectedSection && (
                    <p className="text-xs text-muted-foreground bg-background rounded-lg p-3">
                      지도의 번호 핀을 누르면 구간 정보가 표시됩니다.
                    </p>
                  )}
                  {selectedSection && (
                    <div className="bg-background rounded-lg p-4 border border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-label tracking-widest">{selectedSection.id}구간</p>
                        <button onClick={() => setSelectedSection(null)}
                          className="text-xs text-muted-foreground underline">닫기</button>
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">
                        {selectedSection.from} → {selectedSection.to}
                      </p>
                      {selectedSection.via !== FALLBACK_TEXT && (
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          경유 {selectedSection.via}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {selectedSection.km !== null && <span>{selectedSection.km}km</span>}
                        {selectedSection.duration !== FALLBACK_TEXT && <span>{selectedSection.duration}</span>}
                        {selectedSection.difficulty !== FALLBACK_TEXT && <span>난이도 {selectedSection.difficulty}</span>}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {current.range[0]}구간 출발 → {current.range[1]}구간 종착<br />
                  <span className="text-xs">서쪽{current.key === "meet" ? " (태안 꽃지해변)" : ""} {current.key === "experience" ? " (봉화 내륙)" : ""}에서 {current.key === "meet" ? "내륙" : "동해 해안"}까지 이어지는 코스입니다.</span>
                </p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setActive(null)}
                    className="flex-1 border border-foreground/20 text-foreground font-semibold py-2.5 rounded-lg text-sm hover:bg-background transition-colors">
                    목록으로
                  </button>
                  <button onClick={reserve}
                    className="flex-2 bg-primary text-white font-bold py-2.5 rounded-lg text-sm hover:bg-primary-hover transition-colors">
                    이 코스로 예약
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
