import { deep } from "@theme-ui/presets";
import { createContext } from "react";

export const theme = {
  ...deep,
  styles: {
    ...deep,
  },
};

export const context = createContext(theme);

export default theme;
