export function getProjectCardImageZoomStyle(imageZoom?: number): { transform: string } | undefined {
  return imageZoom ? { transform: `scale(${imageZoom})` } : undefined
}
