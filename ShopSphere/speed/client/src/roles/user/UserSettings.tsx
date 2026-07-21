import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Shield
} from "lucide-react";
import { useState } from "react";
import { UserSidebar } from "./UserSidebar";

export default function UserSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: true
  });
  
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    currency: "INR"
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={3} isLoggedIn={true} userName="John Doe" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar activeSection="settings" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
              </div>
              <Button>Save Changes</Button>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={() => handleNotificationChange('sms')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationChange('push')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                    </div>
                    <Switch 
                      checked={notifications.marketing}
                      onCheckedChange={() => handleNotificationChange('marketing')}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Button
                        variant={preferences.theme === "light" ? "default" : "outline"}
                        onClick={() => handlePreferenceChange('theme', 'light')}
                      >
                        Light
                      </Button>
                      <Button
                        variant={preferences.theme === "dark" ? "default" : "outline"}
                        onClick={() => handlePreferenceChange('theme', 'dark')}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={preferences.theme === "system" ? "default" : "outline"}
                        onClick={() => handlePreferenceChange('theme', 'system')}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full mt-2 border rounded-md px-3 py-2"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                      className="w-full mt-2 border rounded-md px-3 py-2"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login History</Label>
                      <p className="text-sm text-muted-foreground">View your recent login activity</p>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Deactivate Account</Label>
                      <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                    </div>
                    <Button variant="outline">Deactivate</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-destructive">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}