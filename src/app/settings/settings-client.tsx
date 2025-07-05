'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ProfilePageClient() {
  const { toast } = useToast();

  const [accountInfo, setAccountInfo] = useState({
    name: "Alex Doe",
    email: "alex.doe@example.com",
  });
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(true);
  const [goals, setGoals] = useState({
    daily: "60",
    weekly: "300",
  });

  const handleAccountUpdate = () => {
    toast({ title: "Account Updated", description: "Your account information has been saved." });
  };
  
  const handlePreferencesSave = () => {
    toast({ title: "Preferences Saved", description: "Your app preferences have been saved." });
  };
  
  const handleGoalsUpdate = () => {
    toast({ title: "Goals Updated", description: "Your activity goals have been updated." });
  };

  return (
    <>
    <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your profile, account, and app preferences</p>
      </div>

      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={accountInfo.name}
                onChange={(e) => setAccountInfo({...accountInfo, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={accountInfo.email}
                onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <div className="flex items-center gap-4">
                 <img src="https://i.pravatar.cc/64" alt="User avatar" data-ai-hint="person" className="h-16 w-16 rounded-full"/>
                 <Button variant="outline">Change Picture</Button>
              </div>
            </div>
            <Button onClick={handleAccountUpdate}>Update Account</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable notifications for activity reminders and updates.
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <Button onClick={handlePreferencesSave}>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="daily-target">Daily Activity Target (minutes)</Label>
              <Input 
                id="daily-target" 
                type="number" 
                value={goals.daily}
                onChange={(e) => setGoals({...goals, daily: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly-target">Weekly Activity Target (minutes)</Label>
              <Input 
                id="weekly-target" 
                type="number" 
                value={goals.weekly}
                onChange={(e) => setGoals({...goals, weekly: e.target.value})}
              />
            </div>
            <Button onClick={handleGoalsUpdate}>Update Goals</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Link href="#" className="flex items-center justify-between p-4 hover:bg-accent transition-colors rounded-t-lg">
              <span className="font-medium">FAQs</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="border-t mx-4"></div>
            <Link href="#" className="flex items-center justify-between p-4 hover:bg-accent transition-colors rounded-b-lg">
              <span className="font-medium">Contact Support</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
    <Toaster />
    </>
  );
}
