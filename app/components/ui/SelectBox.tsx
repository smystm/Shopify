interface SelectOption {
   value: string;
   label: string;
}

interface SelectBoxProps {
   name: string;
   label: string;
   options: SelectOption[];
   placeholder?: string;
   value?: string;
   onChange?: (value: string) => void;
   onBlur?: () => void;
   touched?: boolean;
   error?: string;
   className?: string;
   disabled?: boolean;
}

const baseSelectClass =
   "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function SelectBox({
   name,
   label,
   options,
   placeholder,
   value,
   onChange,
   onBlur,
   touched,
   error,
   className = "",
   disabled = false,
}: SelectBoxProps) {
   const hasError = Boolean(touched && error);

   return (
      <div className={className || undefined}>
         <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {label}
         </label>
         <select
            id={name}
            name={name}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={() => onBlur?.()}
            disabled={disabled}
            className={`${baseSelectClass} ${hasError ? "border-red-500" : ""}`}
         >
            {placeholder && (
               <option value="" disabled>
                  {placeholder}
               </option>
            )}
            <option value="">All</option>
            {options.map((option) => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
         {hasError ? (
            <p className="mt-1 text-xs text-red-500">{error}</p>
         ) : null}
      </div>
   );
}
