export function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-700">Farmer's Portal</h1>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                Mandi Prices
              </a>
              <a
                href="#"
                className="text-gray-500 hover:bg-green-100 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Weather
              </a>
              <a
                href="#"
                className="text-gray-500 hover:bg-green-100 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                News
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
