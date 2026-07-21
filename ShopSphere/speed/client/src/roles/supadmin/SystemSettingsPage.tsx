import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SupAdminSidebar } from "./SupAdminSidebar";
import { useState } from "react";
import { Save, Settings, Database, Shield, Mail, Bell } from "lucide-react";

export default function SystemSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "Sppeeds E-commerce",
    siteDescription: "Quality engineering tools delivered to your door",
    adminEmail: "admin@sppeeds.com",
    supportEmail: "support@sppeeds.com",
    smtpHost: "smtp.sppeeds.com",
    smtpPort: "587",
    smtpUser: "noreply@sppeeds.com",
    smtpPassword: "",
    enableSSL: true,
    maintenanceMode: false,
    backupFrequency: "daily",
    retentionPeriod: "30",
    enableAuditLogs: true,
    logLevel: "info",
    maxLoginAttempts: "5",
    lockoutDuration: "30"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings updated:", formData);
    // In a real app, you would send this data to your backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="SupAdmin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SupAdminSidebar activeSection="system" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">System Settings</h1>
                <p className="text-muted-foreground">Configure global system settings</p>
              </div>
              <Button form="settings-form" type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
            
            <form id="settings-form" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription>Basic system configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={formData.siteName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={formData.siteDescription}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <Input
                          id="adminEmail"
                          type="email"
                          value={formData.adminEmail}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={formData.supportEmail}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Configuration
                    </CardTitle>
                    <CardDescription>SMTP settings for system emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={formData.smtpHost}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          value={formData.smtpPort}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpUser">SMTP Username</Label>
                        <Input
                          id="smtpUser"
                          value={formData.smtpUser}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={formData.smtpPassword}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable SSL</Label>
                        <p className="text-sm text-muted-foreground">Use SSL for SMTP connection</p>
                      </div>
                      <Switch 
                        checked={formData.enableSSL}
                        onCheckedChange={() => handleSwitchChange('enableSSL')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>System security configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={formData.maxLoginAttempts}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                        <Input
                          id="lockoutDuration"
                          type="number"
                          value={formData.lockoutDuration}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Backup & Maintenance
                    </CardTitle>
                    <CardDescription>System backup and maintenance settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <select
                          id="backupFrequency"
                          value={formData.backupFrequency}
                          onChange={(e) => setFormData(prev => ({ ...prev, backupFrequency: e.target.value }))}
                          className="w-full mt-1 border rounded-md px-3 py-2"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                        <Input
                          id="retentionPeriod"
                          type="number"
                          value={formData.retentionPeriod}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                      </div>
                      <Switch 
                        checked={formData.maintenanceMode}
                        onCheckedChange={() => handleSwitchChange('maintenanceMode')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Audit Logs</Label>
                        <p className="text-sm text-muted-foreground">Track system events and changes</p>
                      </div>
                      <Switch 
                        checked={formData.enableAuditLogs}
                        onCheckedChange={() => handleSwitchChange('enableAuditLogs')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="logLevel">Log Level</Label>
                      <select
                        id="logLevel"
                        value={formData.logLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, logLevel: e.target.value }))}
                        className="w-full mt-1 border rounded-md px-3 py-2"
                      >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}