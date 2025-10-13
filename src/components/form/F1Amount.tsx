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

interface F1AmountProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  note?: string
  star?: boolean
  className?: string
}

const F1Amount = React.forwardRef<HTMLInputElement, F1AmountProps>(
  (props, ref) => {
    const { name, label, note, star, className, ...inputProps } = props;
    
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
              <Input 
                {...field} 
                {...inputProps} 
                ref={ref}
                type="number"
                step="0.01"
                min="0"
              />
            </FormControl>
            {note && <FormDescription>{note}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

F1Amount.displayName = "F1Amount"

// Create a type that includes the Form property
type F1AmountComponent = typeof F1Amount & {
  Form: typeof FormField
}

// Attach FormField to F1Amount for direct access
const F1AmountWithForm = F1Amount as F1AmountComponent
F1AmountWithForm.Form = FormField

export { F1AmountWithForm as F1Amount }