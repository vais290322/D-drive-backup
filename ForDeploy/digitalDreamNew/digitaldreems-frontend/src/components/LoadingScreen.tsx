import { useEffect, useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { getBusinessSettings } from '@/db/settingsApi';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Logging in...');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        // Fetch settings for logo
        const fetchSettings = async () => {
            try {
                const data = await getBusinessSettings();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        const messages = [
            'Logging in...',
            'Loading your profile...',
            'Setting up your workspace...',
            'Almost ready...'
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setLoadingText(messages[messageIndex]);
        }, 750);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(messageInterval);
                    setTimeout(onComplete, 200);
                    return 100;
                }
                return prev + 1;
            });
        }, 100); // 10 seconds total (100 / 1 * 100ms = 10000ms)

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="flex flex-col items-center space-y-6 p-8">
                {/* Logo with animation */}
                <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
                    style={{ animation: 'float 2s ease-in-out infinite' }}
                >
                    {settings?.logo_url ? (
                        <img
                            src={settings.logo_url}
                            alt="Logo"
                            className="h-16 w-16 object-contain"
                        />
                    ) : (
                        <Building2 className="h-12 w-12 text-white" />
                    )}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
                </div>

                {/* Company name */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {settings?.company_name || "Digital Dreams"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {settings?.tagline || "Loan Management CRM"}
                    </p>
                </div>

                {/* Spinner */}
                <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-lg font-medium text-foreground animate-pulse">
                        {loadingText}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-80 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out rounded-full"
                        style={{
                            width: `${progress}%`,
                            boxShadow: '0 0 10px rgba(232, 178, 68, 0.5)'
                        }}
                    />
                </div>

                {/* Progress percentage */}
                <span className="text-sm font-mono text-muted-foreground">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}
