"use client";
import { AppForm, AppFormField } from "@/components/common/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  ConfirmEmailRequestSchema,
  ConfirmEmailRequestType,
} from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { RouteURL } from "@/lib/routes";
import { useAuthQuery } from "@/hooks/query/use-auth";

export default function ConfirmEmailOTPForm({ email }: { email: string }) {
  if (!email) {
    redirect(RouteURL.SIGNIN);
  }

  const form = useForm<ConfirmEmailRequestType>({
    defaultValues: {
      code: "",
      email: email,
    },
    resolver: zodResolver(ConfirmEmailRequestSchema),
  });

  const { ConfirmEmailOTP } = useAuthQuery();

  return (
    <AppForm
      form={form}
      className="space-y-6"
      onSubmit={form.handleSubmit((data) => {
        ConfirmEmailOTP.mutateAsync(data);
      })}
      error={ConfirmEmailOTP.error?.message || undefined}
    >
      <input type="hidden" {...form.register("code")} />
      {/* Hidden submit trigger */}

      <AppFormField>
        <div className="space-y-2">
          <span className="sr-only" id="otp-label">
            Kata sandi sekali pakai
          </span>
          <div className="flex justify-center">
            <InputOTP
              onChange={(val) => {
                form.setValue("code", val, { shouldValidate: true });
                if (val.length === 6) {
                  form.trigger("code").then((valid) => {
                    if (valid) {
                      form.handleSubmit((data) => {
                        ConfirmEmailOTP.mutateAsync(data);
                      })();
                    }
                  });
                }
              }}
              aria-labelledby="code-label"
              maxLength={6}
              autoFocus
              disabled={ConfirmEmailOTP.isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
                <InputOTPSlot
                  index={1}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
                <InputOTPSlot
                  index={2}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
                <InputOTPSlot
                  index={4}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
                <InputOTPSlot
                  index={5}
                  className="size-12 md:size-14 text-lg md:text-xl font-semibold"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Tip: Anda dapat menempelkan seluruh kode.
          </p>
        </div>
      </AppFormField>
    </AppForm>
  );
}
