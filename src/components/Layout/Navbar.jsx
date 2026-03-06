import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useAuth } from '../../context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Shield, Scissors, LayoutDashboard } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Book Now' },
]

export const Navbar = () => {
  const { user, profile, signOut, isAdmin, canAccessBarberDashboard, fullName } = useAuth()
  const location = useLocation()

  const getInitials = () => {
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  const getDisplayName = () => {
    if (fullName) return fullName
    return user?.email?.split('@')[0] || 'User'
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="border-b border-primary-foreground/10 bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-200"
          >
            Edward Cut Studio
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`
                  relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200
                  after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px
                  after:transition-transform after:duration-200 after:origin-left
                  ${isActive(to)
                    ? 'text-primary-foreground after:bg-primary-foreground after:scale-x-100'
                    : 'text-primary-foreground/60 hover:text-primary-foreground after:bg-primary-foreground after:scale-x-0 hover:after:scale-x-100'
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-1 ring-primary-foreground/20 hover:ring-primary-foreground/60 transition-all duration-200 p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary-foreground text-primary text-xs font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="truncate">{getDisplayName()}</span>
                    {isAdmin && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    {!isAdmin && profile?.is_barber && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Barber
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Admin Dashboard - for admins only */}
                  {isAdmin && (
                    <DropdownMenuItem asChild className="text-amber-600 font-medium">
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Barber Dashboard - for barbers and admins */}
                  {canAccessBarberDashboard && !isAdmin && (
                    <DropdownMenuItem asChild className="text-blue-600 font-medium">
                      <Link to="/barber-dashboard" className="flex items-center gap-2">
                        <Scissors className="h-4 w-4" />
                        Barber Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Customer Dashboard - for everyone */}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 text-sm font-medium"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm font-semibold transition-all duration-200"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}