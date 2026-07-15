import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-16 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black text-primary">
              SpeakMate
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              AI-powered English speaking practice platform designed to help
              learners improve communication skills, prepare for interviews,
              and build confidence through realistic conversations.
            </p>

            <p className="mt-6 text-sm text-slate-500">
              © 2026 SpeakMate AI Friend
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-bold">
              Product
            </h4>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>AI Friend</li>
              <li>AI Interviewer</li>
              <li>AI English Coach</li>
              <li>Reports & Analytics</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-bold">
              Resources
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Support
                </Link>
              </li>

              <li>
                <a
                  href="#faq"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-bold">
              Legal
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-services"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Terms & Services
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800">
          Practice. Improve. Succeed.
        </div>
      </div>
    </footer>
  );
}