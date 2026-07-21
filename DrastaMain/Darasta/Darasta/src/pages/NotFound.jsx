import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Button asChild>
                    <Link to="/">Go back home</Link>
                </Button>
            </div>
        </div>
    );
};

