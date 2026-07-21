import { useToastStore } from '@/store/useToastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-500',
        iconColor: 'text-white',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-500',
        iconColor: 'text-white',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-500',
        iconColor: 'text-white',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-500',
        iconColor: 'text-white',
    },
};

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-20 right-4 z-9999 space-y-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] max-w-md pointer-events-auto`}
                            style={{ padding: '5px 10px', marginBottom: '5px'}}
                        >
                            <Icon size={20} className={config.iconColor} />
                            <p className="flex-1 text-sm font-medium" style={{ marginTop: '5px' }}>{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="hover:opacity-70 transition-opacity p-1"
                                aria-label="Close notification"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
