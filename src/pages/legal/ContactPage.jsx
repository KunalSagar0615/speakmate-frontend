import {
    ExternalLink,
    Mail,
    Phone,
    Globe,
    User,
    ArrowLeft,
    MessageCircle,
} from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <Link
                to="/"
                className="text-3xl font-black tracking-tight text-primary transition hover:scale-105"
            >
                SpeakMate
            </Link>

            <ThemeToggle />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
            {children}
        </main>

        <LandingFooter />
    </div>
);

export const ContactPage = () => (
    <PageShell>
        <Card className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">

            {/* Hero */}
            <div className="text-center">

                <div className="relative mx-auto w-fit">

                    <img
                        src={FOUNDER_PROFILE_IMAGE}
                        alt="Kunal Ananda Sagar"
                        className="h-40 w-40 rounded-full border-4 border-primary object-cover shadow-2xl transition duration-300 hover:scale-105"
                    />

                    <span className="absolute bottom-3 right-3 h-6 w-6 rounded-full border-4 border-white bg-green-500 dark:border-slate-900"></span>

                </div>

                <h1 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
                    Kunal Ananda Sagar
                </h1>

                <div className="mt-3 flex justify-center">
                    <div className="rounded-full bg-primary/10 px-5 py-2">
                        <TypingAnimation
                            phrases={FOUNDER_PHRASES}
                            className="font-medium text-primary"
                        />
                    </div>
                </div>

                <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                    Thank you for using <strong>PrepFriend</strong>.
                    If you've found a bug, have a feature request,
                    or simply want to connect, I'd love to hear from you.
                    Your feedback helps make PrepFriend better for everyone.
                </p>
            </div>

            {/* Contact Cards */}

            <div className="mt-12 grid gap-6 md:grid-cols-3">

                <a
                    href="tel:7249176496"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Phone size={24} />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Phone
                    </p>

                    <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                        +91 72491 76496
                    </p>
                </a>

                <a
                    href="mailto:kunalsagar3041@gmail.com"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail size={24} />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Email
                    </p>

                    <p className="mt-2 whitespace-nowrap text-base font-bold text-slate-900 dark:text-white">
                        kunalsagar3041@gmail.com
                    </p>
                </a>

                <a
                    href="https://kunalsagar.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Globe size={24} />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Portfolio
                    </p>

                    <div className="mt-2 flex items-center gap-2 font-bold text-primary">
                        Visit Website
                        <ExternalLink size={18} />
                    </div>
                </a>

            </div>
            {/* Need Help Section */}

            <div className="mt-12 rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 to-indigo-50 p-8 dark:border-sky-900 dark:from-sky-950/30 dark:to-slate-900">

                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MessageCircle size={30} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Need Help?
                        </h2>

                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Whether you've found a bug, have an idea, or need assistance,
                            feel free to get in touch anytime.
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
                        <User className="mb-3 text-primary" size={26} />

                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Feature Requests
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Have an idea that could improve PrepFriend?
                            We'd love to hear your suggestions for future updates.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
                        <Mail className="mb-3 text-primary" size={26} />

                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Report Bugs
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            If something isn't working correctly, send us the details so
                            we can investigate and improve the experience.
                        </p>
                    </div>

                </div>
            </div>

            {/* About SpeakMate */}

            <div className="mt-12 rounded-3xl bg-primary p-8 text-white shadow-xl">

                <h2 className="text-3xl font-bold">
                    About PrepFriend
                </h2>

                <p className="mt-5 leading-8 text-primary-foreground/90">
                    PrepFriend is an AI-powered English speaking practice
                    platform built to help learners improve their communication
                    skills through realistic conversations, instant AI feedback,
                    personalized practice sessions, and detailed performance reports.
                </p>

                <p className="mt-4 leading-8 text-primary-foreground/90">
                    Our mission is to make English speaking practice accessible,
                    engaging, and confidence-building for everyone.
                </p>

            </div>

            {/* Buttons */}

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">

                <Link to="/">
                    <Button className="w-full sm:w-auto">
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Home
                    </Button>
                </Link>

            </div>

        </Card>
    </PageShell>
);