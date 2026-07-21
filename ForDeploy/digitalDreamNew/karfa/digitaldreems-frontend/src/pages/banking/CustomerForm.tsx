import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  getBankCustomerById,
  createBankCustomer,
  updateBankCustomer,
  uploadCustomerPhoto,
  createBankAccount,
} from '@/db/bankingApi';

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    photo_url: '',
    father_name: '',
    mother_name: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    nationality: 'Indian',
    occupation: '',
    annual_income: '',
    pan_number: '',
    aadhaar_number: '',
    alternate_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    permanent_address: '',
    city: '',
    state: '',
    pincode: '',
    alternate_bank_name: '',
    alternate_bank_account_number: '',
    alternate_bank_ifsc: '',
    alternate_bank_branch: '',
    account_number: '',
    account_type: 'savings',
    opening_balance: '0',
  });

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const customer = await getBankCustomerById(id);
      if (customer) {
        setFormData({
          full_name: customer.full_name,
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          photo_url: customer.photo_url || '',
          father_name: customer.father_name || '',
          mother_name: customer.mother_name || '',
          date_of_birth: customer.date_of_birth || '',
          gender: customer.gender || '',
          marital_status: customer.marital_status || '',
          nationality: customer.nationality || 'Indian',
          occupation: customer.occupation || '',
          annual_income: customer.annual_income?.toString() || '',
          pan_number: customer.pan_number || '',
          aadhaar_number: customer.aadhaar_number || '',
          alternate_phone: customer.alternate_phone || '',
          emergency_contact_name: customer.emergency_contact_name || '',
          emergency_contact_phone: customer.emergency_contact_phone || '',
          permanent_address: customer.permanent_address || '',
          city: customer.city || '',
          state: customer.state || '',
          pincode: customer.pincode || '',
          alternate_bank_name: customer.alternate_bank_name || '',
          alternate_bank_account_number: customer.alternate_bank_account_number || '',
          alternate_bank_ifsc: customer.alternate_bank_ifsc || '',
          alternate_bank_branch: customer.alternate_bank_branch || '',
          account_number: customer.accounts?.[0]?.account_number || '',
          account_type: customer.accounts?.[0]?.account_type || 'savings',
          opening_balance: customer.accounts?.[0]?.balance.toString() || '0',
        });
        if (customer.photo_url) {
          setPhotoPreview(customer.photo_url);
        }
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Only JPEG, PNG, WEBP, and GIF images are allowed.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (1 MB)
    if (file.size > 1048576) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 1 MB. Please compress the image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate filename (only English letters and numbers)
    const filename = file.name;
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      toast({
        title: 'Invalid Filename',
        description: 'Filename must contain only English letters and numbers.',
        variant: 'destructive',
      });
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({ ...formData, photo_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Customer name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!id && !formData.account_number.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Account number is required for new customers',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      let photoUrl = formData.photo_url;

      // Upload photo if a new file is selected
      if (photoFile) {
        setUploading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        try {
          photoUrl = await uploadCustomerPhoto(photoFile);
          setUploadProgress(100);
          toast({
            title: 'Photo Uploaded',
            description: `Image uploaded successfully. Size: ${(photoFile.size / 1024).toFixed(2)} KB`,
          });
        } catch (error: any) {
          clearInterval(progressInterval);
          toast({
            title: 'Upload Failed',
            description: error.message || 'Failed to upload photo',
            variant: 'destructive',
          });
          setUploading(false);
          setLoading(false);
          return;
        } finally {
          clearInterval(progressInterval);
          setUploading(false);
        }
      }

      const customerData = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        photo_url: photoUrl || null,
        father_name: formData.father_name.trim() || null,
        mother_name: formData.mother_name.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        gender: (formData.gender as 'male' | 'female' | 'other') || null,
        marital_status: (formData.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || null,
        nationality: formData.nationality.trim() || null,
        occupation: formData.occupation.trim() || null,
        annual_income: formData.annual_income ? parseFloat(formData.annual_income) : null,
        pan_number: formData.pan_number.trim() || null,
        aadhaar_number: formData.aadhaar_number.trim() || null,
        alternate_phone: formData.alternate_phone.trim() || null,
        emergency_contact_name: formData.emergency_contact_name.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone.trim() || null,
        permanent_address: formData.permanent_address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        pincode: formData.pincode.trim() || null,
        alternate_bank_name: formData.alternate_bank_name.trim() || null,
        alternate_bank_account_number: formData.alternate_bank_account_number.trim() || null,
        alternate_bank_ifsc: formData.alternate_bank_ifsc.trim() || null,
        alternate_bank_branch: formData.alternate_bank_branch.trim() || null,
      };

      if (id) {
        await updateBankCustomer(id, customerData);
        toast({
          title: 'Success',
          description: 'Customer updated successfully',
        });
      } else {
        const newCustomer = await createBankCustomer(customerData);
        if (newCustomer && formData.account_number.trim()) {
          // Create account for new customer
          await createBankAccount({
            customer_id: newCustomer.id,
            account_number: formData.account_number.trim(),
            account_type: formData.account_type,
            balance: parseFloat(formData.opening_balance) || 0,
            status: 'active',
            opening_date: new Date().toISOString().split('T')[0],
          });
        }
        toast({
          title: 'Success',
          description: 'Customer and account created successfully',
        });
      }
      navigate('/banking/customers');
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${id ? 'update' : 'create'} customer`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/banking/customers')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <h1 className="text-2xl xl:text-3xl font-bold">
          {id ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {id ? 'Update customer information' : 'Enter customer details and create account'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter customer's full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Current Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter customer's current address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="father_name">Father's Name</Label>
                    <Input
                      id="father_name"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">Mother's Name</Label>
                    <Input
                      id="mother_name"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleChange}
                      placeholder="Enter mother's name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <select
                      id="marital_status"
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="Enter nationality"
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="annual_income">Annual Income (₹)</Label>
                  <Input
                    id="annual_income"
                    name="annual_income"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.annual_income}
                    onChange={handleChange}
                    placeholder="Enter annual income"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KYC Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pan_number">PAN Number</Label>
                    <Input
                      id="pan_number"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                    <Input
                      id="aadhaar_number"
                      name="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={handleChange}
                      placeholder="1234 5678 9012"
                      maxLength={12}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alternate_phone">Alternate Phone Number</Label>
                  <Input
                    id="alternate_phone"
                    name="alternate_phone"
                    type="tel"
                    value={formData.alternate_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="permanent_address">Permanent Address</Label>
                  <Textarea
                    id="permanent_address"
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleChange}
                    placeholder="Enter permanent address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternate Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alternate_bank_name">Bank Name</Label>
                    <Input
                      id="alternate_bank_name"
                      name="alternate_bank_name"
                      value={formData.alternate_bank_name}
                      onChange={handleChange}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternate_bank_account_number">Account Number</Label>
                    <Input
                      id="alternate_bank_account_number"
                      name="alternate_bank_account_number"
                      value={formData.alternate_bank_account_number}
                      onChange={handleChange}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alternate_bank_ifsc">IFSC Code</Label>
                    <Input
                      id="alternate_bank_ifsc"
                      name="alternate_bank_ifsc"
                      value={formData.alternate_bank_ifsc}
                      onChange={handleChange}
                      placeholder="ABCD0123456"
                      maxLength={11}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternate_bank_branch">Branch Name</Label>
                    <Input
                      id="alternate_bank_branch"
                      name="alternate_bank_branch"
                      value={formData.alternate_bank_branch}
                      onChange={handleChange}
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {!id && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="account_number">Account Number *</Label>
                    <Input
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      required={!id}
                      placeholder="Enter unique account number (e.g., ACC001)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This account number will be manually assigned and must be unique.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="account_type">Account Type</Label>
                      <select
                        id="account_type"
                        name="account_type"
                        value={formData.account_type}
                        onChange={(e) =>
                          setFormData({ ...formData, account_type: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="savings">Savings</option>
                        <option value="current">Current</option>
                        <option value="fixed_deposit">Fixed Deposit</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="opening_balance">Opening Balance (₹)</Label>
                      <Input
                        id="opening_balance"
                        name="opening_balance"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.opening_balance}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Customer"
                        className="w-40 h-40 rounded-full object-cover border-4 border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 rounded-full"
                        onClick={handleRemovePhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                      <User className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </Button>

                  {uploading && (
                    <div className="w-full mt-4">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
                    <p>Supported formats: JPEG, PNG, WEBP, GIF</p>
                    <p>Maximum size: 1 MB</p>
                    <p>Filename: English letters and numbers only</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full" disabled={loading || uploading}>
                  {loading ? 'Saving...' : id ? 'Update Customer' : 'Create Customer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/banking/customers')}
                  disabled={loading || uploading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

