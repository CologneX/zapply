"use client";

import { AppForm } from "@/components/common/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthQuery } from "@/hooks/query/use-auth";

export default function ResendEmailVerificationOTPButton({
  email,
}: {
  email: string;
}) {
  const form = useForm<{ email: string }>({
    defaultValues: {
      email: email,
    },
    resolver: zodResolver(z.object({ email: z.email() })),
  });
  const { ResendEmailVerification } = useAuthQuery();

  return (
    <AppForm
      onSubmit={form.handleSubmit((data) =>
        ResendEmailVerification.mutateAsync(data.email)
      )}
      form={form}
      error={ResendEmailVerification.error?.message || undefined}
    >
      <input type="hidden" name="email" value={email} />
      <button
        className="font-medium link"
        disabled={ResendEmailVerification.isPending}
        type="submit"
      >
        Kirim ulang
      </button>
    </AppForm>
  );
}
