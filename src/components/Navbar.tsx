import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { ShoppingBag, User, LogOut, Shield, Grid3X3, Home, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, appUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Desktop nav items
  const navItems = [
    { path: '/', label: 'Accueil', icon: Home, auth: false },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield, auth: true });
  }

  return (
    <>
      {/* === TOP NAVBAR (desktop) === */}
      <nav className="hidden md:flex sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-court to-court-dark shadow-sm">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">New Jersey</span>
              <span className="hidden sm:block text-xs text-muted-foreground -mt-0.5">Collection basket</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="gap-3 rounded-full px-4 h-10 hover:bg-accent">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-court to-court-dark text-white text-xs font-bold">
                      {(appUser?.displayName || user.email || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-[140px] truncate">
                      {appUser?.displayName || user.email?.split('@')[0]}
                    </span>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <span className="font-medium">{appUser?.displayName || 'Membre'}</span>
                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-3 text-court" />
                      Administration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-3" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/login')}
                className="rounded-full px-5 h-9 bg-gradient-to-r from-court to-court-dark hover:from-court-dark hover:to-court-light shadow-sm"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* === MOBILE TOP BAR === */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-white/95 backdrop-blur border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-court to-court-dark">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base">New Jersey</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
        </button>
      </div>

      {/* === MOBILE DRAWER MENU === */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed right-0 top-14 bottom-0 z-50 w-72 bg-white border-l shadow-xl animate-in slide-in-from-right">
            <div className="p-4 space-y-2">
              {/* User info */}
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-court to-court-dark text-white font-bold">
                    {(appUser?.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{appUser?.displayName || 'Membre'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full rounded-xl mb-4 bg-gradient-to-r from-court to-court-dark"
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                >
                  Connexion / Inscription
                </Button>
              )}

              {/* Nav links */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive('/') ? 'bg-court/10 text-court font-medium' : 'hover:bg-accent'
                }`}
              >
                <Home className="h-5 w-5" />
                Accueil
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isActive('/admin') ? 'bg-court/10 text-court font-medium' : 'hover:bg-accent'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  Administration
                </Link>
              )}

              {user && (
                <>
                  <div className="border-t my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* === BOTTOM NAV BAR (mobile) === */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
              isActive('/') ? 'text-court' : 'text-muted-foreground'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                isActive('/admin') ? 'text-court' : 'text-muted-foreground'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="text-[10px] font-medium">Admin</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-muted-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[10px] font-medium">Quitter</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                isActive('/login') ? 'text-court' : 'text-muted-foreground'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">Connexion</span>
            </Link>
          )}
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
