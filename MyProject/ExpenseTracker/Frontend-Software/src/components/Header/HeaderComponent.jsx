import { SidebarTrigger } from '@/components/ui/sidebar'
import BreadCrumbComponent from '@/components/BreadCrumb/BreadCrumbComponent'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun, } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HeaderComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className={`sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 md:px-6 ${theme === 'dark' 
      ? 'bg-gradient-to-r from-card to-background border-border/30 shadow-md' 
      : 'bg-background'}`}>
      <div className="flex items-center gap-4">
        <SidebarTrigger className={`cursor-pointer ${theme === 'dark' ? 'text-primary hover:text-primary/80' : 'md:text-green-700'} transition-colors duration-200`} />
        <BreadCrumbComponent />
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant={theme === 'dark' ? 'outline' : 'ghost'} 
          size="icon" 
          onClick={toggleTheme} 
          className={`cursor-pointer relative overflow-hidden ${theme === 'dark' ? 'border-primary/20 bg-card/80 hover:bg-primary/10 hover:border-primary/30' : ''} transition-all duration-300`}
        >
          {theme === 'dark' 
            ? <Sun className="h-5 w-5 text-yellow-400 animate-in fade-in-0 zoom-in-95 duration-300" /> 
            : <Moon className="h-5 w-5 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-300" />}
          <span className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-primary/5' : ''} transition-all duration-300`}></span>
        </Button>
      </div>
    </header>
  )
}

export default HeaderComponent