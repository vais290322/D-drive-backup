import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { loginEmail, loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", { registerName, registerEmail, registerMobile, registerPassword });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
          <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Login to your Sppeeds account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
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
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full" data-testid="button-login-submit">
                  Login
                </Button>
                <Button type="button" variant="ghost" className="w-full text-sm" data-testid="button-forgot-password">
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
              <CardDescription>Register for a new Sppeeds account</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
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
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" data-testid="button-register-submit">
                  Create Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
