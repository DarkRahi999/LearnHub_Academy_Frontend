import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

interface F1InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  note?: string
  star?: boolean
  className?: string
}

const F1Input = React.forwardRef<HTMLInputElement, F1InputProps>(
  ({ name, label, note, star, className, ...props }, ref) => {
    return (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label} {star && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Input {...field} {...props} ref={ref} />
            </FormControl>
            {note && <FormDescription>{note}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

F1Input.displayName = "F1Input"

// Create a type that includes the Form property
type F1InputComponent = typeof F1Input & {
  Form: typeof FormField
}

// Attach FormField to F1Input for direct access
const F1InputWithForm = F1Input as F1InputComponent
F1InputWithForm.Form = FormField

export { F1InputWithForm as F1Input }