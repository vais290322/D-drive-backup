import React from "react";
import { Link } from "react-router-dom";

export function FormFooter({ to = "login", isForgotPassword = true }) {
  const text =
    to === "login"
      ? "Already have an account? Login"
      : "Don't have an account? Sign Up";
  return (
    <div className="flex justify-between text-sm">
      <Link
        to={`/${to}`}
        className="hover:underline text-[var(--primary-color)]"
      >
        {text}
      </Link>
      {isForgotPassword && (
        <Link
          to="/reset-password"
          className="hover:underline text-[var(--primary-color)]"
        >
          Forgot Password?
        </Link>
      )}
    </div>
  );
}
