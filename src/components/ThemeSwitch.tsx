import React, { useState, useEffect } from "react";

import { FaMoon, FaSun } from "react-icons/fa6";

const ThemeSwitch: React.FC = () => {
  const initialThemeMode = localStorage.getItem("theme") || "light";
  const [themeMode, setThemeMode] = useState(initialThemeMode);

  const selectThemeHandler = (newThemeMode: string) => {
    if (newThemeMode === "dark" || newThemeMode === "light") {
      setThemeMode(newThemeMode);
      localStorage.setItem("theme", newThemeMode);
    }
  };

  useEffect(() => {
    if (themeMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <section className="inline-block float-left">
      <label className="switch" title={themeMode === "dark" ? "Click to switch to Light theme" : "Click to switch to Dark theme"}>
        <input
          name="Theme switch"
          
          type="checkbox"
          onClick={() =>
            selectThemeHandler(themeMode === "dark" ? "light" : "dark")
          }
        />
        <span className={`slider round ${themeMode === "dark" ? "dark" : ""}`}>
          {themeMode === "dark" ? (
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
