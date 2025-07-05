'use client';

import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

export function DashboardHeader() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/activities', label: 'Reports' },
    { href: '#', label: 'Settings' },
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
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search" className="w-full md:w-[200px] lg:w-[300px] pl-9" />
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://i.pravatar.cc/32" alt="User avatar" data-ai-hint="person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
