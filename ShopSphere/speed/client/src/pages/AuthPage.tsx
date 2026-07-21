import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Shield,
  Settings,
  User,
  Truck,
  Loader2,
} from "lucide-react";
import summaryApi from "../common/api";
import { setUser, setToken, setRole } from "../store/userSlice";

import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface RootState {
  user: {
    user: any;
    token: string | null;
    role: string | null;
  };
}

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [location, setLocation] = useLocation();

  // console.log("user : ", user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!loginEmail || !loginPassword) {
      alert("Please enter both email and password");
      return;
    }

    // console.log("Login:", { loginEmail, loginPassword});

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${summaryApi?.login}`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        {
          withCredentials: true,
        }
      );

      // console.log("response from login  : ", response);

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Login successful!");
        // Clear login form
        setLoginEmail("");
        setLoginPassword("");

        dispatch(setUser(response?.data?.data));
        dispatch(setToken(response?.data?.data?.token));
        dispatch(setRole(response?.data?.data?.role));

        // Redirect based on selected role
        switch (response?.data?.data?.role) {
          case "ADMIN":
            setLocation("/dashboard/admin");
            break;
          case "STAFF":
            setLocation("/dashboard/staff");
            break;
          case "DELIVERY":
            setLocation("/dashboard/delivery");
            break;
          default:
            setLocation("/");
            break;
        }
      } else {
        toast.error(
          response?.data?.message || "Login failed. Please try again."
        );
      }
    } catch (error: unknown) {
      const apiError = error as AxiosError<{ message?: string }>;
      console.error("Login error:", apiError);
      toast.error(
        apiError?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (registerPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // console.log("Register:", { registerName, registerEmail, registerMobile, registerPassword,  });

    try {
      setIsLoading(true);
      const response = await axios.post(`${summaryApi?.signup}`, {
        fullName: registerName,
        email: registerEmail,
        phoneNumber: registerMobile,
        password: registerPassword,
      });

      //  console.log("response from signup  : ", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        setActiveTab("login"); // Switch to login tab
        // Clear registration form
        setRegisterName("");
        setRegisterEmail("");
        setRegisterMobile("");
        setRegisterPassword("");
      }
    } catch (error: unknown) {
      const apiError = error as AxiosError<{ message?: string }>;
      console.error("Registration error:", apiError);
      toast.error(
        apiError?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <a
            className="flex items-center gap-2 text-sm hover-elevate px-3 py-2 rounded-md"
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </Link>
      </div>
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-2xl font-bold font-heading">S</span>
          </div>
          <span className="text-3xl font-bold font-heading">Sppeeds</span>
        </div>
        <p className="text-muted-foreground">
          Quality engineering tools delivered to your door
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" data-testid="tab-login">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" data-testid="tab-register">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Login to your Sppeeds account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin} noValidate>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email or Mobile</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    data-testid="input-login-email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    data-testid="input-login-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {isLoading ? (
                  <Button className="w-full" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                    in...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-login-submit"
                  >
                    Login
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  data-testid="button-forgot-password"
                >
                  Forgot Password?
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Register for a new Sppeeds account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister} noValidate>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    data-testid="input-register-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    data-testid="input-register-email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-mobile">Mobile Number</Label>
                  <Input
                    id="register-mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={registerMobile}
                    onChange={(e) => setRegisterMobile(e.target.value)}
                    data-testid="input-register-mobile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    data-testid="input-register-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                {isLoading ? (
                  <Button className="w-full" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    Account...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-register-submit"
                  >
                    Create Account
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="w-full max-w-md mt-4 text-center">
        <Link href="/demo-login">
          <a className="text-sm text-primary hover:underline">
            Demo Login (Quick access for all roles)
          </a>
        </Link>
      </div>
    </div>
  );
}
