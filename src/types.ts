export type Page = "home" | "booking" | "how-it-works" | "faq" | "contact" | "login" | "mypage" | "articles" | "article-detail" | "map" | "terms" | "privacy" | "compensation" | "reviews" | "about";
export type FeaturedRouteKey = "meet" | "experience";

export type TrailSection = {
  id: number;
  name: string;
  mainCourse: string;
  km: number | null;
  duration: string;
  difficulty: string;
  shelter: string;
  shelterAddress: string;
  tourismFood: string;
  region: string;
  from: string;
  via: string;
  to: string;
};

export type BookingOption = { id: string; label: string; desc: string; price: number; priceLabel: string; tentOnly?: boolean };

export type JourneyDay = { day: number; sectionId: number; date: string; nights: number; pickup: string; dropoff: string; stay: string; customStay: string; stayPhone?: string; stayAddress?: string; stayPostal?: string; bags: number; bus: boolean; options: string[] };
export type JourneyCart = { id: string; routeKey: FeaturedRouteKey; schedule: string; status: "CART" | "PAYMENT_PENDING" | "CONFIRMED"; createdAt: string; days: JourneyDay[]; total: number; reservationNo?: string };
export type HubPrefill = { pickup?: string; dropoff?: string; sectionId?: number };

export type Stay = { id: string; name: string; intro: string; location: string; phone: string; yanolja: string; image: string; mapQuery: string };

export type WeatherScore = {
  key: FeaturedRouteKey;
  title: string;
  region: string;
  temp: { min: number; max: number };
  rain: number;
  wind: number;
  sky: string;
  score: number;
  reason: string;
};
