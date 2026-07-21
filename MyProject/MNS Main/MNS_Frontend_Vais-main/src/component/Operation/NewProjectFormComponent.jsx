import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { backendDomainR1 } from "../../Common/index";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { DeleteIcon } from "lucide-react";

const NewProjectFormComponent = ({ orderDetails }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Header information
    vendorCode: "",
    vendorName: "",
    commercialDate: "",
    state: "",

    // First section - Commercial For State minimum wages
    monthlyWage: "",
    category: "",
    workHours: "",
    invoiceAmount: null,
    workingDays: "",

    // Salary components
    basicWagesPercentage: "",
    basicWages: "",
    daPercentage: "",
    da: "",
    hraPercentage: "",
    hra: "",
    additionalDutyAllowancePercentage: "",
    additionalDutyAllowance: "",
    grossSalary: "",
    washingAllowance: "",
    subTotal1: "",

    //
    pfOnBasicPercentage: "",
    pfOnBasic: "",
    esiMedicalWcPercentage: "",
    esiMedicalWc: "",
    bonusPercentage: "",
    bonus: "",
    uniform: "",
    leaveOnMinimumWage: "",
    lwf: "",
    subTotal2: "",
    serviceChargesPercentage: "",
    serviceCharges: "",
    total: "",
    gst: "",

    // Second section - TAKE HOME SALARY
    thBasicWagesPercentage: "",
    thBasicWages: "",
    thDaPercentage: "",
    thDa: "",
    thHraPercentage: "",
    thHra: "",
    thAdditionalDutyAllowancePercentage: "",
    thAdditionalDutyAllowance: "",
    thGrossSalary: "",
    thWashingAllowance: "",
    thSubTotal1: "",

    // Take Home Deductions
    thPfOnSalaryPercentage: "",
    thPfOnSalary: "",
    thEsiMedicalWcPercentage: "",
    thEsiMedicalWc: "",
    thPTax: "",
    thTotalDeductions: "",
    thTakeHomeSalary: "",
    thBonusPercentage: "",
    thBonus: "",
    thActualEffectiveSalary: "",

    // Additional field
    siteName: "",
  });

  // console.log("orderDetails : ",orderDetails);

  // NEW: arrays to hold dynamic fields
  const [additionalDetails, setAdditionalDetails] = useState([]); // for main section
  const [thAdditionalDetails, setThAdditionalDetails] = useState([]); // for take-home additions
  const [thDeductionDetails, setThDeductionDetails] = useState([]); // for custom deductions

  // Add useEffect to handle orderDetails
  useEffect(() => {
    if (orderDetails) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vendorName: orderDetails.companyName || "",
        state: orderDetails.state || "",
      }));
    }
  }, [orderDetails]);

  // Helpers for dynamic lists
  const addAdditional = () => {
    setAdditionalDetails((prev) => [...prev, { description: "", amount: "" }]);
  };
  const updateAdditional = (index, field, value) => {
    setAdditionalDetails((prev) => {
      const p = [...prev];
      p[index] = { ...p[index], [field]: value };
      return p;
    });
  };
  const removeAdditional = (index) => {
    setAdditionalDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const addThAdditional = () => {
    setThAdditionalDetails((prev) => [
      ...prev,
      { description: "", amount: "" },
    ]);
  };
  const updateThAdditional = (index, field, value) => {
    setThAdditionalDetails((prev) => {
      const p = [...prev];
      p[index] = { ...p[index], [field]: value };
      return p;
    });
  };
  const removeThAdditional = (index) => {
    setThAdditionalDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const addThDeduction = () => {
    setThDeductionDetails((prev) => [...prev, { description: "", amount: "" }]);
  };
  const updateThDeduction = (index, field, value) => {
    setThDeductionDetails((prev) => {
      const p = [...prev];
      p[index] = { ...p[index], [field]: value };
      return p;
    });
  };
  const removeThDeduction = (index) => {
    setThDeductionDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Derived calculations: recalc whenever formData numeric inputs or dynamic arrays change
  useEffect(() => {
    const monthlyWage = parseFloat(formData.monthlyWage) || 0;

    // dynamic sums
    const addTotal = additionalDetails.reduce(
      (s, it) => s + (parseFloat(it.amount) || 0),
      0
    );
    const thAddTotal = thAdditionalDetails.reduce(
      (s, it) => s + (parseFloat(it.amount) || 0),
      0
    );
    const thDedTotal = thDeductionDetails.reduce(
      (s, it) => s + (parseFloat(it.amount) || 0),
      0
    );

    // For each field prefer percentage-based computation only when percentage is provided,
    // otherwise use the existing numeric value from formData (so manual entries are preserved).
    const basicWages =
      formData.basicWagesPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.basicWagesPercentage) || 0)) / 100
        : parseFloat(formData.basicWages) || 0;

    const da =
      formData.daPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.daPercentage) || 0)) / 100
        : parseFloat(formData.da) || 0;

    const hra =
      formData.hraPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.hraPercentage) || 0)) / 100
        : parseFloat(formData.hra) || 0;

    const additionalDutyAllowance =
      formData.additionalDutyAllowancePercentage !== ""
        ? (monthlyWage *
            (parseFloat(formData.additionalDutyAllowancePercentage) || 0)) /
          100
        : parseFloat(formData.additionalDutyAllowance) || 0;

    const grossSalary =
      formData.grossSalary !== ""
        ? parseFloat(formData.grossSalary) || 0
        : monthlyWage;

    const washingAllowance = parseFloat(formData.washingAllowance || 0);
    const subTotal1 = grossSalary + washingAllowance + addTotal; // include additionalDetails in subTotal1 if desired

    const pfOnBasic =
      formData.pfOnBasicPercentage !== ""
        ? (basicWages * (parseFloat(formData.pfOnBasicPercentage) || 0)) / 100
        : parseFloat(formData.pfOnBasic) || 0;

    const esiMedicalWc =
      formData.esiMedicalWcPercentage !== ""
        ? (basicWages * (parseFloat(formData.esiMedicalWcPercentage) || 0)) /
          100
        : parseFloat(formData.esiMedicalWc) || 0;

    const bonus =
      formData.bonusPercentage !== ""
        ? (7000 * (parseFloat(formData.bonusPercentage) || 0)) / 100
        : parseFloat(formData.bonus) || 0;

    const uniform = parseFloat(formData.uniform || 0);
    const lwf = parseFloat(formData.lwf || 0);

    const subTotal2 =
      subTotal1 + pfOnBasic + esiMedicalWc + bonus + uniform + lwf;

    const serviceCharges =
      formData.serviceChargesPercentage !== ""
        ? (subTotal2 * (parseFloat(formData.serviceChargesPercentage) || 0)) /
          100
        : parseFloat(formData.serviceCharges) || 0;

    const total = subTotal2 + serviceCharges;

    // TAKE HOME calculations — prefer percentage where provided, else use entered amounts
    const thBasicWages =
      formData.thBasicWagesPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.thBasicWagesPercentage) || 0)) /
          100
        : parseFloat(formData.thBasicWages) || 0;

    const thDa =
      formData.thDaPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.thDaPercentage) || 0)) / 100
        : parseFloat(formData.thDa) || 0;

    const thHra =
      formData.thHraPercentage !== ""
        ? (monthlyWage * (parseFloat(formData.thHraPercentage) || 0)) / 100
        : parseFloat(formData.thHra) || 0;

    const thAdditionalDutyAllowance =
      formData.thAdditionalDutyAllowancePercentage !== ""
        ? (monthlyWage *
            (parseFloat(formData.thAdditionalDutyAllowancePercentage) || 0)) /
          100
        : parseFloat(formData.thAdditionalDutyAllowance) || 0;

    const thGrossSalary =
      formData.thGrossSalary !== ""
        ? parseFloat(formData.thGrossSalary) || 0
        : monthlyWage;

    const thWashing = parseFloat(formData.thWashingAllowance || 0);

    // include thAdditionalDetails into thSubTotal1
    const thSubTotal1 = thGrossSalary + thWashing + thAddTotal;

    const thPfOnSalary =
      formData.thPfOnSalaryPercentage !== ""
        ? (thBasicWages * (parseFloat(formData.thPfOnSalaryPercentage) || 0)) /
          100
        : parseFloat(formData.thPfOnSalary) || 0;

    const thEsi =
      formData.thEsiMedicalWcPercentage !== ""
        ? (thBasicWages *
            (parseFloat(formData.thEsiMedicalWcPercentage) || 0)) /
          100
        : parseFloat(formData.thEsiMedicalWc) || 0;

    const thPTax = parseFloat(formData.thPTax || 0);

    const thTotalDeductions = thPfOnSalary + thEsi + thPTax + thDedTotal;

    const thTakeHomeSalary = thSubTotal1 - (thPfOnSalary + thEsi + thPTax);

    const thBonus =
      formData.thBonusPercentage !== ""
        ? (7000 * (parseFloat(formData.thBonusPercentage) || 0)) / 100
        : parseFloat(formData.thBonus) || 0;

    const thActualEffectiveSalary = thTakeHomeSalary + thBonus - thDedTotal;

    // update only changed fields
    setFormData((prev) => {
      const changed = {};
      if (prev.basicWages !== basicWages) changed.basicWages = basicWages;
      if (prev.da !== da) changed.da = da;
      if (prev.hra !== hra) changed.hra = hra;
      if (prev.additionalDutyAllowance !== additionalDutyAllowance)
        changed.additionalDutyAllowance = additionalDutyAllowance;
      if (prev.grossSalary !== grossSalary) changed.grossSalary = grossSalary;
      if (prev.subTotal1 !== subTotal1) changed.subTotal1 = subTotal1;
      if (prev.pfOnBasic !== pfOnBasic) changed.pfOnBasic = pfOnBasic;
      if (prev.esiMedicalWc !== esiMedicalWc)
        changed.esiMedicalWc = esiMedicalWc;
      if (prev.bonus !== bonus) changed.bonus = bonus;
      if (prev.subTotal2 !== subTotal2) changed.subTotal2 = subTotal2;
      if (prev.serviceCharges !== serviceCharges)
        changed.serviceCharges = serviceCharges;
      if (prev.total !== total) changed.total = total;

      if (prev.thBasicWages !== thBasicWages)
        changed.thBasicWages = thBasicWages;
      if (prev.thDa !== thDa) changed.thDa = thDa;
      if (prev.thHra !== thHra) changed.thHra = thHra;
      if (prev.thAdditionalDutyAllowance !== thAdditionalDutyAllowance)
        changed.thAdditionalDutyAllowance = thAdditionalDutyAllowance;
      if (prev.thGrossSalary !== thGrossSalary)
        changed.thGrossSalary = thGrossSalary;
      if (prev.thSubTotal1 !== thSubTotal1) changed.thSubTotal1 = thSubTotal1;
      if (prev.thPfOnSalary !== thPfOnSalary)
        changed.thPfOnSalary = thPfOnSalary;
      if (prev.thEsiMedicalWc !== thEsi) changed.thEsiMedicalWc = thEsi;
      if (prev.thTotalDeductions !== thTotalDeductions)
        changed.thTotalDeductions = thTotalDeductions;
      if (prev.thTakeHomeSalary !== thTakeHomeSalary)
        changed.thTakeHomeSalary = thTakeHomeSalary;
      if (prev.thBonus !== thBonus) changed.thBonus = thBonus;
      if (prev.thActualEffectiveSalary !== thActualEffectiveSalary)
        changed.thActualEffectiveSalary = thActualEffectiveSalary;

      if (Object.keys(changed).length === 0) return prev;
      return { ...prev, ...changed };
    });

    // dependencies: many inputs and the 3 dynamic arrays
  }, [
    formData.monthlyWage,
    formData.basicWagesPercentage,
    formData.daPercentage,
    formData.hraPercentage,
    formData.additionalDutyAllowancePercentage,
    formData.washingAllowance,
    formData.pfOnBasicPercentage,
    formData.esiMedicalWcPercentage,
    formData.bonusPercentage,
    formData.uniform,
    formData.lwf,
    formData.serviceChargesPercentage,
    formData.thBasicWagesPercentage,
    formData.thDaPercentage,
    formData.thHraPercentage,
    formData.thAdditionalDutyAllowancePercentage,
    formData.thWashingAllowance,
    formData.thPfOnSalaryPercentage,
    formData.thEsiMedicalWcPercentage,
    formData.thPTax,
    formData.thBonusPercentage,
    // include raw amount fields so manual edits are respected
    formData.basicWages,
    formData.da,
    formData.hra,
    formData.additionalDutyAllowance,
    formData.grossSalary,
    formData.thBasicWages,
    formData.thDa,
    formData.thHra,
    formData.thAdditionalDutyAllowance,
    formData.thGrossSalary,
    additionalDetails,
    thAdditionalDetails,
    thDeductionDetails,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Create new form data with the changed value
    let newFormData = {
      ...formData,
      [name]: value,
    };

    // Perform calculations based on monthly wage and percentages
    if (name === "monthlyWage" || name.includes("Percentage")) {
      const monthlyWage = parseFloat(newFormData.monthlyWage) || 0;

      // Commercial For State minimum wages calculations
      newFormData.basicWages =
        (monthlyWage * (parseFloat(newFormData.basicWagesPercentage) || 0)) /
        100;
      newFormData.da =
        (monthlyWage * (parseFloat(newFormData.daPercentage) || 0)) / 100;
      newFormData.hra =
        (monthlyWage * (parseFloat(newFormData.hraPercentage) || 0)) / 100;
      newFormData.additionalDutyAllowance =
        (monthlyWage *
          (parseFloat(newFormData.additionalDutyAllowancePercentage) || 0)) /
        100;
      newFormData.grossSalary = monthlyWage;

      // SubTotal1 calculation
      newFormData.subTotal1 =
        newFormData.grossSalary + parseFloat(newFormData.washingAllowance || 0);

      // Deductions calculations
      newFormData.pfOnBasic =
        (newFormData.basicWages *
          (parseFloat(newFormData.pfOnBasicPercentage) || 0)) /
        100;
      newFormData.esiMedicalWc =
        (newFormData.basicWages *
          (parseFloat(newFormData.esiMedicalWcPercentage) || 0)) /
        100;
      newFormData.bonus =
        (7000 * (parseFloat(newFormData.bonusPercentage) || 0)) / 100;

      // SubTotal2 calculation
      newFormData.subTotal2 =
        newFormData.subTotal1 +
        newFormData.pfOnBasic +
        newFormData.esiMedicalWc +
        newFormData.bonus +
        parseFloat(newFormData.uniform || 0) +
        parseFloat(newFormData.lwf || 0);

      // Service charges calculation
      newFormData.serviceCharges =
        (newFormData.subTotal2 *
          (parseFloat(newFormData.serviceChargesPercentage) || 0)) /
        100;
      newFormData.total = newFormData.subTotal2 + newFormData.serviceCharges;

      // TAKE HOME SALARY calculations
      newFormData.thBasicWages =
        (monthlyWage * (parseFloat(newFormData.thBasicWagesPercentage) || 0)) /
        100;
      newFormData.thDa =
        (monthlyWage * (parseFloat(newFormData.thDaPercentage) || 0)) / 100;
      newFormData.thHra =
        (monthlyWage * (parseFloat(newFormData.thHraPercentage) || 0)) / 100;
      newFormData.thAdditionalDutyAllowance =
        (monthlyWage *
          (parseFloat(newFormData.thAdditionalDutyAllowancePercentage) || 0)) /
        100;
      newFormData.thGrossSalary = monthlyWage;

      // Take Home SubTotal1 calculation
      newFormData.thSubTotal1 =
        newFormData.thGrossSalary +
        parseFloat(newFormData.thWashingAllowance || 0);

      // Take Home Deductions calculations
      newFormData.thPfOnSalary =
        (newFormData.thBasicWages *
          (parseFloat(newFormData.thPfOnSalaryPercentage) || 0)) /
        100;
      newFormData.thEsiMedicalWc =
        (newFormData.thBasicWages *
          (parseFloat(newFormData.thEsiMedicalWcPercentage) || 0)) /
        100;

      // Take Home Total Deductions
      newFormData.thTotalDeductions =
        newFormData.thPfOnSalary +
        newFormData.thEsiMedicalWc +
        parseFloat(newFormData.thPTax || 0);

      // Take Home Salary calculations
      newFormData.thTakeHomeSalary =
        newFormData.thSubTotal1 - newFormData.thTotalDeductions;
      newFormData.thBonus =
        (7000 * (parseFloat(newFormData.thBonusPercentage) || 0)) / 100;
      newFormData.thActualEffectiveSalary =
        newFormData.thTakeHomeSalary + newFormData.thBonus;
    }

    setFormData(newFormData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        ...formData,
        additionalDetails,
        thAdditionalDetails,
        thDeductionDetails,
      };

      // console.log("payload : ", payload);
      // return;
      // Send data to backend
      const response = await axios.post(
        `${backendDomainR1}/api/v1/payroll/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Salary details submitted successfully!");
        // Reset form
        resetForm();
      } else {
        throw new Error(
          response.data?.message || "Failed to submit salary details"
        );
      }
    } catch (error) {
      console.error("Error submitting salary details:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit salary details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      // Header information
      vendorCode: "",
      vendorName: "",
      commercialDate: "",
      state: "",

      // First section - Commercial For State minimum wages
      monthlyWage: "",
      category: "",
      workHours: "",
      invoiceAmount: null,
      workingDays: "",

      // Salary components
      basicWagesPercentage: "",
      basicWages: "",
      daPercentage: "",
      da: "",
      hraPercentage: "",
      hra: "",
      additionalDutyAllowancePercentage: "",
      additionalDutyAllowance: "",
      grossSalary: "",
      washingAllowance: "",
      subTotal1: "",

      // Deductions
      pfOnBasicPercentage: "",
      pfOnBasic: "",
      esiMedicalWcPercentage: "",
      esiMedicalWc: "",
      bonusPercentage: "",
      bonus: "",
      uniform: "",
      leaveOnMinimumWage: "",
      lwf: "",
      subTotal2: "",
      serviceChargesPercentage: "",
      serviceCharges: "",
      total: "",
      gst: "",

      // Second section - TAKE HOME SALARY
      thBasicWagesPercentage: "",
      thBasicWages: "",
      thDaPercentage: "",
      thDa: "",
      thHraPercentage: "",
      thHra: "",
      thAdditionalDutyAllowancePercentage: "",
      thAdditionalDutyAllowance: "",
      thGrossSalary: "",
      thWashingAllowance: "",
      thSubTotal1: "",

      // Take Home Deductions
      thPfOnSalaryPercentage: "",
      thPfOnSalary: "",
      thEsiMedicalWcPercentage: "",
      thEsiMedicalWc: "",
      thPTax: "",
      thTotalDeductions: "",
      thTakeHomeSalary: "",
      thBonusPercentage: "",
      thBonus: "",
      thActualEffectiveSalary: "",

      // Additional field
      siteName: "",
    });
    setAdditionalDetails([]);
    setThAdditionalDetails([]);
    setThDeductionDetails([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          ANNEXURE - 1
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          {formData.vendorName || "MNS SECURE SOLUTIONS PVT. LTD."} | CLIENT
          CODE: {formData.vendorCode || "VDR 01298"}
        </Typography>
        <Typography
          variant="subtitle2"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Commercial For State minimum wages as on{" "}
          {formData.commercialDate || "01.01.2025"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Header Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Code"
                name="vendorCode"
                value={formData.vendorCode}
                onChange={handleInputChange}
                placeholder="VDR 01298"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                placeholder="MNS SECURE SOLUTIONS PVT. LTD."
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commercial Date"
                name="commercialDate"
                value={formData.commercialDate}
                onChange={handleInputChange}
                placeholder="01.01.2025"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="West Bengal"
                required
              />
            </Grid>

            {/* Employee Information */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Security Guard"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Work Hours"
                name="workHours"
                value={formData.workHours}
                onChange={handleInputChange}
                placeholder="12 HRS * FULL MONTH"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Working Days"
                name="workingDays"
                value={formData.workingDays}
                onChange={handleInputChange}
                placeholder="12 HRS * FULL MONTH"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Monthly Wage / Invoice Amount
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Wage"
                name="monthlyWage"
                type="number"
                value={formData.monthlyWage}
                onChange={handleInputChange}
                placeholder="9990"
                required
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Amount"
                name="invoiceAmount"
                type="number"
                value={formData.invoiceAmount}
                onChange={handleInputChange}
                placeholder="100000"
                required
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Salary Components
              </Typography>
            </Grid> */}

            {/* Basic Wages */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Basic Wages %"
                name="basicWagesPercentage"
                type="number"
                value={formData.basicWagesPercentage}
                onChange={handleInputChange}
                placeholder="25"
                required
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Basic Wages"
                name="basicWages"
                type="number"
                value={formData.basicWages}
                onChange={handleInputChange}
                placeholder="2507"
                required
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* DA */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="DA %"
                name="daPercentage"
                type="number"
                value={formData.daPercentage}
                onChange={handleInputChange}
                placeholder="75"
                required
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="DA"
                name="da"
                type="number"
                value={formData.da}
                onChange={handleInputChange}
                placeholder="7483"
                required
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* HRA */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="HRA %"
                name="hraPercentage"
                type="number"
                value={formData.hraPercentage}
                onChange={handleInputChange}
                placeholder="0"
                required
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="HRA"
                name="hra"
                type="number"
                value={formData.hra}
                onChange={handleInputChange}
                placeholder="0"
                required
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Additional Duty Allowance */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Additional Duty Allowance %"
                name="additionalDutyAllowancePercentage"
                type="number"
                value={formData.additionalDutyAllowancePercentage}
                onChange={handleInputChange}
                placeholder="0"
                required
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Additional Duty Allowance"
                name="additionalDutyAllowance"
                type="number"
                value={formData.additionalDutyAllowance}
                onChange={handleInputChange}
                placeholder="0"
                required
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Gross Salary */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gross Salary"
                name="grossSalary"
                type="number"
                value={formData.grossSalary}
                onChange={handleInputChange}
                placeholder="9990"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Washing Allowance */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Washing/Other Allowance"
                name="washingAllowance"
                type="number"
                value={formData.washingAllowance}
                onChange={handleInputChange}
                placeholder="150"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Sub Total 1 */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sub Total 1"
                name="subTotal1"
                type="number"
                value={formData.subTotal1}
                onChange={handleInputChange}
                placeholder="10140"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12}>

            </Grid> */}

            {/* PF on Basic */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="PF on Basic %"
                name="pfOnBasicPercentage"
                type="number"
                value={formData.pfOnBasicPercentage}
                onChange={handleInputChange}
                placeholder="13"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="PF on Basic"
                name="pfOnBasic"
                type="number"
                value={formData.pfOnBasic}
                onChange={handleInputChange}
                placeholder="326"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* ESI/Medical/WC */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="ESI/Medical/WC %"
                name="esiMedicalWcPercentage"
                type="number"
                value={formData.esiMedicalWcPercentage}
                onChange={handleInputChange}
                placeholder="3.25"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="ESI/Medical/WC"
                name="esiMedicalWc"
                type="number"
                value={formData.esiMedicalWc}
                onChange={handleInputChange}
                placeholder="81"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label=" Bonus %"
                name="bonusPercentage"
                type="number"
                value={formData.bonusPercentage}
                onChange={handleInputChange}
                placeholder="0.00"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* Bonus */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bonus @ 7000/- Fixed per annum"
                name="bonus"
                type="number"
                value={formData.bonus}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Uniform */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Uniform"
                name="uniform"
                type="number"
                value={formData.uniform}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Leave on Minimum wage */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Leave on Minimum wage (04 Days National Holiday)"
                name="leaveOnMinimumWage"
                type="number"
                value={formData.leaveOnMinimumWage}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* LWF */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LWF"
                name="lwf"
                type="number"
                value={formData.lwf}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Sub Total 2 */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sub Total 2"
                name="subTotal2"
                type="number"
                value={formData.subTotal2}
                onChange={handleInputChange}
                placeholder="10547"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Service Charges */}
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Service Charges %"
                name="serviceChargesPercentage"
                type="number"
                value={formData.serviceChargesPercentage}
                onChange={handleInputChange}
                placeholder="10.00"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Service Charges"
                name="serviceCharges"
                type="number"
                value={formData.serviceCharges}
                onChange={handleInputChange}
                placeholder="1055"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* Total */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total"
                name="total"
                type="number"
                value={formData.total}
                onChange={handleInputChange}
                placeholder="11602"
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid> */}

            {/* GST */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST as applicable as per Govt. Norms"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                placeholder="As applicable as per Govt. Norms"
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <Button
                onClick={addAdditional}
                startIcon={<FaPlus />}
                variant="contained"
                size="small"
                sx={{ mb: 1 }}
              >
                Add New additional field
              </Button>

              {additionalDetails.map((it, idx) => (
                <Grid container spacing={1} key={`add-${idx}`} alignItems="center" sx={{ mb: 1 }}>
                  <Grid item xs={6} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={it.description}
                      onChange={(e) => updateAdditional(idx, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={it.amount}
                      onChange={(e) => updateAdditional(idx, 'amount', e.target.value)}
                      InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                    />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <IconButton onClick={() => removeAdditional(idx)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid> */}

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom align="center">
                TAKE HOME SALARY
              </Typography>
            </Grid>

            {/* Take Home Basic Wages */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Basic Wages %"
                name="thBasicWagesPercentage"
                type="number"
                value={formData.thBasicWagesPercentage}
                onChange={handleInputChange}
                placeholder="25.1"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Basic Wages"
                name="thBasicWages"
                type="number"
                value={formData.thBasicWages}
                onChange={handleInputChange}
                placeholder="2507"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home DA */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH DA %"
                name="thDaPercentage"
                type="number"
                value={formData.thDaPercentage}
                onChange={handleInputChange}
                placeholder="74.9"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH DA"
                name="thDa"
                type="number"
                value={formData.thDa}
                onChange={handleInputChange}
                placeholder="7483"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home HRA */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH HRA %"
                name="thHraPercentage"
                type="number"
                value={formData.thHraPercentage}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH HRA"
                name="thHra"
                type="number"
                value={formData.thHra}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Additional Duty Allowance */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Additional Duty %"
                name="thAdditionalDutyAllowancePercentage"
                type="number"
                value={formData.thAdditionalDutyAllowancePercentage}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Additional Duty"
                name="thAdditionalDutyAllowance"
                type="number"
                value={formData.thAdditionalDutyAllowance}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Gross Salary */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TH Gross Salary"
                name="thGrossSalary"
                type="number"
                value={formData.thGrossSalary}
                onChange={handleInputChange}
                placeholder="9990"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Washing Allowance */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TH Washing/Other Allowance"
                name="thWashingAllowance"
                type="number"
                value={formData.thWashingAllowance}
                onChange={handleInputChange}
                placeholder="150"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Sub Total 1 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TH Sub Total 1"
                name="thSubTotal1"
                type="number"
                value={formData.thSubTotal1}
                onChange={handleInputChange}
                placeholder="10140"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={addThAdditional}
                startIcon={<FaPlus />}
                variant="contained"
                size="small"
                sx={{ mb: 1 }}
              >
                Add New additional field (Take Home)
              </Button>

              {thAdditionalDetails.map((it, idx) => (
                <Grid
                  container
                  spacing={1}
                  key={`thadd-${idx}`}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={6} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={it.description}
                      onChange={(e) =>
                        updateThAdditional(idx, "description", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={it.amount}
                      onChange={(e) =>
                        updateThAdditional(idx, "amount", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>₹</Typography>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <IconButton
                      onClick={() => removeThAdditional(idx)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Take Home Deductions
              </Typography>
            </Grid>

            {/* Take Home PF on Salary */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH PF on Salary %"
                name="thPfOnSalaryPercentage"
                type="number"
                value={formData.thPfOnSalaryPercentage}
                onChange={handleInputChange}
                placeholder="12"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH PF on Salary"
                name="thPfOnSalary"
                type="number"
                value={formData.thPfOnSalary}
                onChange={handleInputChange}
                placeholder="301"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home ESI/Medical/WC */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH ESI/Medical/WC %"
                name="thEsiMedicalWcPercentage"
                type="number"
                value={formData.thEsiMedicalWcPercentage}
                onChange={handleInputChange}
                placeholder="0.75"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH ESI/Medical/WC"
                name="thEsiMedicalWc"
                type="number"
                value={formData.thEsiMedicalWc}
                onChange={handleInputChange}
                placeholder="19"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home P. Tax */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TH P. Tax"
                name="thPTax"
                type="number"
                value={formData.thPTax}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Total Deductions */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TH Total Deductions"
                name="thTotalDeductions"
                type="number"
                value={formData.thTotalDeductions}
                onChange={handleInputChange}
                placeholder="320"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Salary */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Take Home Salary (Full Month)"
                name="thTakeHomeSalary"
                type="number"
                value={formData.thTakeHomeSalary}
                onChange={handleInputChange}
                placeholder="9820"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Take Home Bonus */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Bonus %"
                name="thBonusPercentage"
                type="number"
                value={formData.thBonusPercentage}
                onChange={handleInputChange}
                placeholder="0.00"
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      %
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="TH Bonus @ 7000/- Fixed per annum"
                name="thBonus"
                type="number"
                value={formData.thBonus}
                onChange={handleInputChange}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Actual Effective Salary */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Actual Effective Salary per month"
                name="thActualEffectiveSalary"
                type="number"
                value={formData.thActualEffectiveSalary}
                onChange={handleInputChange}
                placeholder="9820"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      ₹
                    </Typography>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={addThDeduction}
                startIcon={<FaMinus />}
                variant="contained"
                size="small"
                sx={{ mb: 1 }}
              >
                Add New deduction field
              </Button>

              {thDeductionDetails.map((it, idx) => (
                <Grid
                  container
                  spacing={1}
                  key={`thded-${idx}`}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={6} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={it.description}
                      onChange={(e) =>
                        updateThDeduction(idx, "description", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={it.amount}
                      onChange={(e) =>
                        updateThDeduction(idx, "amount", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>₹</Typography>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <IconButton
                      onClick={() => removeThDeduction(idx)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{ mr: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={resetForm}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewProjectFormComponent;
