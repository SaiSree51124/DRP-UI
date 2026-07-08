// Keep your original colors exactly
export const C = {
  navy:   "#0A2E52",
  teal:   "#007B82",
  sage:   "#2D6A4F",
  slate:  "#1E3A5F",
  sky:    "#E8F4FD",
  light:  "#d7fcfe",
  tx:     "#02a7b0",
  bg:     "#F4F7FA",
  card:   "#FFFFFF",
  muted:  "#64748B",
  border: "rgba(10,46,82,0.10)",
};

// Dashboard hero, sidebar, page banners — deep, dimensional, ends with life-science green
export const GRAD = `linear-gradient(135deg, ${C.navy} 0%, ${C.teal} 60%, ${C.sage} 100%)`;

// Table headers, navbar, buttons — sharp navy to teal sweep, no green
export const GRAD_H = `linear-gradient(90deg, ${C.navy} 0%, ${C.teal} 100%)`;