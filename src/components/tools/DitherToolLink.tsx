import Link from 'next/link'
import { Grid2X2 } from 'lucide-react'
import styles from './DitherToolLink.module.css'

export default function DitherToolLink() {
  return (
    <Link href="/tools/dither" className={styles.link}>
      <Grid2X2 size={24} strokeWidth={1.25} aria-hidden="true" />
      <span><strong>Dither Studio</strong><span>Turn a photo into a two-tone pixel print.</span></span>
      <span className={styles.tag}>Try the tool</span>
    </Link>
  )
}
