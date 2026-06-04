"use client";

export function Card({
  children,
  className = "",
  hoverable = false,
  padding = true,
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        padding ? "p-6" : ""
      } ${hoverable ? "hover:shadow-lg hover:border-primary dark:hover:border-secondary cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }) {
  return (
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
      {children}
    </h3>
  );
}

export function CardContent({ children }) {
  return <div className="text-gray-600 dark:text-gray-400">{children}</div>;
}

export function CardFooter({ children }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
      {children}
    </div>
  );
}
