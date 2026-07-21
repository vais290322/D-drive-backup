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
import { ArrowLeft, Save, Upload, Camera, Image as ImageIcon, X, Eye, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CameraCapture from "@/components/CameraCapture";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  other_doc_name: z.string().optional(),
  other_doc_number: z.string().optional(),
  bank_name: z.string().optional(),
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  branch_name: z.string().optional(),
  // Manual Loan Details (Optional)
  add_loan: z.boolean().default(false).optional(),
  manual_loan_details: z.object({
    loan_id: z.string().optional(),
    loan_purpose: z.string().optional(),
    agreement_number: z.string().optional(),
    item_name: z.string().optional(),
    item_serial_number: z.string().optional(),
    item_description: z.string().optional(),
    loan_amount: z.coerce.number().optional(),
    processing_fee: z.coerce.number().optional(),
    insurance_fee: z.coerce.number().optional(),
    emi_amount: z.coerce.number().optional(),
    emi_start_date: z.string().optional(),
    emi_end_date: z.string().optional(),
    interest_rate: z.coerce.number().optional(),
  }).optional(),
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
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // KYC Documents State
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null);
  const [panCard, setPanCard] = useState<string | null>(null);
  const [voterIdCard, setVoterIdCard] = useState<string | null>(null);
  const [drivingLicenseCard, setDrivingLicenseCard] = useState<string | null>(null);
  const [otherDocImage, setOtherDocImage] = useState<string | null>(null);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customer_code_type: "auto",
      customer_code_manual: "",
      full_name: "",
      mobile_primary: "",
      nationality: "Indian",
      add_loan: false,
      manual_loan_details: {},
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
          other_doc_name: customer.other_doc_name || "",
          other_doc_number: customer.other_doc_number || "",
          bank_name: customer.bank_name || "",
          account_holder_name: customer.account_holder_name || "",
          account_number: customer.account_number || "",
          ifsc_code: customer.ifsc_code || "",
          branch_name: customer.branch_name || "",
          add_loan: !!customer.manual_loan_details?.loan_id,
          manual_loan_details: {
            loan_id: customer.manual_loan_details?.loan_id || "",
            loan_purpose: customer.manual_loan_details?.loan_purpose || "",
            agreement_number: customer.manual_loan_details?.agreement_number || "",
            item_name: customer.manual_loan_details?.item_name || "",
            item_serial_number: customer.manual_loan_details?.item_serial_number || "",
            item_description: customer.manual_loan_details?.item_description || "",
            loan_amount: customer.manual_loan_details?.loan_amount || 0,
            processing_fee: customer.manual_loan_details?.processing_fee || 0,
            insurance_fee: customer.manual_loan_details?.insurance_fee || 0,
            emi_amount: customer.manual_loan_details?.emi_amount || 0,
            emi_start_date: customer.manual_loan_details?.emi_start_date ? new Date(customer.manual_loan_details.emi_start_date).toISOString().split('T')[0] : "",
            emi_end_date: customer.manual_loan_details?.emi_end_date ? new Date(customer.manual_loan_details.emi_end_date).toISOString().split('T')[0] : "",
            interest_rate: customer.manual_loan_details?.interest_rate || 0,
          }
        });
        setCustomerPhoto(customer.photo_url);
        setAadhaarFront(customer.aadhaar_front_url || null);
        setAadhaarBack(customer.aadhaar_back_url || null);
        setPanCard(customer.pan_card_url || null);
        setVoterIdCard(customer.voter_id_url || null);
        setDrivingLicenseCard(customer.driving_license_url || null);
        setOtherDocImage(customer.other_doc_url || null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
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
        const result = reader.result as string;
        switch (type) {
          case 'photo': setCustomerPhoto(result); break;
          case 'aadhaar_front': setAadhaarFront(result); break;
          case 'aadhaar_back': setAadhaarBack(result); break;
          case 'pan': setPanCard(result); break;
          case 'voter': setVoterIdCard(result); break;
          case 'license': setDrivingLicenseCard(result); break;
          case 'other_doc': setOtherDocImage(result); break;
        }
        toast.success("Uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: string) => {
    switch (type) {
      case 'photo': setCustomerPhoto(null); break;
      case 'aadhaar_front': setAadhaarFront(null); break;
      case 'aadhaar_back': setAadhaarBack(null); break;
      case 'pan': setPanCard(null); break;
      case 'voter': setVoterIdCard(null); break;
      case 'license': setDrivingLicenseCard(null); break;
      case 'other_doc': setOtherDocImage(null); break;
    }
    toast.success("Removed successfully");
  };

  // Reusable Image Upload Component
  const ImageUploadPreview = ({
    label,
    imageUrl,
    onUpload,
    onRemove,
    inputId
  }: {
    label: string,
    imageUrl: string | null,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void,
    inputId: string
  }) => (
    <div className="space-y-2">
      <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider">{label}</FormLabel>
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <div className="flex items-center gap-2 w-full p-2 border rounded-md bg-white shadow-sm">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-12 w-20 cursor-pointer overflow-hidden rounded border bg-gray-100 hover:opacity-80 transition-opacity">
                  <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="relative w-full h-full flex justify-center items-center">
                  <img
                    src={imageUrl}
                    alt={label}
                    className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl bg-white"
                  />
                  <button
                    onClick={(e) => {
                      const closeBtn = document.querySelector('[data-radix-focus-guard]') as HTMLElement;
                      if (closeBtn) closeBtn.focus();
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <span className="text-xs font-medium truncate flex-1">Uploaded</span>

            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex gap-2 border-dashed bg-gray-50 hover:bg-gray-100"
              onClick={() => document.getElementById(inputId)?.click()}
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Upload {label}</span>
            </Button>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Wrapper for Number + Image (for PAN, Voter, DL)
  const DocumentUploadRow = ({
    label,
    value,
    onChange,
    imageUrl,
    onUpload,
    onRemove,
    inputId
  }: {
    label: string,
    value: string | undefined,
    onChange: (e: any) => void,
    imageUrl: string | null,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void,
    inputId: string
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border p-4 rounded-lg bg-gray-50/50">
      <div className="space-y-2">
        <FormLabel>{label} Number</FormLabel>
        <Input value={value || ''} onChange={onChange} placeholder={`Enter ${label} Number`} />
      </div>

      <ImageUploadPreview
        label={`${label} Image`}
        imageUrl={imageUrl}
        onUpload={onUpload}
        onRemove={onRemove}
        inputId={inputId}
      />
    </div>
  );


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
            aadhaar_front_url: aadhaarFront,
            aadhaar_back_url: aadhaarBack,
            pan_card_url: panCard,
            voter_id_url: voterIdCard,
            driving_license_url: drivingLicenseCard,
            other_doc_url: otherDocImage,
            // Manual Loan Details
            ...(data.add_loan ? {
              manual_loan_details: {
                ...data.manual_loan_details,
                // Ensure dates are properly formatted or null if empty
                emi_start_date: data.manual_loan_details?.emi_start_date || undefined,
                emi_end_date: data.manual_loan_details?.emi_end_date || undefined,
              }
            } : {})
          });
        }
        toast.success("Customer updated successfully");
      } else {
        const newCustomer = await api.customers.create({
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
          other_doc_name: data.other_doc_name || null,
          other_doc_number: data.other_doc_number || null,

          // Documents
          aadhaar_front_url: aadhaarFront,
          aadhaar_back_url: aadhaarBack,
          pan_card_url: panCard,
          voter_id_url: voterIdCard,
          driving_license_url: drivingLicenseCard,
          other_doc_url: otherDocImage,

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
          // Add Manual Loan Details if checkbox is checked
          ...(data.add_loan ? {
            manual_loan_details: {
              ...data.manual_loan_details,
              // Ensure dates are properly formatted or null if empty
              emi_start_date: data.manual_loan_details?.emi_start_date || undefined,
              emi_end_date: data.manual_loan_details?.emi_end_date || undefined,
            }
          } : {})
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="kyc">KYC Details</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="loan">Loan Details</TabsTrigger>
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
                              onClick={() => removeImage('photo')}
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
                          onChange={(e) => handleFileUpload(e, 'photo')}
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
                  <CardTitle>KYC Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Aadhaar */}
                  <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      {/* Aadhaar Number */}
                      <div className="md:col-span-2">
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
                      </div>

                      {/* Front Image */}
                      <ImageUploadPreview
                        label="Aadhaar Front"
                        imageUrl={aadhaarFront}
                        onUpload={(e) => handleFileUpload(e, 'aadhaar_front')}
                        onRemove={() => removeImage('aadhaar_front')}
                        inputId="aadhaar-front-upload"
                      />

                      {/* Back Image */}
                      <ImageUploadPreview
                        label="Aadhaar Back"
                        imageUrl={aadhaarBack}
                        onUpload={(e) => handleFileUpload(e, 'aadhaar_back')}
                        onRemove={() => removeImage('aadhaar_back')}
                        inputId="aadhaar-back-upload"
                      />
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold border-b pb-2">PAN Card</h3>
                    <FormField
                      control={form.control}
                      name="pan_number"
                      render={({ field }) => (
                        <DocumentUploadRow
                          label="PAN Card"
                          value={field.value || ''}
                          onChange={field.onChange}
                          imageUrl={panCard}
                          onUpload={(e) => handleFileUpload(e, 'pan')}
                          onRemove={() => removeImage('pan')}
                          inputId="pan-upload"
                        />
                      )}
                    />
                  </div>

                  {/* Voter ID */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold border-b pb-2">Voter ID</h3>
                    <FormField
                      control={form.control}
                      name="voter_id"
                      render={({ field }) => (
                        <DocumentUploadRow
                          label="Voter ID"
                          value={field.value || ''}
                          onChange={field.onChange}
                          imageUrl={voterIdCard}
                          onUpload={(e) => handleFileUpload(e, 'voter')}
                          onRemove={() => removeImage('voter')}
                          inputId="voter-upload"
                        />
                      )}
                    />
                  </div>

                  {/* Driving License */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold border-b pb-2">Driving License</h3>
                    <FormField
                      control={form.control}
                      name="driving_license"
                      render={({ field }) => (
                        <DocumentUploadRow
                          label="Driving License"
                          value={field.value || ''}
                          onChange={field.onChange}
                          imageUrl={drivingLicenseCard}
                          onUpload={(e) => handleFileUpload(e, 'license')}
                          onRemove={() => removeImage('license')}
                          inputId="license-upload"
                        />
                      )}
                    />
                  </div>

                  {/* Other Document */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold border-b pb-2">Other Document</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border p-4 rounded-lg bg-gray-50/50">
                      <FormField
                        control={form.control}
                        name="other_doc_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Ration Card, Utility Bill" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="other_doc_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter Document Number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <ImageUploadPreview
                          label="Document Image"
                          imageUrl={otherDocImage}
                          onUpload={(e) => handleFileUpload(e, 'other_doc')}
                          onRemove={() => removeImage('other_doc')}
                          inputId="other-doc-upload"
                        />
                      </div>
                    </div>
                  </div>

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

            <TabsContent value="loan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="add_loan"
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="add_loan"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-4 h-4 text-primary"
                          />
                          <label htmlFor="add_loan" className="text-lg cursor-pointer font-medium">
                            Add Manual Loan Info
                          </label>
                        </div>
                      )}
                    />
                  </CardTitle>
                </CardHeader>
                {form.watch("add_loan") && (
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="manual_loan_details.loan_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Loan ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manual_loan_details.agreement_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agreement Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Agreement No" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manual_loan_details.loan_purpose"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Loan Purpose</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter purpose" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Item Details */}
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <h3 className="text-sm font-semibold mb-3">Item Details</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="manual_loan_details.item_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Item Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.item_serial_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial No / IMEI</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Serial No" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.item_description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Item Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Financial Details */}
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <h3 className="text-sm font-semibold mb-3">Financial Details</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="manual_loan_details.loan_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount (₹)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter Amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.processing_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Charges (₹)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter Charges" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.insurance_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Fee (₹)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter Fee" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.interest_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate of Interest (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="Enter ROI" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <h3 className="text-sm font-semibold mb-3">EMI Details</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="manual_loan_details.emi_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EMI Amount (₹)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Enter EMI Amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.emi_start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EMI Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manual_loan_details.emi_end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EMI End Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                )}
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
