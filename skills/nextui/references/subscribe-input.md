# Subscribe input (`subscribe-input`)

Newsletter-style input with a leading icon and submit button.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/subscribe-input
- Install: `npm create nextui add subscribe-input`
- npm dependencies: lucide-react
- shadcn dependencies: input, button

## Usage

```tsx
"use client";

import { Search } from "lucide-react";
import { IconInputButton } from "@/components/nextui/subscribe-input";

export function DocsSearch() {
  return (
    <IconInputButton
      icon={Search}
      type="search"
      name="q"
      ariaLabel="Search docs"
      placeholder="Search the docs"
      buttonLabel="Search"
      onSubmit={(query) => console.log("search", query)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | `Mail` | Icon inside the field on the left |
| `placeholder` | `string` | `"Enter your email"` | Placeholder text |
| `buttonLabel` | `ReactNode` | `"Subscribe"` | Text of the submit button |
| `type` | `HTMLInputTypeAttribute` | `"email"` | Input type |
| `ariaLabel` | `string` | `"Email"` | Accessible name for the field |
| `name` | `string` | `"email"` | Field name, also used to read the value on submit |
| `value` | `string` |  | Controlled value |
| `defaultValue` | `string` |  | Starting value when uncontrolled |
| `onChange` | `(value: string) => void` |  | Called with the new value on each keystroke |
| `onSubmit` | `(value: string) => void` |  | Called with the value on submit; prevents the native submit |
| `className` | `string` |  | Extra classes on the form |

## When to use

- Newsletter sign-ups, invite fields and inline search bars
- Without onSubmit the form submits natively, so it works with a server action or action URL

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/subscribe-input.tsx`

```tsx
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
```
