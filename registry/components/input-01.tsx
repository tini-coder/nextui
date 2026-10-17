import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input01() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="input-01-email">Work email</Label>
      <Input id="input-01-email" type="email" placeholder="you@company.com" />
      <p className="text-xs text-muted-foreground">We will send the invoice to this address.</p>
    </div>
  );
}
