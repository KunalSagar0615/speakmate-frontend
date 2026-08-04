// import {
//   Brain,
//   ChartLine,
//   MessageSquareText,
//   PlayCircle,
// } from "lucide-react";
// import { Card } from "../common/UI";

// const steps = [
//   {
//     icon: Brain,
//     title: "Choose Your Mode",
//     description:
//       "Select AI Friend, AI Interviewer, or AI English Coach based on your learning goals.",
//   },
//   {
//     icon: PlayCircle,
//     title: "Start Practicing",
//     description:
//       "Speak naturally with AI using realistic conversations, interview questions, and guided discussions.",
//   },
//   {
//     icon: MessageSquareText,
//     title: "Receive Feedback",
//     description:
//       "Get instant feedback on grammar, vocabulary, confidence, fluency, and communication skills.",
//   },
//   {
//     icon: ChartLine,
//     title: "Track Progress",
//     description:
//       "Monitor your growth through reports, activity tracking, streaks, and performance analytics.",
//   },
// ];

// export default function HowItWorks() {
//   return (
//     <section className="mx-auto max-w-7xl px-6 py-24">
//       <div className="text-center">
//         <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
//           HOW IT WORKS
//         </span>

//         <h2 className="mt-5 text-3xl font-black md:text-5xl">
//           Improve Your English In 4 Simple Steps
//         </h2>

//         <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
//           SpeakMate makes English practice simple, interactive, and effective.
//           Start a conversation, receive feedback, and watch your confidence grow.
//         </p>
//       </div>

//       <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {steps.map((step, index) => {
//           const Icon = step.icon;

//           return (
//             <Card
//               key={step.title}
//               className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
//             >
//               <div className="absolute right-4 top-4 text-6xl font-black text-slate-100 dark:text-slate-800">
//                 0{index + 1}
//               </div>

//               <div className="relative">
//                 <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary transition-all duration-300 group-hover:scale-110">
//                   <Icon size={28} />
//                 </div>

//                 <h3 className="mb-3 text-xl font-bold">
//                   {step.title}
//                 </h3>

//                 <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
//                   {step.description}
//                 </p>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Flow Line */}
//       <div className="mt-12 hidden lg:flex items-center justify-center gap-4 text-primary">
//         <span className="font-semibold">Choose Mode</span>
//         <span>→</span>
//         <span className="font-semibold">Practice</span>
//         <span>→</span>
//         <span className="font-semibold">Feedback</span>
//         <span>→</span>
//         <span className="font-semibold">Progress</span>
//       </div>
//     </section>
//   );
// }



"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain,
  ChartLine,
  MessageSquareText,
  PlayCircle,
} from "lucide-react";
import React, { useRef } from "react";
import { Card } from "../common/UI";

const steps = [
  {
    icon: Brain,
    title: "Choose Your Mode",
    description:
      "Select AI Friend, AI Interviewer, or AI English Coach based on your learning goals.",
  },
  {
    icon: PlayCircle,
    title: "Start Practicing",
    description:
      "Speak naturally with AI using realistic conversations, interview questions, and guided discussions.",
  },
  {
    icon: MessageSquareText,
    title: "Receive Feedback",
    description:
      "Get instant feedback on grammar, vocabulary, confidence, fluency, and communication skills.",
  },
  {
    icon: ChartLine,
    title: "Track Progress",
    description:
      "Monitor your growth through reports, activity tracking, streaks, and performance analytics.",
  },
];

// Same idea as Skiper's CharacterV1: each character/word is offset by its
// distance from the center of the string, then converges to x:0, rotateX:0
// as scrollYProgress moves from 0 -> 1.
const AnimatedChar = ({ char, index, centerIndex, scrollYProgress }) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 50, 0],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 50, 0],
  );

  return (
    <motion.span
      className={isSpace ? "inline-block w-2" : "inline-block"}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

// Paragraph text wraps across lines, so it's split by word (not character)
// with a real space kept between spans, otherwise inline-block characters
// never get a line-break opportunity and the text overflows on mobile.
const AnimatedWord = ({ word, index, centerIndex, scrollYProgress }) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 20, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [Math.abs(distanceFromCenter) * 8, 0],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <motion.span className="inline-block" style={{ x, y, opacity }}>
      {word}
    </motion.span>
  );
};

export default function HowItWorks() {
  const textRef = useRef(null);

  // No tall spacer sections needed: progress runs 0 -> 1 as the text block
  // travels from the bottom of the viewport up to ~40% from the top.
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start end", "start 0.4"],
  });

  const heading = "Improve Your English In 4 Simple Steps";
  const headingChars = heading.split("");
  const headingCenterIndex = Math.floor(headingChars.length / 2);

  const subtext =
    "SpeakMate makes English practice simple, interactive, and effective. Start a conversation, receive feedback, and watch your confidence grow.";
  const subtextWords = subtext.split(" ");
  const subtextCenterIndex = Math.floor(subtextWords.length / 2);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div ref={textRef} className="text-center">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          HOW IT WORKS
        </span>

        <h2
          className="mt-5 text-3xl font-black md:text-5xl"
          style={{ perspective: 500 }}
        >
          {headingChars.map((char, index) => (
            <AnimatedChar
              key={index}
              char={char}
              index={index}
              centerIndex={headingCenterIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
          {subtextWords.map((word, index) => (
            <React.Fragment key={index}>
              <AnimatedWord
                word={word}
                index={index}
                centerIndex={subtextCenterIndex}
                scrollYProgress={scrollYProgress}
              />
              {index < subtextWords.length - 1 && " "}
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card
              key={step.title}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="absolute right-4 top-4 text-6xl font-black text-slate-100 dark:text-slate-800">
                0{index + 1}
              </div>

              <div className="relative">
                <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary transition-all duration-300 group-hover:scale-110">
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>

                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Flow Line */}
      <div className="mt-12 hidden lg:flex items-center justify-center gap-4 text-primary">
        <span className="font-semibold">Choose Mode</span>
        <span>→</span>
        <span className="font-semibold">Practice</span>
        <span>→</span>
        <span className="font-semibold">Feedback</span>
        <span>→</span>
        <span className="font-semibold">Progress</span>
      </div>
    </section>
  );
}