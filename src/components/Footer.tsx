export default function Footer() {
  return (
    <footer 
      className="border-t relative"
      style={{
        zIndex: 20,
        backgroundColor: 'rgba(222, 220, 219, 0.7)'
      }}
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center leading-loose md:text-left" style={{ fontSize: '11px', color: '#2D3748', fontWeight: '500' }}>
            © 2025
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <p style={{ fontSize: '11px', color: '#2D3748', fontWeight: '500' }}>
            CRAFTED BY HUNTER BASTIAN
          </p>
        </div>
      </div>
    </footer>
  )
}
