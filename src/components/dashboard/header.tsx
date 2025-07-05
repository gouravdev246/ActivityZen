'use client';

import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/tasks', label: 'Task Manager' },
    { href: '/activities', label: 'Activities' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
          <Logo className="h-6 w-6 mr-2" />
          <h1 className="font-bold text-lg">Activity Tracker</h1>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://i.pravatar.cc/32" alt="User avatar" data-ai-hint="person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
