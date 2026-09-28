import { Field, ErrorMessage } from "formik";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps {
  name: string;
  label: string;
  options: RadioOption[];
  touched?: boolean;
  error?: string;
  className?: string;
}

const baseRadioClass =
  "h-4 w-4 border-zinc-300 text-black focus:ring-black dark:border-zinc-600 dark:bg-zinc-800";

export default function RadioButton({
  name,
  label,
  options,
  touched,
  error,
  className = "",
}: RadioButtonProps) {
  const hasError = Boolean(touched && error);

  return (
    <div className={className || undefined}>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <Field
              name={name}
              type="radio"
              value={option.value}
              className={baseRadioClass}
            />
            <span className="text-sm text-zinc-900 dark:text-zinc-100">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-500" />
    </div>
  );
}