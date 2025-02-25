"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signInAction } from "./actions";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <Link
            className="text-slate-400 text-center hover:underline"
            href="/sign-up"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </CardHeader>

        <form action={signInAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardContent>
        </form>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Sign in with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
