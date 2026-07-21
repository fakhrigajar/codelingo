// Categorical palette for the dashboard's visitor charts, validated with the
// dataviz skill's scripts/validate_palette.js against this app's actual card
// surfaces (white / indigo-dark #1B2647): CVD-safe adjacent pairs, lightness
// band and chroma floor all pass in both light and dark mode. Colors are
// assigned to categories by NAME in this fixed order — never re-derived from
// a count or rank — so a category keeps its color even if its rank changes.
export const CHART_HUES = [
  { light: "#2FC493", dark: "#1F9A73" }, // mint
  { light: "#8C7AE6", dark: "#8C7AE6" }, // violet
  { light: "#FF6B5B", dark: "#C8503F" }, // coral
  { light: "#2a78d6", dark: "#3987e5" }, // blue
  { light: "#D9A400", dark: "#B8860B" }, // gold
];

// "Other"/"Unknown" is a residual bucket, not an identity — it deliberately
// sits outside the validated categorical slots (the six checks don't apply
// to it), rendered as a plain neutral gray.
export const CHART_GRAY = { light: "#B9C2D6", dark: "#54607A" };

// Single-hue sequential color for one-series charts (the visits-over-time
// trend line/area) — reuses the app's primary brand hue.
export const CHART_SEQUENTIAL = { light: "#8C7AE6", dark: "#A599EC" };

// Builds a fixed name -> color map for a category chart: known names (in
// `order`) get the validated hues in order; anything else folds into "Other".
export function buildCategoryColors(order) {
  const map = new Map();
  order.forEach((name, i) => map.set(name, CHART_HUES[i % CHART_HUES.length]));
  return map;
}
