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
        "showcase-theme-switch group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-solid p-px outline-none transition-[background-color,border-color] duration-[280ms] ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "border-[var(--showcase-line)] bg-transparent focus-visible:outline-[var(--showcase-ink)] data-checked:border-[var(--showcase-ink)] data-checked:bg-[var(--showcase-ink)]",
        "data-[size=default]:h-[18px] data-[size=default]:w-8 data-[size=sm]:h-[14px] data-[size=sm]:w-[26px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-[var(--showcase-ink)] transition-[transform,background-color] duration-[280ms] ease-out motion-reduce:transition-none group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 group-data-[size=default]/switch:data-checked:translate-x-3.5 group-data-[size=sm]/switch:data-checked:translate-x-3 data-unchecked:translate-x-0 data-checked:bg-[var(--showcase-bg)]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
