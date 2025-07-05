import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Logo className="h-6 w-6 mr-2" />
          <h1 className="font-bold text-lg">Activity Tracker</h1>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link href="#" className="font-bold text-foreground transition-colors hover:text-foreground/80">Dashboard</Link>
          <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground/80">Activities</Link>
          <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground/80">Goals</Link>
          <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground/80">Reports</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
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
