import {
  CentralIcon as RawCentralIcon,
  type CentralIconProps as RawCentralIconProps,
} from "@central-icons-react/all";
import {
  centralIconsMetadata,
  type CentralIconCategory,
  type CentralIconFill,
  type CentralIconJoin,
  type CentralIconName,
  type CentralIconRadius,
  type CentralIconStroke,
} from "@central-icons-react/all/icons";
import type { FC } from "react";

type CentralIconStyleKey = "join" | "fill" | "radius" | "stroke";
export type CentralIconStyle = Pick<RawCentralIconProps, CentralIconStyleKey>;

export const CENTRAL_ICON_DEFAULTS = {
  join: "round",
  fill: "filled",
  radius: "1",
  stroke: "1",
} as const satisfies CentralIconStyle;

export type CentralIconProps = Omit<RawCentralIconProps, CentralIconStyleKey> &
  Partial<CentralIconStyle>;

export const CentralIcon: FC<CentralIconProps> = ({
  join = CENTRAL_ICON_DEFAULTS.join,
  fill = CENTRAL_ICON_DEFAULTS.fill,
  radius = CENTRAL_ICON_DEFAULTS.radius,
  stroke = CENTRAL_ICON_DEFAULTS.stroke,
  ...props
}) => (
  <RawCentralIcon
    join={join}
    fill={fill}
    radius={radius}
    stroke={stroke}
    {...props}
  />
);

CentralIcon.displayName = "CentralIcon";

export { RawCentralIcon };
export type {
  CentralIconCategory,
  CentralIconFill,
  CentralIconJoin,
  CentralIconName,
  CentralIconRadius,
  CentralIconStroke,
};

export const centralIconMetadata = centralIconsMetadata;

export const centralIconNames = Object.keys(centralIconsMetadata).sort() as CentralIconName[];

const namesByCategory: Partial<Record<CentralIconCategory, CentralIconName[]>> =
  {};

for (const name of centralIconNames) {
  const category = centralIconsMetadata[name].category;
  if (!namesByCategory[category]) {
    namesByCategory[category] = [];
  }
  namesByCategory[category].push(name);
}

for (const category of Object.keys(namesByCategory) as CentralIconCategory[]) {
  namesByCategory[category]?.sort();
}

export const centralIconCategories = Object.keys(namesByCategory).sort() as CentralIconCategory[];

export const centralIconNamesByCategory =
  namesByCategory as Record<CentralIconCategory, CentralIconName[]>;

export function getCentralIconsByCategory(
  category: CentralIconCategory,
): CentralIconName[] {
  return centralIconNamesByCategory[category] ?? [];
}

export function withCentralIconDefaults(
  style: Partial<CentralIconStyle> = {},
): CentralIconStyle {
  return {
    ...CENTRAL_ICON_DEFAULTS,
    ...style,
  };
}
