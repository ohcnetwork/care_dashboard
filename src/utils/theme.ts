export const checkTheme: () => "dark" | "light" = () => {
    const theme = localStorage.getItem('theme');
    if (theme && (theme === "dark" || theme === "light")) {
        return theme;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const hasPreference = typeof mql.matches === "boolean";
    if (hasPreference) {
        console.log("prefers-color-scheme", mql.matches ? "dark" : "light");
        localStorage.setItem('theme', mql.matches ? "dark" : "light");
        return mql.matches ? "dark" : "light";
    } else {
        localStorage.setItem('theme', "light");
        return "light";
    }
}