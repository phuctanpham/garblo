interface Props {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[480px] px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl font-serif tracking-[0.3em] text-white mb-8">GARBLO</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onLogin()
            }}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-4 bg-white/80 rounded-xl outline-none focus:bg-white transition-all text-sm placeholder:text-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-4 bg-white/80 rounded-xl outline-none focus:bg-white transition-all text-sm placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all mt-4 shadow-lg shadow-emerald-900/20"
            >
              Enter Studio
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
