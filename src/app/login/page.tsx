
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account Created!", description: "You've been successfully signed up." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Signed In!", description: "Welcome back." });
      }
      router.push('/');
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Authentication Error", description: err.message });
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In!", description: "Welcome." });
      router.push('/');
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Google Sign-In Error", description: err.message });
    }
  };
  
  if (isLoading || user) {
     return (
         <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Redirecting...</p>
             </div>
          </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-10 w-10"/>
          </div>
          <CardTitle className="text-2xl">{isSigningUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSigningUp ? 'Enter your details to get started.' : 'Sign in to continue to your dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuthAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                {isSigningUp ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => setIsSigningUp(!isSigningUp)}>
              {isSigningUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
