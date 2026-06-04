"use client";

export function Loading({ fullScreen = true, message = "Loading..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );
}
