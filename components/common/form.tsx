import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useId } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface AppFormFieldProps {
  label?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function AppFormField({
  label,
  description,
  className,
  children,
}: AppFormFieldProps) {
  const fieldId = useId();

  return (
    <FormItem className={cn(className)}>
      {label && (
        <FormLabel
          htmlFor={fieldId}
          className="font-medidum text-muted-foreground"
        >
          {label}
        </FormLabel>
      )}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

export function AppForm<T>({
  children,
  form,
  error,
  ...props
}: Readonly<{
  children: React.ReactNode;
  error?: string;
  form: UseFormReturn<T & FieldValues>;
}> &
  React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form {...props} className={cn("space-y-4", props.className)}>
      <Form {...form}>{children}</Form>
      {error && (
        <Alert variant="destructive" className="border-destructive bg-red-100">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
