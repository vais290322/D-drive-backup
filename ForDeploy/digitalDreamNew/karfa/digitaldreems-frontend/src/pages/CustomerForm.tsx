import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/db/api";
import type { Customer } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, Camera, Image as ImageIcon, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CameraCapture from "@/components/CameraCapture";

const customerSchema = z.object({
  customer_code_type: z.enum(["auto", "manual"]).default("auto"),
  customer_code_manual: z.string().optional(),
  full_name: z.string().min(1, "Full name is required"),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  spouse_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  marital_status: z.string().optional(),
  marriage_anniversary: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  mobile_primary: z.string().min(10, "Mobile number is required"),
  mobile_secondary: z.string().optional(),
  permanent_address: z.string().optional(),
  current_address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pin_code: z.string().optional(),
  aadhaar_number: z.string().optional(),
  pan_number: z.string().optional(),
  voter_id: z.string().optional(),
  driving_license: z.string().optional(),
  bank_name: z.string().optional(),
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  branch_name: z.string().optional(),
}).refine((data) => {
  if (data.customer_code_type === "manual" && !data.customer_code_manual) {
    return false;
  }
  return true;
}, {
  message: "Customer code is required when manual generation is selected",
  path: ["customer_code_manual"],
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customer_code_type: "auto",
      customer_code_manual: "",
      full_name: "",
      mobile_primary: "",
      nationality: "Indian",
    },
  });

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    if (!id) return;
    try {
      setInitialLoading(true);
      const customer = await api.customers.get(id);
      if (customer) {
        form.reset({
          full_name: customer.full_name,
          father_name: customer.father_name || "",
          mother_name: customer.mother_name || "",
          spouse_name: customer.spouse_name || "",
          date_of_birth: customer.date_of_birth || "",
          gender: customer.gender || "",
          nationality: customer.nationality || "Indian",
          marital_status: customer.marital_status || "",
          marriage_anniversary: customer.marriage_anniversary || "",
          email: customer.email || "",
          mobile_primary: customer.mobile_primary,
          mobile_secondary: customer.mobile_secondary || "",
          permanent_address: customer.permanent_address || "",
          current_address: customer.current_address || "",
          city: customer.city || "",
          district: customer.district || "",
          state: customer.state || "",
          pin_code: customer.pin_code || "",
          aadhaar_number: customer.aadhaar_number || "",
          pan_number: customer.pan_number || "",
          voter_id: customer.voter_id || "",
          driving_license: customer.driving_license || "",
          bank_name: customer.bank_name || "",
          account_holder_name: customer.account_holder_name || "",
          account_number: customer.account_number || "",
          ifsc_code: customer.ifsc_code || "",
          branch_name: customer.branch_name || "",
        });
        setCustomerPhoto(customer.photo_url);
      }
    } catch (error) {
      console.error("Error loading customer:", error);
      toast.error("Failed to load customer");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setCustomerPhoto(imageDataUrl);
    toast.success("Photo captured successfully");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomerPhoto(reader.result as string);
        toast.success("Photo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCustomerPhoto(null);
    toast.success("Photo removed");
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      if (id) {
        const customer = await api.customers.get(id);
        if (customer) {
          await api.customers.update(id, {
            ...customer,
            ...data,
            photo_url: customerPhoto,
          });
        }
        toast.success("Customer updated successfully");
      } else {
        await api.customers.create({
          full_name: data.full_name || "",
          father_name: data.father_name || null,
          mother_name: data.mother_name || null,
          spouse_name: data.spouse_name || null,
          date_of_birth: data.date_of_birth || null,
          gender: data.gender || null,
          nationality: data.nationality || null,
          marital_status: data.marital_status || null,
          marriage_anniversary: data.marriage_anniversary || null,
          email: data.email || null,
          mobile_primary: data.mobile_primary || "",
          mobile_secondary: data.mobile_secondary || null,
          permanent_address: data.permanent_address || null,
          current_address: data.current_address || null,
          city: data.city || null,
          district: data.district || null,
          state: data.state || null,
          pin_code: data.pin_code || null,
          address_proof_url: null,
          aadhaar_number: data.aadhaar_number || null,
          pan_number: data.pan_number || null,
          voter_id: data.voter_id || null,
          driving_license: data.driving_license || null,
          aadhaar_front_url: null,
          aadhaar_back_url: null,
          pan_card_url: null,
          photo_url: customerPhoto,
          signature_url: null,
          kyc_status: "pending",
          kyc_verified_by: null,
          kyc_verified_at: null,
          kyc_remarks: null,
          kyc_photo_url: null,
          bank_name: data.bank_name || null,
          account_holder_name: data.account_holder_name || null,
          account_number: data.account_number || null,
          ifsc_code: data.ifsc_code || null,
          branch_name: data.branch_name || null,
          cancelled_cheque_url: null,
          created_by: null,
        }, data.customer_code_type === "manual" ? data.customer_code_manual : undefined);
        toast.success("Customer created successfully");
      }
      navigate("/customers");
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-10 w-full bg-muted" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {id ? "Edit Customer" : "Add New Customer"}
          </h1>
          <p className="text-muted-foreground">
            {id ? "Update customer information" : "Register a new customer"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="kyc">KYC Details</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {!id && (
                    <>
                      <FormField
                        control={form.control}
                        name="customer_code_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer ID Generation *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select generation type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="auto">Auto Generate</SelectItem>
                                <SelectItem value="manual">Manual Entry</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("customer_code_type") === "manual" && (
                        <FormField
                          control={form.control}
                          name="customer_code_manual"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer ID *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter customer ID (e.g., CUST000001)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="father_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter father's name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mother_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mother's name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spouse_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter spouse name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marital_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marriage_anniversary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marriage Anniversary</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Mobile *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile_secondary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Mobile</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter secondary mobile" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter nationality" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormLabel>Customer Photo</FormLabel>
                    <div className="flex items-start gap-4 mt-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={customerPhoto || undefined} alt="Customer" />
                        <AvatarFallback className="text-2xl">
                          {form.watch("full_name")?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Upload a photo from gallery or capture using camera
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCamera(true)}
                            className="gap-2"
                          >
                            <Camera className="h-4 w-4" />
                            Capture Photo
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("photo-upload")?.click()}
                            className="gap-2"
                          >
                            <ImageIcon className="h-4 w-4" />
                            Upload from Gallery
                          </Button>
                          
                          {customerPhoto && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removePhoto}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="permanent_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Permanent Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter permanent address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="current_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Current Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter current address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter district" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pin_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter PIN code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="aadhaar_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Aadhaar number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pan_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter PAN number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="voter_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voter ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Voter ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="driving_license"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driving License</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter driving license number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter bank name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter account holder name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter account number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifsc_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter IFSC code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch_name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter branch name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </Form>

      <CameraCapture
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        title="Capture Customer Photo"
      />
    </div>
  );
}

