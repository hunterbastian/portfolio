export default function Footer() {
  return (
    <footer 
      className="border-t relative"
      style={{
        zIndex: 20,
        backgroundColor: 'rgba(229, 233, 240, 0.8)'
      }}
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <span className="font-code" style={{ fontSize: '11px', color: '#4C566A', fontWeight: '500' }}>@ 2025</span>
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-code" style={{ fontSize: '11px', color: '#4C566A', fontWeight: '500' }}>
            CRAFTED BY HUNTER BASTIAN
          </p>
        </div>
      </div>
    </footer>
  )
}
