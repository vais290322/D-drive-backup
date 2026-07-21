import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/db/api";
import type { Customer, Product, LoanType, InterestType } from "@/types/types";
import { calculateEMI as calcEMI, calculateTotalInterest } from "@/utils/emiCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Calculator } from "lucide-react";

const loanSchema = z.object({
  loan_id_type: z.enum(["auto", "manual"]).default("auto"),
  loan_id_manual: z.string().optional(),
  customer_id: z.string().min(1, "Customer is required"),
  product_id: z.string().optional(),
  loan_type: z.string().min(1, "Loan type is required"),
  down_payment: z.string().optional(),
  principal_amount: z.string().min(1, "Principal amount is required"),
  processing_fee: z.string().optional(),
  insurance_fee: z.string().optional(),
  tenure_months: z.string().min(1, "Tenure is required"),
  interest_type: z.string().min(1, "Interest type is required"),
  interest_rate: z.string().min(1, "Interest rate is required"),
  start_date: z.string().min(1, "Start date is required"),
  first_emi_date: z.string().min(1, "First EMI date is required"),
  emi_day_of_month: z.string().min(1, "EMI day of month is required"),
  guarantor_name: z.string().optional(),
  guarantor_mobile: z.string().optional(),
  guarantor_address: z.string().optional(),
  guarantor_relation: z.string().optional(),
}).refine((data) => {
  if (data.loan_id_type === "manual" && !data.loan_id_manual) {
    return false;
  }
  return true;
}, {
  message: "Loan ID is required when manual generation is selected",
  path: ["loan_id_manual"],
}).refine((data) => {
  const day = Number(data.emi_day_of_month);
  return day >= 1 && day <= 31;
}, {
  message: "EMI day must be between 1 and 31",
  path: ["emi_day_of_month"],
});

type LoanFormData = z.infer<typeof loanSchema>;

