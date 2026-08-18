import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "../common/UI";

const faqs = [
  {
    question: "Is PrepFriend free to use?",
    answer:
      "Yes. PrepFriend provides free AI-powered conversation practice. Additional premium features may be added in the future.",
  },
  {
    question: "Can I prepare for job interviews?",
    answer:
      "Absolutely. The AI Interviewer mode helps you practice HR and technical interviews with realistic questions and feedback.",
  },
  {
    question: "Does PrepFriend provide feedback?",
    answer:
      "Yes. PrepFriend analyzes your responses and provides suggestions to improve communication, grammar, vocabulary, and confidence.",
  },
  {
    question: "Can I use PrepFriend on mobile devices?",
    answer:
      "Yes. PrepFriend is fully responsive and works on desktops, tablets, and smartphones.",
  },
  {
    question: "Does PrepFriend track my progress?",
    answer:
      "Yes. You can view session history, performance reports, activity tracking, streaks, and learning trends.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          FAQ
        </span>

        <h2 className="mt-5 text-3xl font-black md:text-5xl">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
          Everything you need to know about PrepFriend AI Friend.
        </p>
      </div>

      <div className="mt-16 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <Card key={faq.question} className="overflow-hidden p-0">
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? -1 : index)
                }
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-semibold">
                  {faq.question}
                </span>

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "max-h-40 px-5 pb-5"
                    : "max-h-0"
                }`}
              >
                <p className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}