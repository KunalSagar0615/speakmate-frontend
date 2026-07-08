import { Mail, Phone } from "lucide-react";
import { Card } from "./UI";

export const ContactSupport = () => (
  <Card className="border-sky-200 bg-sky-50/50 dark:border-sky-900 dark:bg-sky-950/20">
    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
      Need help or have suggestions?
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Our support team is here to help you get the most out of SpeakMate.
    </p>
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
      <a
        href="tel:7249176496"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Phone size={16} />
        7249176496
      </a>
      <a
        href="mailto:kunalsagar3041@gmail.com"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Mail size={16} />
        kunalsagar3041@gmail.com
      </a>
    </div>
  </Card>
);
