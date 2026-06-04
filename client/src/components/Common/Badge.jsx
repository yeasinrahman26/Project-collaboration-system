"use client";

export function Badge({ children, variant = "primary", size = "md" }) {
  const variantClass = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    secondary:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }[variant];

  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  }[size];

  return (
    <span
      className={`inline-block rounded-full font-medium ${variantClass} ${sizeClass}`}
    >
      {children}
    </span>
  );
}
