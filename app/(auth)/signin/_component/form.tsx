"use client";

import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AppForm, AppFormField } from "@/components/common/form";
import { Input } from "@/components/ui/input";
import PasswordField from "@/components/common/password-field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInRequestSchema, SignInRequestType } from "@/types/auth.types";
import Link from "next/link";
import { useAuthQuery } from "@/hooks/query/use-auth";

export default function SignInForm() {
  const form = useForm<SignInRequestType>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(SignInRequestSchema),
  });

  const { SignIn } = useAuthQuery();
  return (
    <AppForm
      form={form}
      className="space-y-6"
      onSubmit={form.handleSubmit((data) => {
        SignIn.mutateAsync(data);
      })}
      error={SignIn.error?.message || undefined}
    >
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <AppFormField label="Username">
            <Input placeholder="Enter your username" {...field} />
          </AppFormField>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <AppFormField label="Password">
            <PasswordField placeholder="Enter your password" {...field} />
          </AppFormField>
        )}
      />
      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link href={"/forgot-password"} className="link">
          Forgot your password?
        </Link>
      </div>

      {/* Sign In Button */}
      <Button
        className="w-full h-11 text-base font-medium"
        type="submit"
        loading={SignIn.isPending}
      >
        Sign In
      </Button>
    </AppForm>
  );
}
