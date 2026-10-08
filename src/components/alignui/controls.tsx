'use client'

// Adapted from AlignUI's MIT-licensed Slider, Select and Switch.
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as SelectPrimitive from '@radix-ui/react-select'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { Check, ChevronDown } from 'lucide-react'
import styles from './controls.module.css'

type SliderProps = { id: string; label: string; value: number; min: number; max: number; unit?: string; onValueChange: (value: number) => void }
export function Slider({ id, label, value, min, max, unit = '', onValueChange }: SliderProps) {
  return <div className={styles.sliderField}>
    <div className={styles.sliderLabel}><label id={`${id}-label`} htmlFor={id}>{label}</label><output htmlFor={id}>{value}{unit}</output></div>
    <SliderPrimitive.Root className={styles.slider} min={min} max={max} step={1} value={[value]} onValueChange={values => onValueChange(values[0])}>
      <SliderPrimitive.Track className={styles.track}><SliderPrimitive.Range className={styles.range} /></SliderPrimitive.Track>
      <SliderPrimitive.Thumb id={id} aria-labelledby={`${id}-label`} aria-valuetext={`${value}${unit}`} className={styles.thumb} />
    </SliderPrimitive.Root>
  </div>
}

export function Select({ id, value, onValueChange, options }: { id: string; value: string; onValueChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
    <SelectPrimitive.Trigger id={id} className={styles.select}><SelectPrimitive.Value /><SelectPrimitive.Icon><ChevronDown size={16} aria-hidden="true" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={styles.options} position="popper" sideOffset={6} collisionPadding={12}>
        <SelectPrimitive.Viewport>
          {options.map(option => <SelectPrimitive.Item key={option.value} value={option.value} className={styles.option}>
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator><Check size={15} aria-hidden="true" /></SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>)}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
}

export function Switch({ id, checked, onCheckedChange }: { id: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return <SwitchPrimitive.Root id={id} checked={checked} onCheckedChange={onCheckedChange} className={styles.switch}>
    <span className={styles.switchTrack}><SwitchPrimitive.Thumb className={styles.switchThumb} /></span>
  </SwitchPrimitive.Root>
}
