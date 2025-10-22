"use client";

import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AppForm, AppFormField } from "@/components/common/form";
import { Input } from "@/components/ui/input";
import PasswordField from "@/components/common/password-field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpRequestSchema, SignUpRequestType } from "@/types/auth.types";
import { useAuthQuery } from "@/hooks/query/use-auth";
import { useEffect, useState } from "react";

export default function SignUpForm() {
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const form = useForm<SignUpRequestType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    resolver: zodResolver(SignUpRequestSchema),
  });
  const { SignUp, CheckUsernameAvailability } = useAuthQuery();
  const username = form.watch("username");

  useEffect(() => {
    if (!username || username.trim() === "") return;
    const timeout = setTimeout(() => {
      CheckUsernameAvailability.mutateAsync(username).then((res) => {
        if (typeof res === "boolean") {
          setUsernameAvailable(res);
          if (form.formState.errors.username?.type === "manual") {
            form.clearErrors("username");
          }
        } else {
          setUsernameAvailable(null);
          form.setError("username", {
            type: "manual",
            message: res.message || "Failed to check username availability.",
          });
        }
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [username, form, CheckUsernameAvailability]);
  return (
    <AppForm
      form={form}
      className="space-y-6"
      onSubmit={form.handleSubmit((data) => {
        SignUp.mutateAsync(data);
      })}
      error={SignUp.error?.message || undefined}
    >
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <AppFormField
            label="Username"
            description={
              (usernameAvailable && "Username is available") || undefined
            }
          >
            <Input type="text" {...field} />
          </AppFormField>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <AppFormField label="Nama">
            <Input type="text" {...field} />
          </AppFormField>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <AppFormField label="Email">
            <Input type="email" {...field} />
          </AppFormField>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <AppFormField label="Kata Sandi">
            <PasswordField {...field} />
          </AppFormField>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <AppFormField label="Konfirmasi Kata Sandi">
            <PasswordField {...field} />
          </AppFormField>
        )}
      />

      <Button className="w-full h-11 text-base font-medium" type="submit" loading={SignUp.isPending}>
        Sign Up
      </Button>
    </AppForm>
  );
}
