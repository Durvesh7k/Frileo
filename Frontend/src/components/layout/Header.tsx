
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SearchIcon, MenuIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          {/* Logo */}
          <div className="flex w-2/3 justify-between gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-blue">Freelance<span className="text-brand-orange">Flow</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/gigs" className="text-gray-600 hover:text-brand-blue transition">
                Explore Gigs
              </Link>
              {user && (
                <>
                  <Link to="/my-orders" className="text-gray-600 hover:text-brand-blue transition">
                    My Orders
                  </Link>
                  <Link to="/create-gig" className="text-gray-600 hover:text-brand-blue transition">
                    Create Gig
                  </Link>
                </>
              )}
            </nav>
          </div>


          {/* Search (Desktop) */}
          <div className="w-full flex justify-end">
            <div className="hidden md:flex items-center">
              <div className="relative mx-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search gigs..."
                  className="pl-10 w-64 focus:border-brand-blue"
                />
              </div>
            </div>
          </div>


          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:inline-flex">
                <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search gigs..."
                className="pl-10 w-full focus:border-brand-blue"
              />
            </div>
            <Link
              to="/gigs"
              className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              Explore Gigs
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-orders"
                  className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  My Orders
                </Link>
                <Link
                  to="/create-gig"
                  className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Create Gig
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={toggleMobileMenu}>Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
