export interface ArcGlossUploadButtonClassInput {
  buttonClass: string
  className?: string
  containerClassName?: string
  fillViewport: boolean
  fullViewportClass: string
  stageClass: string
}

function joinClassNames(classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ')
}

export function getArcGlossUploadButtonClassNames({
  buttonClass,
  className,
  containerClassName,
  fillViewport,
  fullViewportClass,
  stageClass,
}: ArcGlossUploadButtonClassInput) {
  return {
    buttonClassName: joinClassNames([buttonClass, className]),
    stageClassName: joinClassNames([
      stageClass,
      fillViewport ? fullViewportClass : undefined,
      containerClassName,
    ]),
  }
}
