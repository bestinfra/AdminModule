import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "outlineSecondary"
    | "primarysmall"
    | "danger"
    | "warning"                                                                     
    | "test"
    | "asset"
    | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.memo<ButtonProps>(
  ({
    label,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    size = "medium",
    loading = false,
    className,
    children,
    icon,
    ...props
  }) => {
    /** Base classes */
    const baseClasses =
      "font-manrope whitespace-nowrap font-bold rounded-full cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center gap-2 border-2 w-fit disabled:cursor-not-allowed disabled:opacity-50";

    /** Size classes */
    const sizeClasses: Record<string, string> = {
      small: "h-8 px-4 text-sm font-semibold",
      medium: "h-11 px-8 text-base",
      large: "h-14 px-10 text-lg",
    };

    /** Variant classes */
    const variantClasses: Record<string, string> = {
      primary:
        "bg-secondary text-white border-secondary hover:bg-white hover:text-secondary hover:border-secondary",
      secondary:
        "bg-primary text-white border-primary hover:bg-white hover:text-primary hover:border-primary",
      outline:
        "bg-transparent text-primary border-primary hover:bg-primary hover:text-white",
      outlineSecondary:
        "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900",
      primarysmall:
        "bg-primary text-white border-primary h-8",
      danger:
        "bg-danger text-white border-danger hover:bg-danger-alt hover:border-danger-alt hover:text-danger active:bg-danger",
      warning:
        "bg-warning text-white border-warning hover:bg-white hover:text-warning",
      test:
        "bg-primary-lightest text-secondary border-white hover:bg-secondary hover:text-white hover:border-secondary",
      asset:
        "bg-primary-lightest text-secondary border-primary-lightest hover:bg-white hover:text-secondary",
      success:
        "bg-secondary text-white border-secondary hover:bg-white hover:text-secondary",
    };

    /** Loading state */
    const loadingClasses = loading
      ? "relative text-transparent after:content-[''] after:absolute after:w-4 after:h-4 after:border-2 after:border-transparent after:border-t-current after:rounded-full after:animate-spin"
      : "";

    /** Final composed classes */
    const allClasses = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      loadingClasses,
      className,
    ].filter(Boolean).join(" ");

    const isDisabled = disabled || loading;

    return (
      <button
        type={type}
        className={allClasses}
        onClick={onClick}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <span className="sr-only">Loading...</span>
        ) : (
          <>
            {icon && (
              <span className="flex justify-center items-center min-w-6">
                {icon}
              </span>
            )}
            {children || label}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
