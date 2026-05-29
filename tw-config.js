// Shared Tailwind config for GM Carpentry & Trimworks
// Loaded AFTER the Tailwind Play CDN (see HTML head order)
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
        colors: {
          // Surfaces
          "surface": "#faf9f7",        // cream paper
          "surface-2": "#f1efeb",       // warm linen
          "surface-3": "#e7e3dc",       // dusty parchment
          "surface-ink": "#181818",     // near-black

          // Ink
          "ink": "#161616",             // primary text
          "ink-2": "#3a3936",           // secondary
          "ink-3": "#6b6863",           // tertiary
          "ink-4": "#a39f97",           // muted hairline

          // Brand walnut accent
          "walnut": "#785833",          // primary accent
          "walnut-2": "#5d421d",        // pressed
          "walnut-3": "#a07a4a",        // hover
          "walnut-tint": "#e9bf91",     // tinted
          "cream": "#faf9f7",

          // Hairline
          "rule": "rgba(38, 21, 0, 0.18)",
          "rule-strong": "rgba(38, 21, 0, 0.32)",
          "rule-dark": "rgba(255, 255, 255, 0.14)",
        },
        spacing: {
          "xs": "4px",
          "sm": "12px",
          "base": "8px",
          "md": "24px",
          "lg": "48px",
          "xl": "80px",
          "2xl": "120px",
          "gutter": "24px",
          "margin-mobile": "20px",
          "margin-desktop": "48px",
          "container-max": "1320px",
        },
        borderRadius: {
          "DEFAULT": "2px",
          "sm": "2px",
          "md": "4px",
          "lg": "8px",
          "full": "9999px",
        },
        // Typography split (see design-system/gm-carpentry/MASTER.md):
        // font-sans  → Hanken Grotesk: hero H1 (.hero-title), body, nav, buttons, stat nums (.stat-num)
        // font-display → Hanken (legacy alias; prefer font-sans on markup)
        // font-mono  → JetBrains: coordinates (.coord-line), spec rows, project refs
        fontFamily: {
          "display": ["'Hanken Grotesk'", "system-ui", "sans-serif"],
          "sans": ["'Hanken Grotesk'", "system-ui", "sans-serif"],
          "mono": ["'JetBrains Mono'", "ui-monospace", "monospace"],
        },
        fontSize: {
          "eyebrow":   ["11px",  { lineHeight: "1.2", letterSpacing: "0.22em", fontWeight: "600" }],
          "label":     ["13px",  { lineHeight: "1.2", letterSpacing: "0.14em", fontWeight: "600" }],
          "body-sm":   ["14px",  { lineHeight: "1.6", fontWeight: "400" }],
          "body":      ["16px",  { lineHeight: "1.65", fontWeight: "400" }],
          "body-lg":   ["18px",  { lineHeight: "1.6", fontWeight: "400" }],
          "lead":      ["21px",  { lineHeight: "1.5", fontWeight: "400" }],
          "h6":        ["18px",  { lineHeight: "1.3", fontWeight: "600" }],
          "h5":        ["22px",  { lineHeight: "1.3", fontWeight: "600" }],
          "h4":        ["28px",  { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.005em" }],
          "h3":        ["38px",  { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
          "h2":        ["52px",  { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.015em" }],
          "h1":        ["72px",  { lineHeight: "1.04", fontWeight: "700", letterSpacing: "-0.02em" }],  // sans via .hero-title
          "hero":      ["108px", { lineHeight: "0.98", fontWeight: "700", letterSpacing: "-0.03em" }],  // sans via .hero-title
        },
        boxShadow: {
          "card":  "0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -12px rgba(38,21,0,0.18)",
          "high":  "0 30px 60px -30px rgba(38,21,0,0.35), 0 8px 16px -8px rgba(38,21,0,0.15)",
          "inset-rule": "inset 0 -1px 0 rgba(38,21,0,0.18)",
        },
        letterSpacing: {
          "wider":   "0.14em",
          "widest":  "0.22em",
        },
      },
    },
};
