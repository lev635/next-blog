export default function Navigation() {
  return (
    <nav className="flex justify-between align-baseline border-b-2 p-2">
      <a className="text-3xl font-bold text-[#333333] no-underline hover:no-underline hover:text-blue-600 transition-colors" href="/">ゆかり</a>
      <div className="flex gap-4">
        <a className="text-[#333333] no-underline hover:no-underline hover:text-blue-600 transition-colors" href="/article">記事一覧</a>
        <a className="text-[#333333] no-underline hover:no-underline hover:text-blue-600 transition-colors" href="/readme">README</a>
      </div>
    </nav>
  )
}
