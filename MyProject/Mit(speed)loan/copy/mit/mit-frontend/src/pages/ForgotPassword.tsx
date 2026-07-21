
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Logo from "../../public/images/logo/mit.png";
import axios from "axios";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email: email,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        toast.success(response?.data?.message || "Check your email for password reset link");
        navigate("/login");
        setEmail("");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "something went wrong");

    } finally {
      setLoading(false);
    }

  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header Section */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-sm">
            No worries! We'll help you reset it
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={Logo}
                className="w-auto h-24 object-contain"
                alt="school logo"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-sm text-center text-gray-600 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Sending Reset Link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back to Login Link */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-900 font-medium mb-2">💡 Need Help?</p>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• Link expires in 24 hours</li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ForgotPassword;

