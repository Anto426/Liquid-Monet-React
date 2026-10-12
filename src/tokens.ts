// Palette seeds and dimensions adapted from Liquid Monet SDK (Anto426, Apache-2.0).
export const liquidPresets = {
  sapphire: {
    light: "#0061a4",
    dark: "#9ecaff",
    secondary: "#535f70",
    tertiary: "#6b5778",
  },
  emerald: {
    light: "#006c4c",
    dark: "#75dcac",
    secondary: "#4c6356",
    tertiary: "#3d6373",
  },
  sunset: {
    light: "#8b5000",
    dark: "#ffb870",
    secondary: "#715b41",
    tertiary: "#53643e",
  },
  violet: {
    light: "#6b4ea2",
    dark: "#d3bbff",
    secondary: "#625b71",
    tertiary: "#7e5260",
  },
} as const;
export type LiquidPreset = keyof typeof liquidPresets;
export type LiquidMode = "light" | "dark" | "system";
export const liquidTokens = {
  radius: { card: 24, dialog: 32, control: 999 },
  blur: { subtle: 2, standard: 14, navigation: 8 },
  saturation: { control: 1.22, surface: 1.35, dialog: 1.4 },
  motion: { pressedScale: 0.96, duration: 360 },
} as const;
