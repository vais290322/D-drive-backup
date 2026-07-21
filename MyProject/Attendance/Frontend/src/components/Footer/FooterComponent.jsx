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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-1">
            © {year} Airwayindia.
            <span className="flex items-center gap-1">
              Made with <Heart className={`h-3 w-3 ${theme === 'dark' ? 'text-red-500 animate-pulse' : 'text-red-400'}`} /> 
            </span>
          </div>
          <span>All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-sm text-muted-foreground">
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            >
              Created by vais
            </a>
          </div>
          
          <div className={`flex items-center gap-3 ${theme === 'dark' ? 'border-l border-border/50 pl-4' : ''}`}>
            <a href="#" className={`${theme === 'dark' ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className={`${theme === 'dark' ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className={`${theme === 'dark' ? 'text-muted-foreground hover:text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent