import HeroCanvasWrapper from '@/components/HeroCanvasWrapper'
import Link from 'next/link'

export default function TestCanvasPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">HeroCanvas Test Page</h1>
          <p className="text-muted-foreground">
            Testing the dynamically loaded Three.js canvas with placeholder
          </p>
        </div>

        {/* Large Canvas Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Large Canvas (500x400)</h2>
          <div className="border border-border rounded-lg p-4 bg-card">
            <HeroCanvasWrapper 
              width={500} 
              height={400}
              className="mx-auto border rounded-lg"
            />
          </div>
        </div>

        {/* Small Canvas Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Small Canvas (320x320)</h2>
          <div className="border border-border rounded-lg p-4 bg-card">
            <HeroCanvasWrapper 
              width={320} 
              height={320}
              className="mx-auto border rounded-lg"
            />
          </div>
        </div>

        {/* Side by Side Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Multiple Instances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-4">Canvas 1</h3>
              <HeroCanvasWrapper 
                width={300} 
                height={250}
                className="mx-auto border rounded-lg"
              />
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-4">Canvas 2</h3>
              <HeroCanvasWrapper 
                width={300} 
                height={250}
                className="mx-auto border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Features Demonstrated:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>✅ Dynamic import with <code>next/dynamic</code> and <code>ssr: false</code></li>
            <li>✅ Canvas with <code>frameloop=&quot;demand&quot;</code> and <code>dpr={`[1, 1.75]`}</code></li>
            <li>✅ Lightweight placeholder while loading</li>
            <li>✅ Proper resource disposal on unmount</li>
            <li>✅ Multiple instances without conflicts</li>
            <li>✅ Responsive and customizable sizing</li>
          </ul>
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
