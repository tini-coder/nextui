import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type LabeledInputProps = {
  label?: React.ReactNode;
  /** Helper text under the field. Pass null to hide it. */
  description?: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/** A text field with a label above and helper text below. */
export function LabeledInput({
  label = "Work email",
  description = "We will send the invoice to this address.",
  placeholder = "you@company.com",
  type = "email",
  id = "input-01-email",
  name,
  value,
  defaultValue,
  onChange,
  className,
}: LabeledInputProps) {
  return (
    <div className={cn("grid w-full max-w-sm gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      {description != null && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export default function Input01() {
  return <LabeledInput />;
}
