"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useAuthQuery } from "@/hooks/query/use-auth";
import { AppForm, AppFormField } from "./form";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { closeDialog } from "./dialog";

export default function AccountSettingsContent() {
  const { Logout } = useAuthQuery();

  return (
    <div className="space-y-4">
      <Suspense fallback={<div>Loading...</div>}>
        <UsernameForm />
      </Suspense>
      <div className="flex gap-2 items-center justify-end">
        <Button
          variant="destructive"
          className="mr-auto"
          onClick={async () => {
            await Logout.mutateAsync();
            closeDialog();
          }}
          loading={Logout.isPending}
        >
          <LogOutIcon />
          Logout
        </Button>
      </div>
    </div>
  );
}

function UsernameForm() {
  const { ChangeUsername } = useAuthQuery();
  const session = useSession();
  const { data, isPending, refetch } = session;
  const usernameForm = useForm<{ username: string }>({
    defaultValues: {
      username: "",
    },
  });

  React.useEffect(() => {
    if (data?.user?.displayUsername) {
      usernameForm.setValue("username", data.user.displayUsername);
    }
  }, [data?.user?.displayUsername, usernameForm]);

  const handleUpdateUsername = async (formData: { username: string }) => {
    await ChangeUsername.mutateAsync(formData.username, {
      onError: (error: Error) => {
        usernameForm.setError("username", { message: error.message });
      },
    });
    refetch();
  };

  return (
    <AppForm form={usernameForm}>
      <FormField
        name="username"
        control={usernameForm.control}
        render={({ field }) => (
          <AppFormField className="flex-1" label="Username">
            <div className="flex flex-row gap-2 items-center">
              <Input {...field} disabled={isPending} />
              <Button
                variant="link"
                onClick={usernameForm.handleSubmit(handleUpdateUsername)}
                loading={ChangeUsername.isPending || isPending}
              >
                Update
              </Button>
            </div>
          </AppFormField>
        )}
      />
    </AppForm>
  );
}
