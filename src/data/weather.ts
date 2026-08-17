import type { WeatherScore } from "../types";

export const mockWeather = (dateStr: string): WeatherScore[] => {
  const seed = dateStr ? dateStr.split("-").reduce((s, n) => s + Number(n), 0) : 42;
  const rainA = (seed * 7) % 80;
  const rainB = (seed * 13) % 80;
  const tempMaxA = 18 + ((seed * 3) % 14);
  const tempMaxB = 16 + ((seed * 5) % 16);
  const windA = 2 + ((seed * 2) % 9);
  const windB = 3 + ((seed * 4) % 9);

  const scoreOf = (rain: number, tempMax: number, wind: number) => {
    let s = 100;
    if (rain >= 60) s -= 30;
    else if (rain >= 40) s -= 15;
    if (tempMax > 30) s -= 20;
    else if (tempMax < 2) s -= 20;
    if (wind >= 9) s -= 20;
    else if (wind >= 6) s -= 10;
    return s;
  };

  const sA = scoreOf(rainA, tempMaxA, windA);
  const sB = scoreOf(rainB, tempMaxB, windB);

  const forecasts: WeatherScore[] = [
    {
      key: "meet", title: "충남 1~12구간 코스", region: "충청남도 서해안",
      temp: { min: tempMaxA - 10, max: tempMaxA }, rain: rainA, wind: windA,
      sky: rainA >= 60 ? "흐림/비" : rainA >= 40 ? "구름 많음" : "맑음",
      score: sA,
      reason: sA >= sB
        ? `강수확률 ${rainA}%로 낮고 기온 ${tempMaxA}℃로 트레킹하기 적합합니다.`
        : `강수확률 ${rainA}%로 경북 코스보다 ${rainA > rainB ? "높아" : "비슷하지만"} 해안 바람이 ${windA}m/s로 주의가 필요합니다.`,
    },
    {
      key: "experience", title: "경북 47~55구간 코스", region: "경상북도 내륙",
      temp: { min: tempMaxB - 11, max: tempMaxB }, rain: rainB, wind: windB,
      sky: rainB >= 60 ? "흐림/비" : rainB >= 40 ? "구름 많음" : "맑음",
      score: sB,
      reason: sB >= sA
        ? `강수확률 ${rainB}%로 낮고 기온 ${tempMaxB}℃, 바람 ${windB}m/s로 내륙 숲길 트레킹에 이상적입니다.`
        : `강수확률 ${rainB}%로 충남 코스보다 ${rainB > rainA ? "높아" : "비슷하지만"} 기온 ${tempMaxB}℃로 걷기 좋은 날씨입니다.`,
    },
  ];
  return forecasts.sort((a, b) => b.score - a.score);
};
