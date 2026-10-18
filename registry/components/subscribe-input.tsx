import { Mail, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type IconInputButtonProps = {
  /** Icon drawn inside the field on the left. */
  icon?: LucideIcon;
  placeholder?: string;
  buttonLabel?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  /** Accessible name for the field, since it has no visible label. */
  ariaLabel?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called with the field's value; the native form submit is prevented when set. */
  onSubmit?: (value: string) => void;
  className?: string;
};

/** A field with a leading icon and a submit button beside it. */
export function IconInputButton({
  icon: Icon = Mail,
  placeholder = "Enter your email",
  buttonLabel = "Subscribe",
  type = "email",
  ariaLabel = "Email",
  name = "email",
  value,
  defaultValue,
  onChange,
  onSubmit,
  className,
}: IconInputButtonProps) {
  return (
    <form
      className={cn("flex w-full max-w-md gap-2", className)}
      onSubmit={
        onSubmit
          ? (e) => {
              e.preventDefault();
              onSubmit(String(new FormData(e.currentTarget).get(name) ?? ""));
            }
          : undefined
      }
    >
      <div className="relative flex-1">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          className="pl-9"
          aria-label={ariaLabel}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      </div>
      <Button type="submit">{buttonLabel}</Button>
    </form>
  );
}

export default function Input02() {
  return <IconInputButton />;
}
