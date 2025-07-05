'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsClientPage() {
  return (
    <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences</p>
      </div>

      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <div className="relative flex items-center">
                <Input id="profile-picture" readOnly />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            <Button>Update Account</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default-activity">Default Activity Type</Label>
              <Select>
                <SelectTrigger id="default-activity">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select>
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
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select a time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmt-8">GMT-8 (PST)</SelectItem>
                  <SelectItem value="gmt-5">GMT-5 (EST)</SelectItem>
                  <SelectItem value="gmt">GMT</SelectItem>
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
              <Switch id="notifications" />
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="daily-target">Daily Activity Target (minutes)</Label>
              <Input id="daily-target" type="number" placeholder="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly-target">Weekly Activity Target (minutes)</Label>
              <Input id="weekly-target" type="number" placeholder="300" />
            </div>
            <Button>Update Goals</Button>
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
  );
}
