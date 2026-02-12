'use client'

import { DialRoot } from 'dialkit'

export default function DialKitRoot() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DialRoot position="bottom-right" />
}
