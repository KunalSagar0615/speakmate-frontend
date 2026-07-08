export const RadioGroup = ({ label, name, options, value, onChange }) => (
  <fieldset className="space-y-3">
    {label && (
      <legend className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</legend>
    )}
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              selected
                ? "border-primary bg-sky-50 ring-2 ring-primary/30 dark:bg-sky-950/30"
                : "border-slate-200 hover:border-sky-300 dark:border-slate-700 dark:hover:border-sky-700"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="mt-1 accent-primary"
            />
            <span>
              <span className="block font-medium text-slate-800 dark:text-slate-100">
                {option.label}
              </span>
              {option.description && (
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);
