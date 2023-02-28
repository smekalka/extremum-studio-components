export const getStyleVar = (variable: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable);
