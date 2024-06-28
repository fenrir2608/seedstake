import React from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../themeprovider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme(); 

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button variant="ghost" size="md" onClick={toggleTheme}>
    {theme === "light" && (
      <>
        <Sun className="ml-1 mt-1 h-4 w-4 mr-1"  /> 
        <span className="mt-1 pr-16">Light</span> 
      </>
    )}
    {theme === "dark" && (
      <>
        <Moon className="ml-1 mt-1 h-4 w-4 mr-1" />
        <span className="mt-1 pr-16">Dark</span> 
      </>
    )}
    {theme === "system" && (
      <>
        <SunMoon className="ml-1 mt-1 h-5 w-5 mr-1"  /> 
        <span className="mt-1 pr-16">System</span> 
      </>
    )}
  </Button>
  );
}
