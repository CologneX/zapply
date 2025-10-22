import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignInForm from "./_component/form";
import Link from "next/link";
import { RouteURL } from "@/lib/routes";
import { SignInWithGoogle } from "@/components/common/signin-socials-button";

export default function SignInPage() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold tracking-tight">Welcome</h3>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription>
              Enter your username and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form Fields */}
            <div className="space-y-4">
              <SignInForm />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In (uses server action to start OAuth flow) */}
            <SignInWithGoogle />
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={RouteURL.SIGNUP} className="link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
