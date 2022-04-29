export default function Header() {
  return (
    <header className="text-gray-600 body-font bg-gray-600">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.coronasafe.network/light-logo.svg"
            alt="Logo"
            className="w-24 h-14 mr-5"
          />
        </a>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a className="mr-5 hover:text-gray-900">First Link</a>
          <a className="mr-5 hover:text-gray-900">Second Link</a>
          <a className="mr-5 hover:text-gray-900">Third Link</a>
          <a className="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        <a
          href="care.mn.gov.in"
          className="inline-flex items-center bg-green-600 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base text-white mt-4 md:mt-0"
          rel="noopener noreferrer"
          target="_blank"
        >
          Care
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </header>
  );
}
