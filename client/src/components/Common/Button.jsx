"use client";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseClass =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

  const variantClass = {
    primary: "bg-primary text-white hover:bg-blue-700 disabled:bg-gray-400",
    secondary:
      "bg-secondary text-white hover:bg-violet-700 disabled:bg-gray-400",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-400 disabled:text-gray-400",
    ghost:
      "text-primary hover:bg-blue-100 dark:hover:bg-blue-900 disabled:text-gray-400",
    danger: "bg-error text-white hover:bg-red-700 disabled:bg-gray-400",
    success: "bg-success text-white hover:bg-green-700 disabled:bg-gray-400",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabled || loading ? "cursor-not-allowed opacity-60" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
