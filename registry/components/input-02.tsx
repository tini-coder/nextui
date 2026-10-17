import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Input02() {
  return (
    <form className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="email" placeholder="Enter your email" className="pl-9" aria-label="Email" />
      </div>
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
