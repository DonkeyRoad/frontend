import { useState } from "react";
import { ChevronDown, Mountain, PlayCircle } from "lucide-react";
import { ARTICLE_DATA } from "../data/articles";

export function ArticlesPage({ onRead }: { onRead: (index: number) => void }) {
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("최신");
  const categories = ["전체", "준비물", "코스 가이드", "안전", "장비", "날씨", "관광", "맛집"];
  const shown = ARTICLE_DATA
    .filter(a => category === "전체" || a.category === category)
    .sort((a, b) => sort === "최신" ? b.date.localeCompare(a.date) : a.title.localeCompare(b.title));

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-surface-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">News & Stories</p>
          <h1 className="text-5xl font-bold mb-4 font-serif">트레일 소식</h1>
          <p className="text-white/70 max-w-2xl leading-relaxed">
            동키로드 트레일 팀이 직접 걷고 경험한 노하우를 담은 팁, 정보, 이야기를 전합니다.
            현지 정보와 충분한 준비, 그리고 짐 걱정 없는 여정으로 더 풍성한 걷기 여행을 즐기세요.
          </p>
        </div>
      </div>

      {/* Intro text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          현지 정보를 잘 알고 떠나는 걷기 여행은 훨씬 더 즐겁습니다. 제대로 준비하고, 짐은 동키로드에 맡기세요.
          동서트레일 인기 구간에서 알아두면 좋은 정보와 잊지 못할 이야기를 담았습니다.
        </p>
      </div>

      {/* Filter & sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  category === c
                    ? "bg-surface-dark text-white border-foreground"
                    : "bg-background text-foreground border-foreground/20 hover:border-foreground/50"
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none bg-card border border-foreground/20 text-foreground text-sm font-semibold rounded-full px-4 py-1.5 pr-8 cursor-pointer hover:border-foreground/50 transition-colors">
              <option value="최신">최신순</option>
              <option value="가나다순">가나다순</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map(article => {
            const index = ARTICLE_DATA.indexOf(article);
            const isVideo = article.kind === "video";
            return (
              <article key={article.title}
                onClick={() => onRead(index)}
                className="bg-card border border-foreground/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                {/* Thumbnail — always photo-style */}
                <div className="relative h-48 bg-secondary flex items-center justify-center">
                  <Mountain size={40} className="text-foreground/20" />
                  {isVideo && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <PlayCircle size={11} /> 영상
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-label bg-background px-2.5 py-1 rounded-full">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h2 className="font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-label transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{article.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        {shown.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-semibold mb-2">해당 카테고리의 글이 없습니다.</p>
            <button onClick={() => setCategory("전체")} className="text-sm text-foreground underline">전체 보기</button>
          </div>
        )}
      </div>
    </div>
  );
}
