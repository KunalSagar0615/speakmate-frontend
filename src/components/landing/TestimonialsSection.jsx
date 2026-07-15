import { Card } from "../common/UI";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Developer",
    review:
      "SpeakMate helped me improve my interview confidence significantly. The AI interviewer feels surprisingly realistic.",
  },
  {
    name: "Priya Patel",
    role: "College Student",
    review:
      "I use SpeakMate daily to practice English conversations. My fluency and confidence have improved a lot.",
  },
  {
    name: "Amit Verma",
    role: "Job Seeker",
    review:
      "The instant feedback and progress reports helped me identify weaknesses and improve consistently.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          TESTIMONIALS
        </span>

        <h2 className="mt-5 text-3xl font-black md:text-5xl">
          What Learners Say About SpeakMate
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
          Thousands of practice sessions help users build confidence,
          improve communication skills, and prepare for real-world conversations.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <Card
            key={item.name}
            className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="mb-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="leading-7 text-slate-600 dark:text-slate-300">
              "{item.review}"
            </p>

            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-slate-500">
                {item.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}