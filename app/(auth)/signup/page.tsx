import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignUpForm from "./_component/form";
import Link from "next/link";
import { RouteURL } from "@/lib/routes";
import { Linkedin } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="tracking-tight">Selamat Datang</h3>
        </div>

        {/* Sign In Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Daftar</CardTitle>
            <CardDescription>
              Masukkan detail Anda untuk membuat akun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form Fields */}
            <div className="space-y-4">
              <SignUpForm />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              variant="outline"
              className="w-full h-11 text-base font-medium"
            >
              <Linkedin />
              Daftar dengan LinkedIn
            </Button>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href={RouteURL.SIGNIN} className="link">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
