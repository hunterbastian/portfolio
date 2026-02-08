export default function Footer() {
  return (
    <footer 
      className="border-t relative"
      style={{
        zIndex: 20,
        backgroundColor: 'rgba(21, 18, 16, 0.94)',
        borderColor: 'rgba(200, 169, 107, 0.35)'
      }}
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <span className="font-code" style={{ fontSize: '11px', color: '#C9B69A', fontWeight: '500', letterSpacing: '0.08em' }}>@ 2025</span>
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-code" style={{ fontSize: '11px', color: '#C9B69A', fontWeight: '500', letterSpacing: '0.08em' }}>
            CRAFTED BY HUNTER BASTIAN
          </p>
        </div>
      </div>
    </footer>
  )
}
