// 원본 6000x4000 JPEG(합계 23.8MB)을 용도별 폭으로 리사이즈한 WebP.
// 배경용 1920w, 카드용 1200w · quality 80 — 재변환 시 같은 기준을 유지할 것.
import heroImg from "../imports/hero-trail.webp";
import trail1Img from "../imports/route-chungnam.webp";
import trail3Img from "../imports/route-gyeongbuk.webp";
export { default as ctaBgImg } from "../imports/cta-trail.webp";

export const UNSPLASH_IMAGES = {
  hero: heroImg,
  trail1: trail1Img,
  trail2: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&auto=format",
  trail3: trail3Img,
  trail4: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&h=400&fit=crop&auto=format",
  mapMeet: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&h=520&fit=crop&auto=format",
  howit: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop&auto=format",
};

export const sectionImage = (id: number) => {
  if (id >= 13 && id <= 46) return UNSPLASH_IMAGES.trail4;
  const images = [UNSPLASH_IMAGES.trail1, UNSPLASH_IMAGES.trail2, UNSPLASH_IMAGES.trail3, UNSPLASH_IMAGES.howit];
  return images[(id - 1) % images.length];
};
