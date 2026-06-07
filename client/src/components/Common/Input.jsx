"use client";

import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, helper, icon: Icon, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <div
        className={`flex items-center gap-2 input-field ${
          error ? "border-error focus-within:ring-error" : ""
        }`}
      >
        {Icon && (
          <div className="text-gray-500 dark:text-gray-400">
            <Icon size={18} />
          </div>
        )}

        <input
          ref={ref}
          className="flex-1 bg-transparent outline-none"
          {...props}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {helper && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
