// import * as React from "react"
// import * as SelectPrimitive from "@radix-ui/react-select"
// import { Check, ChevronDown, ChevronUp } from "lucide-react"

// import { cn } from "@/lib/utils"

// const Select = SelectPrimitive.Root

// const SelectGroup = SelectPrimitive.Group

// const SelectValue = SelectPrimitive.Value

// const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
//   <SelectPrimitive.Trigger
//     ref={ref}
//     className={cn(
//       "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none   focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-slate-800 dark:bg-[#1f1f1f] dark:text-white dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-red-300",
//       className
//     )}
//     {...props}>
//     {children}
//     <SelectPrimitive.Icon asChild>
//       <ChevronDown className="h-4 w-4 opacity-50" />
//     </SelectPrimitive.Icon>
//   </SelectPrimitive.Trigger>
// ))
// SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
//   <SelectPrimitive.ScrollUpButton
//     ref={ref}
//     className={cn("flex cursor-default items-center justify-center py-1", className)}
//     {...props}>
//     <ChevronUp className="h-4 w-4" />
//   </SelectPrimitive.ScrollUpButton>
// ))
// SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
//   <SelectPrimitive.ScrollDownButton
//     ref={ref}
//     className={cn("flex cursor-default items-center justify-center py-1", className)}
//     {...props}>
//     <ChevronDown className="h-4 w-4" />
//   </SelectPrimitive.ScrollDownButton>
// ))
// SelectScrollDownButton.displayName =
//   SelectPrimitive.ScrollDownButton.displayName

// const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
//   <SelectPrimitive.Portal>
//     <SelectPrimitive.Content
//       ref={ref}
//       className={cn(
//         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
//         position === "popper" &&
//           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
//         className
//       )}
//       position={position}
//       {...props}>
//       <SelectScrollUpButton />
//       <SelectPrimitive.Viewport
//         className={cn("p-1", position === "popper" &&
//           "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
//         {children}
//       </SelectPrimitive.Viewport>
//       <SelectScrollDownButton />
//     </SelectPrimitive.Content>
//   </SelectPrimitive.Portal>
// ))
// SelectContent.displayName = SelectPrimitive.Content.displayName

// const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
//   <SelectPrimitive.Label
//     ref={ref}
//     className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
//     {...props} />
// ))
// SelectLabel.displayName = SelectPrimitive.Label.displayName

// const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
//   <SelectPrimitive.Item
//     ref={ref}
//     className={cn(
//       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
//       className
//     )}
//     {...props}>
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <SelectPrimitive.ItemIndicator>
//         <Check className="h-4 w-4" />
//       </SelectPrimitive.ItemIndicator>
//     </span>

//     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
//   </SelectPrimitive.Item>
// ))
// SelectItem.displayName = SelectPrimitive.Item.displayName

// const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
//   <SelectPrimitive.Separator
//     ref={ref}
//     className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
//     {...props} />
// ))
// SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// export {
//   Select,
//   SelectGroup,
//   SelectValue,
//   SelectTrigger,
//   SelectContent,
//   SelectLabel,
//   SelectItem,
//   SelectSeparator,
//   SelectScrollUpButton,
//   SelectScrollDownButton,
// }



import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

// Trigger
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        `flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm 
        ring-offset-white placeholder:text-slate-500 focus:outline-none 
        disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1
        ${
          theme === "light"
            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            : "bg-white border-gray-200 text-gray-800 placeholder:text-gray-500"
        }`,
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// Scroll Up
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// Scroll Down
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

// Content
const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            `relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md
            ${
              theme === "light"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`,
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.Viewport
            className={cn(
              "p-1",
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
          >
            {children}
          </SelectPrimitive.Viewport>

          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  }
)
SelectContent.displayName = SelectPrimitive.Content.displayName

// Label
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        `py-1.5 pl-8 pr-2 text-sm font-semibold ${
          theme === "light" ? "text-gray-300" : "text-gray-700"
        }`,
        className
      )}
      {...props}
    />
  )
})
SelectLabel.displayName = SelectPrimitive.Label.displayName

// Item
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
        ${
          theme === "light"
            ? "focus:bg-gray-700 focus:text-white"
            : "focus:bg-gray-100 focus:text-gray-900"
        }
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

// Separator
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn(
        `-mx-1 my-1 h-px ${
          theme === "light" ? "bg-gray-700" : "bg-gray-200"
        }`,
        className
      )}
      {...props}
    />
  )
})
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}