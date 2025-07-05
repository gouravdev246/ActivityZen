
'use client';

import { Bell, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/tasks', label: 'Task Manager' },
    { href: '/activities', label: 'Activities' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Profile' },
  ];
  
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
           <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <h1 className="font-bold text-lg hidden sm:block">Activity Tracker</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? "User avatar"} data-ai-hint="person" />
                  <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
           <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium pt-6">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Logo className="h-6 w-6" />
                            <span>Activity Tracker</span>
                        </Link>
                        {navLinks.map(link => (
                           <SheetClose asChild key={link.href}>
                            <Link 
                                href={link.href} 
                                className={cn(
                                    "transition-colors hover:text-foreground",
                                    pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                           </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
}
