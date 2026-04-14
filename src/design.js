// ── Dark Glassmorphism Palette ─────────────────────────────────
export const C = {
  // Backgrounds
  bg:          "#070B14",
  bg2:         "#0C1120",
  // Glass surfaces
  glass:       "rgba(255,255,255,0.04)",
  glassHover:  "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderHover: "rgba(255,255,255,0.16)",
  // Text
  white:       "#F8FAFC",
  muted:       "#64748B",
  mutedLight:  "#94A3B8",
  // Accents
  green:       "#00D26A",
  greenDark:   "#00A854",
  greenDim:    "rgba(0,210,106,0.12)",
  greenBorder: "rgba(0,210,106,0.3)",
  blue:        "#3B82F6",
  blueDim:     "rgba(59,130,246,0.12)",
  purple:      "#8B5CF6",
  purpleDim:   "rgba(139,92,246,0.12)",
  pink:        "#EC4899",
  gold:        "#F59E0B",
  red:         "#EF4444",
  redDim:      "rgba(239,68,68,0.12)",
  orange:      "#F97316",
  // Gradients
  grad:        "linear-gradient(135deg, #00D26A 0%, #3B82F6 100%)",
  gradPurple:  "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
  gradGold:    "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  gradDark:    "linear-gradient(180deg, #070B14 0%, #0C1120 100%)",
};

export const ff  = "'Outfit', system-ui, sans-serif";
export const ffd = "'Playfair Display', Georgia, serif";

// ── Glassmorphism style preset ────────────────────────────────
export const glass = {
  background:       "rgba(255,255,255,0.04)",
  backdropFilter:   "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border:           "1px solid rgba(255,255,255,0.08)",
  borderRadius:     "16px",
};

export const glassBright = {
  ...glass,
  background: "rgba(255,255,255,0.07)",
  border:     "1px solid rgba(255,255,255,0.12)",
};
