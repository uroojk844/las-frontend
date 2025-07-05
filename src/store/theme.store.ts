import { defineStore } from "pinia";
import { computed, ref } from "vue";

type TThemeMode = "dark" | "light";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<TThemeMode>(
    (localStorage.getItem("theme-mode") as TThemeMode) || "light"
  );

  const getTheme = computed(() => theme.value);

  function toggleTheme() {
    if (theme.value === "dark") {
      theme.value = "light";
    } else {
      theme.value = "dark";
    }
    document.body.classList.toggle("dark");
    localStorage.setItem("theme-mode", theme.value);
  }

  return {
    getTheme,
    toggleTheme,
  };
});
