# Labeled input (`labeled-input`)

Email input with a label and helper text.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/labeled-input
- Install: `npm create nextui add labeled-input`
- shadcn dependencies: input, label

## Usage

```tsx
"use client";

import { useState } from "react";
import { LabeledInput } from "@/components/nextui/labeled-input";

export function BillingEmail() {
  const [email, setEmail] = useState("");

  return (
    <LabeledInput
      id="billing-email"
      name="billingEmail"
      label="Billing email"
      description="Receipts go here every month."
      placeholder="billing@acme.com"
      value={email}
      onChange={setEmail}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `"Work email"` | Text of the label above the field |
| `description` | `ReactNode` | `"We will send the invoice to this address."` | Helper text under the field; null hides it |
| `placeholder` | `string` | `"you@company.com"` | Placeholder text |
| `type` | `HTMLInputTypeAttribute` | `"email"` | Input type |
| `id` | `string` | `"input-01-email"` | Field id, linked to the label |
| `name` | `string` |  | Field name for form submits |
| `value` | `string` |  | Controlled value |
| `defaultValue` | `string` |  | Starting value when uncontrolled |
| `onChange` | `(value: string) => void` |  | Called with the new value on each keystroke |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Any single form field that needs a visible label and a hint
- Give each instance its own id when several share a page

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/labeled-input.tsx`

```tsx
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
```
