import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white/90 py-8 dark:border-slate-800 dark:bg-slate-950/90">
    <div className="mx-auto max-w-7xl px-6 text-center">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        © 2026 SpeakMate AI Friend
      </p>
      <p className="mt-1 text-sm text-slate-500">Built by Kunal Ananda Sagar</p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
        <Link to="/privacy-policy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <Link to="/terms-services" className="text-primary hover:underline">
          Terms & Services
        </Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <Link to="/contact" className="text-primary hover:underline">
          Contact
        </Link>
      </nav>
    </div>
  </footer>
);
