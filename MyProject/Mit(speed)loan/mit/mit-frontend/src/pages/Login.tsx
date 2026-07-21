import { useState } from "react";
import { useNavigate } from "react-router";
import { login, register } from "@/db/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("Mit Electro World");
  const [tagline, setTagline] = useState("Loan Management CRM System");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const navigate = useNavigate();

  // Fetch settings on mount
  useState(() => {
    const fetchSettings = async () => {
      try {
        const { getPublicBusinessSettings } = await import("@/db/settingsApi");
        const settings = await getPublicBusinessSettings();
        if (settings) {
          if (settings.company_name) setCompanyName(settings.company_name);
          if (settings.tagline) setTagline(settings.tagline);
          if (settings.logo_url) setLogoUrl(settings.logo_url);
        }
      } catch (err) {
        console.error("Failed to fetch settings for login:", err);
      }
    };
    fetchSettings();
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signInEmail || !signInPassword) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      await login(signInEmail, signInPassword);

      toast.success("Login successful!");
      // Navigate to dashboard now that auth provider will update
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const msg = error?.data?.message || error?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpEmail || !signUpPassword || !signUpName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await register(signUpEmail, signUpPassword, signUpName);

      toast.success(result.message);

      // Clear form
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpName("");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="h-16 w-16 object-contain rounded-full"
              />
            ) : (
              <Building2 className="h-10 w-10 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">{companyName}</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {tagline}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                {/* <p className="text-center text-xs text-muted-foreground">
                  Default: admin@mitelectroworld.com / admin123
                </p> */}
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Designed & Developed by Vais Engineering Pvt Ltd
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

