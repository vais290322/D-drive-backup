import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Github, Twitter, Linkedin, Heart } from 'lucide-react'

const FooterComponent = () => {
  const { theme } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className={`mt-auto border-t py-4 px-6 w-full transition-all duration-300 ${theme === 'dark' 
      ? 'bg-gradient-to-b from-background to-card text-card-foreground border-border/30 shadow-inner' 
      : 'bg-muted/50'}`}>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4  ">
        <div className="text-sm text-muted-foreground flex items-center gap-2 ">
          © {year} VAIS. 
          <span className="flex items-center gap-1">
            Made with <Heart className={`h-3 w-3 ${theme === 'dark' ? 'text-red-500 animate-pulse' : 'text-red-400'}`} /> 
            <span>All rights reserved.</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent