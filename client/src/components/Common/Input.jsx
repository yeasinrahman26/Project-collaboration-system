"use client";

import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, helper, icon: Icon, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? "pl-10" : ""} ${error ? "border-error focus:ring-error" : ""}`}
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
