import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "primary" | "toggle";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  children: ReactNode;
  type?: ButtonType;
  variant?: ButtonVariant;
  isActive?: boolean;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

const baseButtonClass =
  "rounded-full text-sm font-medium transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonClass =
  "bg-black px-5 py-2.5 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";

const toggleActiveButtonClass =
  "bg-white py-2 capitalize text-black shadow dark:bg-zinc-950 dark:text-white";

const toggleInactiveButtonClass =
  "py-2 capitalize text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isActive = false,
  fullWidth,
  onClick,
  disabled = false,
  className = "",
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "toggle"
      ? isActive
        ? toggleActiveButtonClass
        : toggleInactiveButtonClass
      : primaryButtonClass;

  const widthClass = (fullWidth ?? variant === "primary") ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseButtonClass} ${variantClass} ${widthClass} ${className}`.trim().replace(/\s+/g, " ")}
      {...rest}
    >
      {children}
    </button>
  );
}
