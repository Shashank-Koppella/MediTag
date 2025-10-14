"use client"

export default function SplashScreen() {
  return (
    <div className="relative min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center overflow-hidden">
      {/* Center content - bigger symbol and wordmark */}
      <img src="/images/logo-symbol.png" alt="MediTag symbol" className="w-28 h-28 mb-6" />
      <div
        className="text-4xl font-bold tracking-wide"
        style={{ fontFamily: '"DM Sans", Inter, Arial, sans-serif' }}
        aria-label="MediTag"
      >
        <span className="text-black">Medi</span>
        <span className="text-[#53A64A]">Tag</span>
      </div>

      {/* Low green gradient at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-36"
        style={{
          background:
            "linear-gradient(180deg, rgba(83,166,74,0) 0%, rgba(83,166,74,0.08) 35%, rgba(83,166,74,0.14) 65%, rgba(83,166,74,0.18) 100%)",
        }}
      />
    </div>
  )
}
