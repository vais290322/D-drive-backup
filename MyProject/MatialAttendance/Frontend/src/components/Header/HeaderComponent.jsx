import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import BreadCrumbComponent from '@/components/BreadCrumb/BreadCrumbComponent'
import { useTheme } from '@/context/ThemeContext'
import { Bell, LogOut, Moon, Search, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/utils/auth/authSlice'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

const HeaderComponent = () => {
  const { theme, toggleTheme } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { email } = useSelector(state => state.auth)
  
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success('Logged out successfully')
  }
  
  return (
    <header className={`sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 md:px-6 ${theme === 'dark' 
      ? 'bg-gradient-to-r from-card to-background border-border/30 shadow-md' 
      : 'bg-background'}`}>
      <div className="flex items-center gap-4">
        <SidebarTrigger className={`cursor-pointer ${theme === 'dark' ? 'text-primary hover:text-primary/80' : 'md:text-green-700'} transition-colors duration-200`} />
        <BreadCrumbComponent />
      </div>
      
      <div className="flex items-center gap-4">
        {/* <div className={`relative hidden md:block transition-all duration-300 ${theme === 'dark' ? 'hover:scale-105' : ''}`}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            placeholder="Search..." 
            className={`rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${theme === 'dark' ? 'bg-card/50 border-border/50 placeholder:text-muted-foreground/70 focus:bg-card' : ''} transition-all duration-200`}
          />
        </div>
        
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
        
        <Button 
          variant={theme === 'dark' ? 'outline' : 'ghost'} 
          size="icon" 
          className={`cursor-pointer relative ${theme === 'dark' ? 'border-primary/20 bg-card/80 hover:bg-primary/10 hover:border-primary/30' : ''} transition-all duration-300`}
        >
          <Bell className={`h-5 w-5 ${theme === 'dark' ? 'text-primary' : ''}`} />
          <span className="absolute -right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">3</span>
        </Button> */}
        
        {email ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-sm font-medium">{email}</div>
            <Button 
              variant={theme === 'dark' ? 'outline' : 'ghost'} 
              size="icon" 
              onClick={handleLogout}
              className={`cursor-pointer ${theme === 'dark' ? 'border-primary/20 bg-card/80 hover:bg-primary/10 hover:border-primary/30' : ''} transition-all duration-300`}
            >
              <LogOut className={`h-5 w-5 ${theme === 'dark' ? 'text-primary' : ''}`} />
            </Button>
          </div>
        ) : (
          <Button 
            variant={theme === 'dark' ? 'outline' : 'ghost'} 
            size="icon" 
            className={`rounded-full cursor-pointer ${theme === 'dark' ? 'border-primary/20 bg-card/80 hover:bg-primary/10 hover:border-primary/30' : ''} transition-all duration-300`}
          >
            <User className={`h-5 w-5 ${theme === 'dark' ? 'text-primary' : ''}`} />
          </Button>
        )}
      </div>
    </header>
  )
}

export default HeaderComponent