import { Field, ErrorMessage } from "formik";

interface TextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  touched?: boolean;
  error?: string;
  className?: string;
}

const baseTextAreaClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 resize-none";

export default function TextArea({
  name,
  label,
  placeholder,
  rows = 4,
  touched,
  error,
  className = "",
}: TextAreaProps) {
  const hasError = Boolean(touched && error);

  return (
    <div className={className || undefined}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`${baseTextAreaClass} ${hasError ? "border-red-500" : ""}`}
      />
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-500" />
    </div>
  );
}