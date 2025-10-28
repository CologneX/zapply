import { Loader } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="w-full h-full grid place-items-center">
      <Loader className="size-6 animate-spin" />
      <br />
      Loading...
    </div>
  );
}
