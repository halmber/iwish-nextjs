"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signInCredentials, signInGithub } from "./actions";
import {
  Form,
  FormMessage,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signInSchema, SignInSchemaType } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import GithubIcon from "@/components/GithubIcon";

export default function SignIn() {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: SignInSchemaType) {
    // execute(values);

    const response = await signInCredentials(values);

    if (response.success) {
      router.push("/");
    } else {
      toast({
        title: "Something went wrong",
        description: response.error,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your email"
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </CardContent>
          </form>
        </Form>

        <CardFooter>
          <Button
            onClick={() => signInGithub()}
            variant="outline"
            className="w-full"
          >
            Sign in with GitHub <GithubIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
