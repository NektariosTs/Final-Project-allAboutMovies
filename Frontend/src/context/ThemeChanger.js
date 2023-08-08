import React, { createContext, useEffect } from 'react'

//functionality for the theme colors
export const ThemeContext = createContext()

const defaultTheme = "light";
const darkTheme = "dark";

export default function ThemeChanger({ children }) {
    const toggleTheme = () => {
        const oldTheme = getTheme();
        const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;//if old theme is equal default theme then we will use the dark theme otherwise we use default theme

        updateTheme(newTheme, oldTheme)

        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const theme = getTheme();
        if (!theme)
            updateTheme(defaultTheme);
        else
            updateTheme(theme);
    }, [])

    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

const getTheme = () => localStorage.getItem("theme"); //this getTheme will find the theme from inside the local storage and returned like this

const updateTheme = (theme, themeToRemove) => {

    //if there is theme to remove only then we will remove this theme otherwise we add this theme
    if (themeToRemove) document.documentElement.classList.remove(themeToRemove);
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);//restore this theme in the local storage
}

