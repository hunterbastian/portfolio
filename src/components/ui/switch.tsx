"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "showcase-theme-switch group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span data-slot="switch-glass" data-glass="light" aria-hidden="true" />
      <span data-slot="switch-glass" data-glass="dark" aria-hidden="true" />
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
