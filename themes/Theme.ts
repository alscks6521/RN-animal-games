export const lightTheme = {
  name: "light",
  colors: {
    primary: "#007AFF",
    secondary: "#5AC8FA",
    background: "#FFFFFF",
    text: "#000000",
  },
};

export const darkTheme = {
  name: "dark",
  colors: {
    primary: "#007AFF",
    secondary: "#5AC8FA",
    background: "#000000",
    text: "#FFFFFF",
  },
};

export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;
