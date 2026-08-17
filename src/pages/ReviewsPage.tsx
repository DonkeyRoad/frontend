import { MessageSquare, Quote, ThumbsUp, ExternalLink } from "lucide-react";
import { StarRating } from "../components/StarRating";
import { REVIEWS_DATA } from "../data/reviews";

export function ReviewsPage() {
  const { averageRating, totalCount, platforms } = REVIEWS_DATA;
  const ratingBuckets = [5, 4, 3, 2, 1].map(star => {
    const count = platforms.flatMap(p => p.reviews).filter(r => Math.round(r.rating) === star).length;
    const total = platforms.flatMap(p => p.reviews).length;
    return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });

  return (
    <div className="pt-16 bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-surface-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">고객 리뷰</p>
          <h1 className="text-4xl font-bold mb-2">트레커들의 솔직한 이야기</h1>
          <p className="text-white/70 text-lg">동키로드를 이용한 고객분들의 생생한 후기입니다</p>
        </div>
      </div>

      {/* Overall score */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-card rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Big score */}
          <div className="flex flex-col items-center min-w-[160px]">
            <p className="text-7xl font-bold text-foreground leading-none">{averageRating.toFixed(1)}</p>
            <div className="mt-3 mb-2"><StarRating rating={averageRating} size={28} /></div>
            <p className="text-muted-foreground text-sm">총 {totalCount.toLocaleString()}건의 리뷰</p>
          </div>
          {/* Bar chart */}
          <div className="flex-1 w-full space-y-2">
            {ratingBuckets.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8 text-right text-muted-foreground font-medium">{star}점</span>
                <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-[#F59E0B] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground">{pct}%</span>
              </div>
            ))}
          </div>
          {/* Platform badges */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            {platforms.map(p => (
              <div key={p.name} className="flex items-center gap-3 bg-stone-50 rounded-lg px-4 py-2.5">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundColor: p.logoColor === "#FAE100" ? "#FAE100" : p.logoColor, color: p.logoColor === "#FAE100" ? "#333" : "white" }}
                >
                  {p.logo}
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{p.name}</p>
                  <p className="font-bold text-foreground text-sm">{p.rating.toFixed(1)} <span className="text-muted-foreground font-normal">({p.count})</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews per platform */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-14">
        {platforms.map(platform => (
          <div key={platform.name}>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base"
                style={{ backgroundColor: platform.logoColor, color: platform.logoColor === "#FAE100" ? "#333" : "white" }}
              >
                {platform.logo}
              </span>
              <div>
                <h2 className="text-xl font-bold text-foreground">{platform.name}</h2>
                <p className="text-sm text-muted-foreground">평균 {platform.rating.toFixed(1)}점 · {platform.count}개 리뷰</p>
              </div>
              <a href={platform.url} className="ml-auto flex items-center gap-1 text-sm text-label font-semibold hover:underline">
                전체 보기 <ExternalLink size={13} />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {platform.reviews.map((review, idx) => (
                <div key={idx} className="bg-card rounded-xl border border-foreground/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <Quote size={16} className="text-accent mb-2 opacity-60" />
                  <p className="text-[#3D4638] text-sm leading-relaxed">{review.text}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp size={12} /> <span>도움이 됐어요</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-surface-dark text-white py-14 text-center">
        <MessageSquare size={32} className="mx-auto text-accent mb-4" />
        <h3 className="text-2xl font-bold mb-2">이용 후기를 남겨주세요</h3>
        <p className="text-white/70 mb-6">여러분의 솔직한 후기가 더 나은 서비스를 만듭니다</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {REVIEWS_DATA.platforms.map(p => (
            <a
              key={p.name}
              href={p.url}
              className="flex items-center gap-2 bg-card/10 hover:bg-background/20 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: p.logoColor, color: p.logoColor === "#FAE100" ? "#333" : "white" }}>
                {p.logo}
              </span>
              {p.name}에 리뷰 작성
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
