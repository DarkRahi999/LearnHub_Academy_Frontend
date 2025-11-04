"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({className}: {className?: string}) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 dark:hover:bg-blue-100/5 dark:hover:text-blue-200 hover:text-red-700 hover:font-bold group relative animate-fade-in-up"
    >
      <SunIcon className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:scale-110 ${className}`} />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:scale-110" />
    </Button>
  )
}