export default function LoanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [calculatedValues, setCalculatedValues] = useState({
    totalInterest: 0,
    totalPayable: 0,
    installmentAmount: 0,
  });

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loan_id_type: "auto",
      loan_id_manual: "",
      customer_id: "",
      product_id: "",
      loan_type: "monthly",
      down_payment: "0",
      principal_amount: "",
      processing_fee: "0",
      insurance_fee: "0",
      tenure_months: "",
      interest_type: "flat",
      interest_rate: "",
      start_date: "",
      first_emi_date: "",
      emi_day_of_month: "1",
      guarantor_name: "",
      guarantor_mobile: "",
      guarantor_address: "",
      guarantor_relation: "",
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      // IMPORTANT: Load customers and products FIRST
      await loadData();

      // THEN load loan details if editing
      if (id) {
        setIsEditing(true);
        await loadLoanDetails(id);
      }
    };

    initializeForm();
  }, [id]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      calculateEMI(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const loadData = async () => {
    console.log('[LoanForm] Starting loadData...');
    try {
      console.log('[LoanForm] Fetching customers and products...');
      // Check if we are editing based on the ID param directly, 
      // as isEditing state might not be updated yet
      const isEditMode = !!id;

      const [customersData, productsData] = await Promise.all([
        api.customers.getAll(),
        // When editing, we need ALL products (not just available)
        // because the loan might be assigned to a product that's now "assigned" status
        isEditMode ? api.products.getAll() : api.products.getAvailable(),
      ]);
      console.log('[LoanForm] Customers fetched:', customersData);
      console.log('[LoanForm] Products fetched:', productsData);
      setCustomers(customersData);
      setProducts(productsData);
      console.log('[LoanForm] Data loaded successfully');
    } catch (error) {
      console.error("[LoanForm] Error loading data:", error);
      console.error("[LoanForm] Error details:", {
        message: error?.message,
        stack: error?.stack,
        error
      });
      toast.error("Failed to load data");
    }
  };


  const loadLoanDetails = async (loanId: string) => {
    try {
      setLoading(true);
      const loan = await api.loans.get(loanId);

      if (!loan) {
        throw new Error("Loan not found");
      }

      console.log('[LoanForm] Fetched loan for editing:', loan);

      // Extract customer_id (could be object or string)
      let customerId = '';
      if (typeof loan.customer_id === 'object' && loan.customer_id !== null) {
        customerId = loan.customer_id.id || loan.customer_id._id || '';
      } else if (typeof loan.customer_id === 'string') {
        customerId = loan.customer_id;
      }

      // Extract product_id (could be object, string, or null)
      let productId = 'none';
      if (loan.product_id) {
        if (typeof loan.product_id === 'object' && loan.product_id !== null) {
          productId = loan.product_id.id || loan.product_id._id || 'none';
        } else if (typeof loan.product_id === 'string') {
          productId = loan.product_id;
        }
      }

      console.log('[LoanForm] Extracted IDs:', { customerId, productId });

      form.reset({
        loan_id_type: "manual",
        loan_id_manual: loan.loan_id,
        customer_id: customerId,
        product_id: productId,
        loan_type: loan.loan_type,
        down_payment: String(loan.down_payment || 0),
        principal_amount: String(loan.principal_amount || 0),
        processing_fee: String(loan.processing_fee || 0),
        insurance_fee: String(loan.insurance_fee || 0),
        tenure_months: String(loan.tenure_months || 0),
        interest_type: loan.interest_type,
        interest_rate: String(loan.interest_rate || 0),
        start_date: loan.start_date ? new Date(loan.start_date).toISOString().split('T')[0] : "",
        first_emi_date: loan.first_emi_date ? new Date(loan.first_emi_date).toISOString().split('T')[0] : "",
        emi_day_of_month: String(loan.emi_day_of_month || 1),
        guarantor_name: loan.guarantor_name || "",
        guarantor_mobile: loan.guarantor_mobile || "",
        guarantor_address: loan.guarantor_address || "",
        guarantor_relation: loan.guarantor_relation || "",
      });

      calculateEMI(form.getValues());

    } catch (error) {
      console.error("Error loading loan:", error);
      toast.error("Failed to load loan details");
      navigate("/loans");
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = (values: Partial<LoanFormData>) => {
    const principal = Number(values.principal_amount) || 0;
    const processingFee = Number(values.processing_fee) || 0;
    const insuranceFee = Number(values.insurance_fee) || 0;
    const tenure = Number(values.tenure_months) || 1;
    const rate = Number(values.interest_rate) || 0;
    const interestType = (values.interest_type || "flat") as InterestType;
    const downPayment = Number(values.down_payment) || 0;
    const loanType = (values.loan_type || "monthly") as LoanType;

    const loanAmount = Math.max(0, principal - downPayment);
    const totalInterest = calculateTotalInterest(loanAmount, rate, tenure, interestType, loanType, processingFee, insuranceFee);

    const installmentAmount = calcEMI(principal, rate, tenure, interestType, loanType, processingFee, insuranceFee, downPayment);
    const totalPayable = loanAmount + totalInterest + processingFee + insuranceFee;

    setCalculatedValues({
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayable: Math.round(totalPayable * 100) / 100,
      installmentAmount: Math.round(installmentAmount * 100) / 100,
    });
  };

  const onSubmit = async (data: LoanFormData) => {
    try {
      setLoading(true);
      const loanData = {
        customer_id: data.customer_id || "",
        product_id: data.product_id === "none" ? null : data.product_id || null,
        loan_type: data.loan_type as "daily" | "weekly" | "monthly",
        down_payment: Number(data.down_payment) || 0,
        principal_amount: Number(data.principal_amount) || 0,
        processing_fee: Number(data.processing_fee) || 0,
        insurance_fee: Number(data.insurance_fee) || 0,
        tenure_months: Number(data.tenure_months) || 0,
        interest_type: data.interest_type as "flat" | "reducing",
        interest_rate: Number(data.interest_rate) || 0,
        total_interest: calculatedValues.totalInterest,
        total_payable: calculatedValues.totalPayable,
        installment_amount: calculatedValues.installmentAmount,
        start_date: data.start_date || "",
        first_emi_date: data.first_emi_date || "",
        emi_day_of_month: Number(data.emi_day_of_month) || 1,
        guarantor_name: data.guarantor_name || null,
        guarantor_mobile: data.guarantor_mobile || null,
        guarantor_address: data.guarantor_address || null,
        guarantor_relation: data.guarantor_relation || null,
        status: "active" as const,
        closed_date: null,
        created_by: null,
      };

      if (isEditing && id) {
        await api.loans.update(id, loanData);
        toast.success("Loan updated successfully");
      } else {
        const newLoanData = {
          ...loanData,
          loan_id: `LOAN-${Date.now()}`,
        }
        await api.loans.create(newLoanData, data.loan_id_type === "manual" ? data.loan_id_manual : undefined);
        toast.success("Loan created successfully");
      }

      navigate("/loans");
    } catch (error) {
      console.error("Error saving loan:", error);
      toast.error(isEditing ? "Failed to update loan" : "Failed to create loan");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Edit Loan" : "Create New Loan"}</h1>
          <p className="text-muted-foreground">{isEditing ? "Modify loan details" : "Disburse a new loan to a customer"}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="loan" className="w-full">
            <TabsList className="h-auto flex flex-wrap w-full md:grid md:grid-cols-3 gap-1">
              <TabsTrigger value="loan">Loan Details</TabsTrigger>
              <TabsTrigger value="calculation">EMI Calculation</TabsTrigger>
              <TabsTrigger value="guarantor">Guarantor</TabsTrigger>
            </TabsList>

            <TabsContent value="loan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="loan_id_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan ID Generation *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isEditing}
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

                  {form.watch("loan_id_type") === "manual" && (
                    <FormField
                      control={form.control}
                      name="loan_id_manual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan ID *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter loan ID (e.g., LOAN000001)" disabled={isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.full_name} ({customer.customer_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="product_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {products.map((product) => {
                              // Ensure we have a valid ID
                              const productId = product.id || (product as any)._id;
                              return (
                                <SelectItem key={productId} value={productId}>
                                  {product.brand} {product.model} ({product.product_code})
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="down_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter down payment" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loan_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="principal_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Principal Amount *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="processing_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Fee</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter fee" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insurance_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Fee</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter fee" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="first_emi_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First EMI Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emi_day_of_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EMI Day of Month *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          All EMIs will be due on this day each month. For months with fewer days, the last day will be used.
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    EMI Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tenure_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenure (Months) *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter tenure" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interest_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="reducing">Reducing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interest_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%) *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="Enter rate" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2 space-y-4 rounded-lg border bg-accent/10 p-4">
                    <h3 className="font-semibold">Calculated Values</h3>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-lg font-bold">{formatCurrency(calculatedValues.totalInterest)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Payable</p>
                        <p className="text-lg font-bold">{formatCurrency(calculatedValues.totalPayable)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">EMI Amount</p>
                        <p className="text-lg font-bold">{formatCurrency(calculatedValues.installmentAmount)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guarantor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guarantor Details (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="guarantor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guarantor_mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor Mobile</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guarantor_relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter relation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guarantor_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Guarantor Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter address" />
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
              onClick={() => navigate("/loans")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : (isEditing ? "Update Loan" : "Create Loan")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
