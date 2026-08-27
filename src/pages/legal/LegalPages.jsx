import { ExternalLink, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "../../components/landing/LandingFooter";
import { TypingAnimation } from "../../components/common/TypingAnimation";
import { Button, Card, ThemeToggle } from "../../components/common/UI";
import { FOUNDER_PROFILE_IMAGE } from "../../utils/constants";

const FOUNDER_PHRASES = [
  "Founder of PrepFriend AI Friend",
  "Java Full Stack Developer",
  "AI Enthusiast",
];

const PageShell = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between p-6">
      <Link to="/" className="text-2xl font-black text-primary">
        PrepFriend
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
        If you are facing any bugs, have suggestions, or want updates regarding PrepFriend, feel free
        to contact us.
      </p>

      <Link to="/" className="mt-8 inline-block">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </Card>
  </PageShell>
);

export const PrivacyPolicyPage = () => ( <PageShell> <Card className="prose prose-slate dark:prose-invert max-w-none"> <h1 className="text-3xl font-bold text-slate-900 dark:text-white"> Privacy Policy </h1> <p className="mt-2 text-sm text-slate-500 dark:text-slate-400"> Last Updated: August 27, 2026 </p> <p className="mt-4 text-slate-600 dark:text-slate-300"> Welcome to PrepFriend. PrepFriend is an independently developed educational project created for study, learning, interview preparation, and practice purposes. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> This Privacy Policy explains what information may be collected when you use PrepFriend, how that information may be used, and the steps taken to protect it. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> By using PrepFriend, you acknowledge that you have read and understood this Privacy Policy. </p> {/* 1. ABOUT PREPFRIEND */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 1. About PrepFriend </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend is a personal educational project designed to help users practice interview questions, improve their knowledge, track practice progress, and use learning-related features. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> If you have any privacy-related questions or concerns, you can contact us through our{" "} <Link to="/contact" className="text-primary hover:underline" > Contact page </Link> . </p> </section> {/* 2. INFORMATION WE COLLECT */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 2. Information We Collect </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Depending on how you use PrepFriend, the application may collect or process the following types of information. </p> {/* 2.1 ACCOUNT */} <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100"> 2.1 Account Information </h3> <p className="mt-3 text-slate-600 dark:text-slate-300"> If you create an account, we may collect information such as: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Name or display name</li> <li>Email address</li> <li>Authentication information</li> <li>Country</li> <li>City, if provided</li> <li>Pincode or postal code, if provided</li> <li>Profile preferences</li> </ul> <p className="mt-3 text-slate-600 dark:text-slate-300"> Passwords should not be stored in plain text and are intended to be protected using appropriate security mechanisms. </p> {/* 2.2 PRACTICE */} <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100"> 2.2 Practice and Learning Data </h3> <p className="mt-3 text-slate-600 dark:text-slate-300"> When you use practice or interview-related features, PrepFriend may process information such as: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Practice questions</li> <li>Answers submitted by you</li> <li>Interview responses</li> <li>Topics selected for practice</li> <li>Practice history</li> <li>Scores and results</li> <li>Progress information</li> <li>Feedback and evaluations</li> </ul> {/* 2.3 AI */} <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100"> 2.3 AI-Related Information </h3> <p className="mt-3 text-slate-600 dark:text-slate-300"> Some PrepFriend features may use artificial intelligence to provide practice questions, evaluate responses, generate feedback, or provide other learning assistance. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Information submitted while using an AI-powered feature may be processed by the AI service required to provide that feature. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Users should avoid submitting passwords, financial information, government identification numbers, or other sensitive personal information that is not necessary for using PrepFriend. </p> {/* 2.4 TECHNICAL */} <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100"> 2.4 Technical Information </h3> <p className="mt-3 text-slate-600 dark:text-slate-300"> When you access the website, certain technical information may be processed automatically by the website, hosting platform, browser, or related infrastructure. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> This may include: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>IP address</li> <li>Browser information</li> <li>Device information</li> <li>Operating system</li> <li>Date and time of access</li> <li>Requested pages or resources</li> <li>Error and diagnostic information</li> <li>Security-related information</li> </ul> </section> {/* 3. HOW INFORMATION IS USED */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 3. How We Use Information </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Information may be used for purposes such as: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Creating and managing your account</li> <li>Authenticating your account</li> <li>Providing practice features</li> <li>Providing interview preparation features</li> <li>Saving practice history</li> <li>Generating progress information</li> <li>Providing AI-powered functionality</li> <li>Improving the application's features</li> <li>Fixing bugs and technical problems</li> <li>Protecting the application from misuse</li> <li>Maintaining security</li> </ul> </section> {/* 4. DATA MINIMIZATION */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 4. Data Minimization </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend aims to collect and process only information that is reasonably necessary to provide and improve the application's features. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Users should not provide unnecessary sensitive or confidential information while using the Services. </p> </section> {/* 5. COOKIES */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 5. Cookies and Local Storage </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend may use browser technologies such as cookies, local storage, or session storage to support application functionality. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> These technologies may be used for purposes such as: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Maintaining authentication sessions</li> <li>Remembering application preferences</li> <li>Supporting security features</li> <li>Improving application functionality</li> </ul> <p className="mt-3 text-slate-600 dark:text-slate-300">
 PrepFriend does not sell personal information or use personal
  information for targeted advertising.
</p> 
</section> 
{/* 6. DATA SHARING */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 6. Sharing of Information </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend does not sell your personal information. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Information may be processed by third-party infrastructure or service providers when necessary to operate specific features of PrepFriend, such as hosting, databases, authentication, email delivery, or AI functionality. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> We aim to use third-party services only when reasonably necessary for operating or improving the application. </p> </section> {/* 7. AI SERVICES */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 7. AI Services </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend may use third-party AI services to provide certain educational and interview-practice features. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> When an AI feature is used, information necessary to generate the requested response may be sent to the relevant AI service. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> The specific AI provider and its data-handling practices may depend on the technology used by PrepFriend at the time. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Users should avoid submitting unnecessary sensitive personal information into AI-powered features. </p> </section> {/* 8. DATA SECURITY */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 8. Data Security </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Reasonable technical and organizational measures are used to protect information against unauthorized access, misuse, alteration, disclosure, or destruction. </p> <DependingOnSecurity /> </section> {/* 9. DATA RETENTION */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 9. Data Retention </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Personal information may be retained for as long as reasonably necessary to provide the Services, maintain security, support account functionality, resolve issues, or comply with applicable legal requirements. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> When information is no longer reasonably required, reasonable steps may be taken to delete or anonymize it. </p> </section> {/* 10. ACCOUNT DELETION */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 10. Account Deletion </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Users may request deletion of their PrepFriend account and associated personal information. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Where account deletion functionality is available in the application, users can use that functionality to delete their account. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Some information may be retained when reasonably necessary for security, fraud prevention, legal obligations, or dispute resolution. </p> </section> {/* 11. USER RIGHTS */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 11. Your Privacy Rights </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> Depending on applicable law, users may have rights regarding their personal information, including rights to: </p> <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Access information associated with their account</li> <li>Correct inaccurate information</li> <li>Update profile information</li> <li>Request deletion of personal information</li> <li>Withdraw consent where applicable</li> <li>Raise privacy-related concerns or complaints</li> </ul> <p className="mt-3 text-slate-600 dark:text-slate-300"> Requests can be made through the{" "} <Link to="/contact" className="text-primary hover:underline" > Contact page </Link> . </p> </section> {/* 12. CHILDREN */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 12. Children's Privacy </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend is intended primarily as an educational and interview-preparation application. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> We do not intentionally request unnecessary personal information from children. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> If applicable law requires additional safeguards for children's personal information, PrepFriend will take reasonable steps to comply with those requirements. </p> </section> {/* 13. THIRD PARTY LINKS */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 13. Third-Party Links and Services </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend may contain links to third-party websites or services. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Third-party websites and services have their own privacy policies and practices. PrepFriend is not responsible for the privacy practices of third-party services that it does not control. </p> </section> {/* 14. MARKETING */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 14. Marketing Communications </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend does not currently use personal information to send targeted advertising. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> If promotional communications are introduced in the future, appropriate opt-out mechanisms will be provided where required by applicable law. </p> </section> {/* 15. INTERNATIONAL USERS */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 15. International Users </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> PrepFriend may be accessible from countries outside India. Depending on the services and infrastructure used, information may be processed in countries other than the country in which you are located. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Where applicable, we aim to take reasonable steps to protect personal information in accordance with relevant privacy laws. </p> </section> {/* 16. LEGAL COMPLIANCE */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 16. Legal and Regulatory Compliance </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> We have implemented privacy practices appropriate for the information our application currently processes, and we will update them as the application grows </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> Where applicable, this may include requirements under Indian privacy and data-protection laws, including the Digital Personal Data Protection Act, 2023 and applicable rules. </p> </section> {/* 17. POLICY CHANGES */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 17. Changes to This Privacy Policy </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> This Privacy Policy may be updated from time to time to reflect changes to PrepFriend, its features, data practices, technology, or applicable laws. </p> <p className="mt-3 text-slate-600 dark:text-slate-300"> The "Last Updated" date at the top of this page indicates when the policy was most recently updated. </p> </section> {/* 18. CONTACT */} <section className="mt-8"> <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100"> 18. Contact </h2> <p className="mt-3 text-slate-600 dark:text-slate-300"> If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us through our{" "} <Link to="/contact" className="text-primary hover:underline" > Contact page </Link> . </p> </section> {/* FOOTER */} <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700"> <p className="text-sm text-slate-500 dark:text-slate-400"> Last Updated: August 27, 2026 </p> </div> <Link to="/" className="mt-6 inline-block"> <Button variant="secondary">Back to Home</Button> </Link> </Card> </PageShell> );

const DependingOnSecurity = () => ( <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300"> <li>Secure authentication mechanisms</li> <li>Password protection and hashing</li> <li>Access controls</li> <li>Encrypted communications where supported</li> <li>Security monitoring and logging where appropriate</li> <li>Reasonable measures to prevent unauthorized access</li> </ul> );

export const TermsServicesPage = () => (
  <PageShell>
    <Card className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms & Services</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        By using PrepFriend you agree to:
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
          PrepFriend provides educational assistance only.
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
