import { useEffect } from "react";

export const useForceDarkTheme = () => {
  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, []);
};
