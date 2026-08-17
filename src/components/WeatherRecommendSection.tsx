import { useState } from "react";
import { Search } from "lucide-react";
import { mockWeather } from "../data/weather";
import type { FeaturedRouteKey, WeatherScore } from "../types";

export function WeatherRecommendSection({ onBook, onDetail }: { onBook: (key: FeaturedRouteKey) => void; onDetail: (key: FeaturedRouteKey) => void }) {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 3);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const [date, setDate] = useState(fmt(new Date(today.getTime() + 86400000)));
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<WeatherScore[]>([]);

  const handleSearch = () => {
    setResults(mockWeather(date));
    setSearched(true);
  };

  const skyIcon = (sky: string) => sky.includes("비") ? "🌧️" : sky.includes("구름") ? "⛅" : "☀️";

  return (
    <section className="py-20" style={{ background: "linear-gradient(to bottom, #faf7f0, #f2ece0)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-label text-sm font-semibold uppercase tracking-widest mb-2">날씨 기반 추천</p>
          <h2 className="text-4xl font-bold text-foreground font-serif">어느 코스가 더 좋은 날일까요?</h2>
          <p className="text-muted-foreground text-sm mt-3">트레킹 예정 날짜를 입력하면 코스별 날씨를 비교해 추천 순위를 알려드립니다.</p>
          <p className="text-[#7a6e58] text-xs mt-1">※ 기상청 단기예보 기준 오늘로부터 3일 이내 날짜만 조회 가능합니다.</p>
        </div>

        {/* Date Input */}
        <div className="max-w-md mx-auto flex gap-3 mb-10">
          <input type="date" value={date}
            min={fmt(new Date(today.getTime() + 86400000))}
            max={fmt(maxDate)}
            onChange={e => { setDate(e.target.value); setSearched(false); }}
            className="flex-1 border border-[rgba(42,51,42,0.2)] rounded-lg px-4 py-3 text-foreground focus:border-[rgba(42,51,42,0.45)] outline-none bg-[rgba(255,255,255,0.55)] transition-colors placeholder:text-label" />
          <button onClick={handleSearch}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Search size={16} /> 날씨 확인
          </button>
        </div>

        {/* Results */}
        {searched && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {results.map((r, i) => (
              <div key={r.key}
                className={`rounded-lg border-2 overflow-hidden bg-card transition-shadow hover:shadow-lg ${i === 0 ? "border-accent" : "border-foreground/15"}`}>
                {i === 0 && (
                  <div className="bg-primary text-white text-xs font-bold text-center py-1.5 tracking-widest">
                    🏅 1순위 추천
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{r.region}</p>
                      <h3 className="font-bold text-foreground text-lg leading-tight">{r.title}</h3>
                    </div>
                    <span className="text-3xl">{skyIcon(r.sky)}</span>
                  </div>
                  {/* Weather summary */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-background rounded-lg p-3 mb-4">
                    <div>
                      <p className="font-bold text-foreground">{r.sky}</p>
                      <p className="text-muted-foreground mt-0.5">날씨</p>
                    </div>
                    <div className="border-x border-foreground/10">
                      <p className="font-bold text-foreground">{r.temp.min}~{r.temp.max}℃</p>
                      <p className="text-muted-foreground mt-0.5">기온</p>
                    </div>
                    <div>
                      <p className={`font-bold ${r.rain >= 60 ? "text-red-600" : r.rain >= 40 ? "text-yellow-600" : "text-foreground"}`}>{r.rain}%</p>
                      <p className="text-muted-foreground mt-0.5">강수확률</p>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 mb-5 text-xs leading-relaxed ${i === 0 ? "bg-secondary text-[#7a3b10]" : "bg-background text-muted-foreground"}`}>
                    {i === 0 ? "✅ " : "ℹ️ "}{r.reason}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onDetail(r.key)}
                      className="flex-1 border border-foreground text-foreground text-xs font-bold py-2.5 rounded hover:bg-secondary transition-colors">
                      코스 상세
                    </button>
                    <button onClick={() => onBook(r.key)}
                      className={`flex-1 text-white text-xs font-bold py-2.5 rounded transition-colors ${i === 0 ? "bg-primary hover:bg-primary-hover" : "bg-surface-dark hover:bg-brand"}`}>
                      이 여정으로 예약하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && (
          <p className="text-center text-[#7a6e58] text-sm">날짜를 선택하고 '날씨 확인' 버튼을 눌러보세요.</p>
        )}
      </div>
    </section>
  );
}
