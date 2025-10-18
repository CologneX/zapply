import React from "react";
import { Input } from "../ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function PasswordField({
  ...props
}: React.ComponentProps<typeof Input>) {
  const [isPassword, setIsPassword] = React.useState<boolean>(false);
  return (
    <div className="w-full relative">
      <Input {...props} type={isPassword ? "text" : "password"} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsPassword(!isPassword)}
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      >
        {isPassword ? (
          <EyeClosedIcon className="size-5" aria-hidden={true} />
        ) : (
          <EyeIcon className="size-5" aria-hidden={true} />
        )}
        <span className="sr-only">
          {isPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}