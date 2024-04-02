import React, { useState, useEffect } from "react";

import { FaMoon, FaSun } from "react-icons/fa6";

const ThemeSwitch: React.FC = () => {
  const initialTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(initialTheme);

  const selectThemeHandler = (newTheme: string) => {
    if (newTheme === "dark" || newTheme === "light") {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <section className="inline-block float-left">
      <label className="switch" title={theme === "dark" ? "Click to switch to Light theme" : "Click to switch to Dark theme"}>
        <input
          name="Theme switch"
          
          type="checkbox"
          onClick={() =>
            selectThemeHandler(theme === "dark" ? "light" : "dark")
          }
        />
        <span className={`slider round ${theme === "dark" ? "dark" : ""}`}>
          {theme === "dark" ? (
            <div className="mt-[1px] mr-7 py-1 px-[5px] cursor-pointer rounded-[8px] select-none">
               <FaSun
                aria-label="Switch to dark theme"
                className="w-[22px] h-[22px] m-auto text-[rgb(220,38,38)]"
              />
            </div>
          ) : (
            <div className="mt-[1.5px] ml-[26px] py-1 px-[5px] cursor-pointer rounded-[8px] select-none">
               <FaMoon
                aria-label="Switch to light theme"
                className="w-[21px] h-[21px] m-auto text-[rgb(255,183,58)]"
              />
            </div>
          )}
        </span>
      </label>
    </section>
  );
};

export default ThemeSwitch;
