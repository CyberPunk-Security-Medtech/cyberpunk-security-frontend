// import React from 'react';

// function Button({
//     children,
//     type,
//     className,
//     onSubmitHandler,
//     disabled,
// }: {
//     children: React.ReactNode;
//     type: 'submit' | 'reset' | 'button' | undefined;
//     className?: string;
//     onSubmitHandler?: (() => void) | (() => Promise<void>);
//     disabled?: boolean;
// }): React.ReactNode {
//     const handleSubmit = (): void => {
//         if (onSubmitHandler) {
//             onSubmitHandler();
//         }
//     };
//     return (
//         <>
//             <button
//                 className={className}
//                 type={type}
//                 disabled={disabled}
//                 onClick={handleSubmit}
//             >
//                 {children}
//             </button>
//         </>
//     );
// }

// export default Button;


import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;

  onClick?: () => unknown | Promise<unknown>;
onSubmitHandler?: () => unknown | Promise<unknown>;

  disabled?: boolean;

  variant?: "primary" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";

  isLoading?: boolean;
};

function Button({
  children,
  type = "button",
  className = "",
  onClick,
  onSubmitHandler,
  disabled = false,
  variant = "primary",
  size = "md",
  isLoading = false,
}: ButtonProps) {
  const handleClick = async () => {
    if (onClick) {
      await onClick();
    }

    if (onSubmitHandler) {
      await onSubmitHandler();
    }
  };

  const variantStyles = {
    primary:
      "bg-[#1A2380] text-white hover:bg-[#11185c]",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        rounded-md font-medium transition
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;