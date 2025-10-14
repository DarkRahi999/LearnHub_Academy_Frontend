import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

interface F1TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  note?: string
  star?: boolean
  className?: string
}

const F1Textarea = React.forwardRef<HTMLTextAreaElement, F1TextareaProps>(
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
              <Textarea {...field} {...props} ref={ref} />
            </FormControl>
            {note && <FormDescription>{note}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

F1Textarea.displayName = "F1Textarea"

// Create a type that includes the Form property
type F1TextareaComponent = typeof F1Textarea & {
  Form: typeof FormField
}

// Attach FormField to F1Textarea for direct access
const F1TextareaWithForm = F1Textarea as F1TextareaComponent
F1TextareaWithForm.Form = FormField

export { F1TextareaWithForm as F1Textarea }