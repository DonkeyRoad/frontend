import { useState } from "react";
import { Mountain, PlayCircle, ExternalLink } from "lucide-react";
import { ARTICLE_DATA } from "../data/articles";
import { FEATURED_ROUTE_GROUPS } from "../data/trail";
import type { FeaturedRouteKey, Page } from "../types";

export function ArticleDetailPage({ index, setPage, selectRoute }: { index: number; setPage: (p: Page) => void; selectRoute: (key: FeaturedRouteKey) => void }) {
  const [copied, setCopied] = useState(false);
  const article = ARTICLE_DATA[index] || ARTICLE_DATA[0];
  const group = FEATURED_ROUTE_GROUPS.find(g => g.key === article.route) || FEATURED_ROUTE_GROUPS[0];
  const articleUrl = `${window.location.origin}${window.location.pathname}?article=${index}`;
  const copyUrl = async () => { try { await navigator.clipboard.writeText(articleUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(true); } };
  const startBooking = () => { console.info("analytics.article_booking_cta", { article: article.title, route: article.route, at: new Date().toISOString() }); selectRoute(article.route); setPage("booking"); window.scrollTo(0, 0); };
  const isVideo = article.kind === "video";

  return (
    <div className="pt-16 bg-background min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <button onClick={() => setPage("articles")} className="text-sm text-foreground font-bold mb-8 flex items-center gap-1 hover:text-label transition-colors">
          ← 트레일 소식 목록
        </button>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-label bg-background px-2.5 py-1 rounded-full">{article.category}</span>
          {isVideo && <span className="text-xs font-bold text-white bg-brand px-2.5 py-1 rounded-full">영상</span>}
          <span className="text-xs text-muted-foreground">{article.date}</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground leading-snug mb-5 font-serif">
          {article.title}
        </h1>
        <div className="flex justify-between items-center border-y border-foreground/10 py-4 mb-8">
          <p className="text-sm text-muted-foreground">동키로드 트레일 팀</p>
          <button onClick={copyUrl}
            className="flex items-center gap-1.5 border border-foreground/20 rounded-lg px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors">
            <ExternalLink size={13} />
            {copied ? "URL 복사 완료 ✓" : "URL 공유·복사"}
          </button>
        </div>
        {/* 영상 콘텐츠는 상세에서만 플레이어 표시 */}
        {isVideo ? (
          <div className="h-72 bg-brand rounded-xl flex items-center justify-center text-white mb-10">
            <PlayCircle size={56} className="text-accent" />
          </div>
        ) : (
          <div className="h-64 bg-secondary rounded-xl flex items-center justify-center mb-10">
            <Mountain size={48} className="text-foreground/20" />
          </div>
        )}
        <div className="space-y-5 text-[#3D4638] leading-8 text-[15px]">
          {article.body.map(p => <p key={p}>{p}</p>)}
        </div>
        {article.category === "관광" && (
          <div className="mt-12 rounded-xl bg-card border border-foreground/10 p-6">
            <p className="text-xs text-label font-bold mb-2">관련 코스에서 예약하기</p>
            <h2 className="text-xl font-bold text-foreground">{group.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{group.sections} · {group.distance} · 짐 이동 가능</p>
            <button onClick={startBooking} className="mt-5 w-full bg-primary text-white font-bold py-3 rounded text-sm hover:bg-primary-hover transition-colors">
              이 코스로 예약하기
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
