import React, { useState } from "react";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const YELLOW = "#F6C32E";
const MAROON = "#8B2323";
const bseUrl = import.meta.env.VITE_REACT_BASE_URL;

function ForgotPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      onClose();
    }, 1500);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border flex flex-col items-center gap-4 relative"
        style={{ borderColor: YELLOW }}
      >
        <button
          className="absolute top-3 right-3 text-xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex items-center gap-2 mb-2">
          <FiMail className="text-lg" style={{ color: YELLOW }} />
          <span className="font-bold text-lg" style={{ color: YELLOW }}>Forgot Password</span>
        </div>
        {submitted ? (
          <div className="text-green-600 text-center font-medium">Reset link sent! Check your email.</div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 font-medium bg-white/90 placeholder:text-slate-400 transition shadow-sm"
              style={{ borderColor: YELLOW, color: MAROON, background: "#fff" }}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {error && <div className="text-red-600 text-sm font-semibold animate-pulse">{error}</div>}
            <button
              type="submit"
              className="font-semibold rounded-lg cursor-pointer px-4 py-2 shadow-md border"
              style={{ background: YELLOW, color: MAROON, borderColor: YELLOW }}
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const LoginV1 = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${bseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      if (onLogin) onLogin(data);
      navigate("/v1/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#faf9f6" }}
    >
      <ForgotPasswordDialog open={showForgot} onClose={() => setShowForgot(false)} />
      <div
        className="rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6"
        style={{
          background: YELLOW,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        }}
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: MAROON }}
        >
          Login
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "#333" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-lg px-4 py-2 border"
              style={{
                background: YELLOW,
                borderColor: MAROON,
                color: "#333",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "#333" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="rounded-lg px-4 py-2 border w-full pr-10"
                style={{
                  background: YELLOW,
                  borderColor: MAROON,
                  color: "#333",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                style={{ color: "#222" }}
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm font-semibold animate-pulse">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="rounded-full py-2 font-semibold text-lg"
            style={{
              background: MAROON,
              color: "#fff",
              marginTop: "10px",
              transition: "background 0.2s",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-end text-sm mt-2 font-medium">
          <button
            type="button"
            className="hover:underline cursor-pointer"
            style={{ color: MAROON, background: "none", border: "none", padding: 0 }}
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginV1;
