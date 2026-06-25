import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/logo-full-main-no-slogan-no-background.png"
            alt="KYN — platform_market"
            className="h-9 w-auto"
          />
        </Link>
        <Link
          to="/"
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-kyn-accent hover:opacity-90 transition"
        >
          Home
        </Link>
      </div>
    </header>
  );
}
