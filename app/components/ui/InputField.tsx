import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute | 'text';
  placeholder?: string;
  autoComplete?: string;
  touched?: boolean;
  error?: string;
  className?: string;
}

const baseInputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function InputField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  touched,
  error,
  className = "",
}: InputFieldProps) {
  const hasError = Boolean(touched && error);

  return (
    <div className={className || undefined}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${baseInputClass} ${hasError ? "border-red-500" : ""}`}
      />
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-500" />
    </div>
  );
}
