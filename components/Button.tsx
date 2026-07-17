import React, { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "unstyled" | "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "compact" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSubmitHandler?: (() => void) | (() => Promise<void>);
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  unstyled: "",
  primary:
    "bg-[var(--dashboard-accent,#1A2380)] text-white hover:bg-[var(--dashboard-accent-hover,#11185F)]",
  secondary:
    "border border-[var(--dashboard-accent,#1A2380)] text-[var(--dashboard-accent,#1A2380)] hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-11 px-5 sm:min-h-10",
  compact: "min-h-10 px-4",
  icon: "min-h-11 min-w-11 p-2 sm:min-h-10 sm:min-w-10",
};

function Button({
  children,
  type = "button",
  className = "",
  onSubmitHandler,
  onClick,
  variant = "unstyled",
  size = "default",
  ...props
}: ButtonProps): React.ReactNode {
  const sizing = sizeClasses[size];

  return (
    <button
      {...props}
      type={type}
      className={`dashboard-button ${sizing} ${variantClasses[variant]} ${className}`.trim()}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void onSubmitHandler?.();
      }}
    >
      {children}
    </button>
  );
}

export default Button;
