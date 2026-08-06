import "./registerLoader.css";

export default function FullScreenLoader({
  title = "Loading...",
  subtitle = "Please wait...",
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="pulse-grid">
        <span />
        <span />
        <span />

        <span />
        <span />
        <span />

        <span />
        <span />
        <span />
      </div>

      <h2 className="mt-10 text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}