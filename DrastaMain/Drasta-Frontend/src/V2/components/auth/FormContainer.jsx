import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export function FormContainer({
  title,
  children,
  onSubmit,
  msg,
  status = "idle",
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100 ">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.form
          onSubmit={onSubmit}
          className="w-full max-w-md  rounded-2xl shadow-lg p-8 space-y-5 bg-[var(--secondary-color)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.h2
              className="text-2xl font-bold text-[var(--primary-color)]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {title}
            </motion.h2>
          </div>

          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full mt-2 p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${
                status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status === "failed" ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              <p className="flex-1 text-center">{msg}</p>
            </motion.div>
          )}
          {children}
        </motion.form>
      </div>
    </div>
  );
}
