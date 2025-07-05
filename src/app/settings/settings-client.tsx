
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-provider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


export default function ProfilePageClient() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    email: "",
  });
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(false);
  const [goals, setGoals] = useState({
    daily: "",
    weekly: "",
  });
  const [isLoadAlertOpen, setIsLoadAlertOpen] = useState(false);

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'U';
  
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const settingsDocRef = doc(db, 'settings', user.uid);
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
          const settings = docSnap.data();
          setAccountInfo({ name: user.displayName || "", email: user.email || "" });
          setTheme(settings.preferences?.theme || 'system');
          setNotifications(settings.preferences?.notifications || false);
          setGoals(settings.goals || { daily: "", weekly: "" });
        } else {
          // Set default values for a new user
          setAccountInfo({ name: user.displayName || "", email: user.email || "" });
          setTheme('system');
          setNotifications(false);
          setGoals({ daily: "", weekly: "" });
        }
      } catch (error) {
        console.error("Failed to load settings from Firestore", error);
        toast({
          variant: 'destructive',
          title: "Error",
          description: "Could not load your settings.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, toast]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
       // For 'system', we remove dark and let browser preferences take over
       document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleAccountUpdate = async () => {
    if (!user) return;
    try {
        const settingsDocRef = doc(db, 'settings', user.uid);
        await setDoc(settingsDocRef, { accountInfo: { name: accountInfo.name } }, { merge: true });
        toast({ title: "Account Updated", description: "Your account information has been saved." });
    } catch(e) {
        console.error("Error updating account:", e);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update account information." });
    }
  };
  
  const handlePreferencesSave = async () => {
    if (!user) return;
    try {
        const settingsDocRef = doc(db, 'settings', user.uid);
        await setDoc(settingsDocRef, { preferences: { theme, notifications } }, { merge: true });
        toast({ title: "Preferences Saved", description: "Your app preferences have been saved." });
    } catch(e) {
        console.error("Error saving preferences:", e);
        toast({ variant: 'destructive', title: "Error", description: "Failed to save preferences." });
    }
  };
  
  const handleGoalsUpdate = async () => {
    if (!user) return;
    try {
        const settingsDocRef = doc(db, 'settings', user.uid);
        await setDoc(settingsDocRef, { goals }, { merge: true });
        toast({ title: "Goals Updated", description: "Your activity goals have been updated." });
    } catch (e) {
        console.error("Error updating goals:", e);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update goals." });
    }
  };

  const handleSyncToCloud = async () => {
    if (!user) return;
    try {
      const activitiesData = localStorage.getItem('activity-zen-activities');
      const tasksData = localStorage.getItem('task-manager-tasks');
      
      const dataToSync = {
        activities: activitiesData ? JSON.parse(activitiesData) : [],
        tasks: tasksData ? JSON.parse(tasksData) : [],
        syncedAt: new Date().toISOString(),
      };

      const dataDocRef = doc(db, 'userData', user.uid);
      await setDoc(dataDocRef, dataToSync, { merge: true });

      toast({ title: "Data Synced", description: "Your activity and task data has been saved to the cloud." });
    } catch (e) {
      console.error("Error syncing data:", e);
      toast({ variant: 'destructive', title: "Error", description: "Failed to sync data." });
    }
  };

  const handleLoadFromCloud = async () => {
    if (!user) return;
    try {
      const dataDocRef = doc(db, 'userData', user.uid);
      const docSnap = await getDoc(dataDocRef);

      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData.activities) {
          localStorage.setItem('activity-zen-activities', JSON.stringify(cloudData.activities));
        }
        if (cloudData.tasks) {
          localStorage.setItem('task-manager-tasks', JSON.stringify(cloudData.tasks));
        }
        toast({ title: "Data Loaded", description: "Your data has been loaded from the cloud. The page will now reload." });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast({ title: "No Cloud Data", description: "No data found in the cloud for your account." });
      }
    } catch (e) {
      console.error("Error loading data:", e);
      toast({ variant: 'destructive', title: "Error", description: "Failed to load data from the cloud." });
    } finally {
      setIsLoadAlertOpen(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-8 max-w-3xl mx-auto">
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
               <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-36" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
               <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-36" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

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
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <div className="flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.photoURL ?? undefined} alt="User avatar" data-ai-hint="person" />
                  <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
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
                placeholder="e.g. 60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly-target">Weekly Activity Target (minutes)</Label>
              <Input 
                id="weekly-target" 
                type="number" 
                value={goals.weekly}
                onChange={(e) => setGoals({...goals, weekly: e.target.value})}
                placeholder="e.g. 300"
              />
            </div>
            <Button onClick={handleGoalsUpdate}>Update Goals</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Save your local activity and task data to the cloud to access it from other devices.</p>
              <Button onClick={handleSyncToCloud}>Sync Data to Cloud</Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Load your data from the cloud. This will overwrite any unsynced local data.</p>
              <Button variant="outline" onClick={() => setIsLoadAlertOpen(true)}>Load Data from Cloud</Button>
            </div>
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
    <AlertDialog open={isLoadAlertOpen} onOpenChange={setIsLoadAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Loading data from the cloud will overwrite your current local data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLoadFromCloud}>Yes, load data</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
