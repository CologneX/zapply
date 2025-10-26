import Link from "next/link";
import { RouteURL } from "@/lib/routes";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const ConfirmEmailOTPForm = dynamic(
  () => import("./_components/confirm-email-otp-form"),
  {
    loading: () => <Spinner className="mx-auto" />,
  }
);

const ResendEmailVerificationOTPButton = dynamic(
  () => import("./_components/resend-email-verification-top-button"),
  {
    loading: () => <Spinner className="h-4 w-4" />,
  }
);

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; otpSent?: boolean }>;
}) {
  const { email, otpSent: sent } = await searchParams;

  return (
    <div className="grid min-h-[calc(100vh-4rem)] w-full place-items-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          {sent && (
            <Alert className="text-xs sm:text-sm">
              <InfoIcon className="size-4" />
              <AlertTitle className="font-medium">
                Kode konfirmasi telah dikirim ke email Anda.
              </AlertTitle>
            </Alert>
          )}
          <header className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              Konfirmasi email Anda
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Masukkan kode 6 digit yang kami kirim ke alamat email Anda.
            </p>
          </header>
        </div>

        <ConfirmEmailOTPForm email={email!} />

        <div className="space-y-1 text-center">
          <div className="text-sm text-muted-foreground flex gap-2 justify-center">
            Tidak menerima kode?
            <ResendEmailVerificationOTPButton email={email!} />
          </div>

          <p className="text-xs text-muted-foreground">
            Salah email?{" "}
            <Link href={RouteURL.SIGNUP} className="link">
              Kembali ke daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
