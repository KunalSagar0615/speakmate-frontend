import { ExternalLink, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "../../components/landing/LandingFooter";
import { TypingAnimation } from "../../components/common/TypingAnimation";
import { Button, Card, ThemeToggle } from "../../components/common/UI";
import { FOUNDER_PROFILE_IMAGE } from "../../utils/constants";

const FOUNDER_PHRASES = [
  "Founder of SpeakMate AI Friend",
  "Java Full Stack Developer",
  "MCA Student",
  "AI Enthusiast",
];

const PageShell = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between p-6">
      <Link to="/" className="text-2xl font-black text-primary">
        SpeakMate
      </Link>
      <ThemeToggle />
    </header>
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-12">{children}</main>
    <LandingFooter />
  </div>
);

export const ContactPage = () => (
  <PageShell>
    <Card className="mx-auto max-w-2xl text-center">
      <img
        src={FOUNDER_PROFILE_IMAGE}
        alt="Kunal Ananda Sagar"
        className="mx-auto h-28 w-28 rounded-full border-4 border-primary/20 object-cover shadow-md"
      />
      <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Kunal Ananda Sagar</h1>
      <p className="mt-2 min-h-[1.5em] text-sm text-primary">
        <TypingAnimation phrases={FOUNDER_PHRASES} className="text-primary" />
      </p>

      <div className="mt-8 space-y-4 text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
          <a
            href="tel:7249176496"
            className="mt-1 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Phone size={16} />
            7249176496
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
          <a
            href="mailto:kunalsagar3041@gmail.com"
            className="mt-1 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail size={16} />
            kunalsagar3041@gmail.com
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Portfolio</p>
          <a
            href="https://kunalsagar.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 text-primary hover:underline"
          >
            https://kunalsagar.netlify.app/
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <p className="mt-8 rounded-xl bg-sky-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-sky-950/30 dark:text-slate-300">
        If you are facing any bugs, have suggestions, or want updates regarding SpeakMate, feel free
        to contact us.
      </p>

      <Link to="/" className="mt-8 inline-block">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Card>
  </PageShell>
);

export const PrivacyPolicyPage = () => (
  <PageShell>
    <Card className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        At SpeakMate AI Friend, we respect your privacy.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Information We Collect
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
          <li>Account Information</li>
          <li>Practice Data</li>
          <li>Session Analytics</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          How We Use Information
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
          <li>Improve AI responses</li>
          <li>Generate progress reports</li>
          <li>Enhance user experience</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Data Security</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          We use secure authentication and protected storage.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">User Rights</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Users can request profile updates and account removal.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Contact</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          For privacy-related questions, visit our{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          .
        </p>
      </section>

      <Link to="/" className="mt-8 inline-block">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Card>
  </PageShell>
);

export const TermsServicesPage = () => (
  <PageShell>
    <Card className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms & Services</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        By using SpeakMate AI Friend you agree to:
      </p>

      <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
        <li>Use platform responsibly</li>
        <li>Do not abuse AI services</li>
        <li>Do not attempt unauthorized access</li>
        <li>Respect community guidelines</li>
      </ul>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Service Availability
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          AI features may depend on third-party AI providers.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Limitation</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          SpeakMate provides educational assistance only.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Contact</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          For support or inquiries, visit our{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          .
        </p>
      </section>

      <Link to="/" className="mt-8 inline-block">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Card>
  </PageShell>
);
