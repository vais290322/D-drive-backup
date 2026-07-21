import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Plus, Minus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_DEMO;

const EditPurchaseDialog = ({
  open,
  setOpen,
  invoice,
  schoolId,
  onUpdated,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  // const schoolId = useSelector((state) => state.auth.schoolId);

  /* ================= STATE ================= */
  const [items, setItems] = useState([
    {
      name: "",
      item_code: "",
      category: "",
      subcategory: "",
      unit: "",
      qty: 0,
      price: 0,
      total: 0,
      subCategories: [],
      suggestions: [],
      showSuggestions: false,
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [allCategory, setCategories] = useState([
    { _id: null, name: "", description: "", isNew: true },
  ]);
  const [PurchaseNo, setPurchaseNo] = useState("");
  const [purchaseDate, setpurchaseDate] = useState("");
  const [phoneNumber, setphoneNumber] = useState(null);
  const [sellerName, setsellerName] = useState("");
  const [address, setaddress] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    if (!invoice) return;
    setForm(JSON.parse(JSON.stringify(invoice)));
    setPurchaseNo(invoice.purchaseNo || "");
    setpurchaseDate(
      invoice.date ? new Date(invoice.date).toISOString().split("T")[0] : ""
    );
    setsellerName(invoice.sellerName || "");
    setphoneNumber(invoice.sellerPhone || "");
    setaddress(invoice.sellerAddress || "");
    setDiscount(invoice.discount || 0);
    const mappedItems = invoice.items.map((item) => ({
      name: item.name || "",
      item_code: item.code || "",
      category: item.categoryId || "",
      subcategory: item.subCategoryId || "",
      unit: item.unit || "",
      qty: item.quantity || 0,
      price: item.price || 0,
      total: item.totalPrice || 0,
      subCategories: [],
      suggestions: [],
      showSuggestions: false,
    }));
    const updatedItems = await Promise.all(
      mappedItems.map(async (item) => {
        if (item.category) {
          const subCats = await fetchSubCategoriesByCategory(item.category);
          return { ...item, subCategories: subCats };
        }
        return item;
      })
    );
    setItems(
      updatedItems.length > 0
        ? updatedItems
        : [
            {
              name: "",
              item_code: "",
              category: "",
              subcategory: "",
              unit: "",
              qty: 0,
              price: 0,
              total: 0,
              subCategories: [],
              suggestions: [],
              showSuggestions: false,
            },
          ]
    );
  };

  useEffect(() => {
    loadData();
  }, [invoice]);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/${schoolId}`);
      if (res.data.status) {
        setCategories(res.data.data);
        // console.log("category", res.data.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */

  const fetchSubCategoriesByCategory = async (categoryId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/subcategories/${categoryId}/${schoolId}`
      );

      // console.log("SUB API RESPONSE", res.data);

      return res.data.data || [];
    } catch (error) {
      toast.error("Failed to fetch subcategories");
      return [];
    }
  };

  /* ================= FETCH SEARCH ================= */

  const searchItems = async (query) => {
    if (!query) return [];

    try {
      const res = await axios.get(
        `${BASE_URL}/api/inventory/search/${schoolId}?search=${query}`
      );

      return res.data.data || [];
    } catch (error) {
      return [];
    }
  };

  const handleCategoryChange = async (index, categoryId) => {
    if (!categoryId) return;

    const updated = [...items];
    updated[index].category = categoryId;
    updated[index].subcategory = "";

    const subCats = await fetchSubCategoriesByCategory(categoryId);
    updated[index].subCategories = subCats;

    setItems(updated);
  };

  /* ================= ROUND OFF LOGIC ================= */
  const calculateRoundOff = (amount) => {
    const decimal = amount - Math.floor(amount);
    if (decimal >= 0.5) {
      return +(1 - decimal).toFixed(2);
    }
    return -decimal.toFixed(2);
  };

  /* ================= ITEM HANDLERS ================= */
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    updated[index].total =
      Number(updated[index].qty) * Number(updated[index].price);

    setItems(updated);
  };

  const handleItemNameChange = async (index, value) => {
    const updated = [...items];
    updated[index].name = value;

    if (value.length >= 2) {
      const results = await searchItems(value);
      updated[index].suggestions = results;
      updated[index].showSuggestions = true;
    } else {
      updated[index].suggestions = [];
      updated[index].showSuggestions = false;
    }

    setItems(updated);
  };

  const handleSelectItem = async (index, item) => {
    // console.log("handleSelectItem called with index:", index, "item:", item);

    const updated = [...items];

    // Extract values safely
    const itemName = item.name;
    const itemCode = item.code;
    const itemCategory = item.category;
    const itemCategoryId = item.categoryId;
    // const itemSubcategory =item.subCategory;
    const itemsubCategoryId = item.subCategoryId;
    const itemUnit = item.unit;
    const itemPrice = item.price || 0;

    if (itemCategory) {
      const subCats = await fetchSubCategoriesByCategory(itemCategoryId);
      // console.log(subCats);
      updated[index].subCategories = subCats;
    }

    updated[index] = {
      ...updated[index],
      name: itemName,
      item_code: itemCode,
      category: itemCategoryId,
      subcategory: itemsubCategoryId,
      unit: itemUnit,
      price: parseFloat(itemPrice),
      qty: 1,
      total: parseFloat(itemPrice) * 1,
      showSuggestions: false,
      suggestions: [],
      // subCategories:[]
    };

    // console.log("Updated item at index", index, ":", updated[index]);
    // console.log("About to call setItems with:", updated);
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        name: "",
        item_code: "",
        category: "",
        subcategory: "",
        unit: "",
        qty: 0,
        price: 0,
        total: 0,
        subCategories: [],
        suggestions: [],
        showSuggestions: false,
      },
    ]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  /* ================= TOTAL CALCULATIONS ================= */
  const grossTotal = items.reduce((sum, i) => sum + i.total, 0);
  const afterDiscount = grossTotal - Number(discount || 0);
  const roundOffValue = calculateRoundOff(afterDiscount);
  const payableAmount = afterDiscount + roundOffValue;

  /* ================= DROPDOWNS ================= */
  const allUnit = ["Unit", "Pcs", "Kg", "Gm", "Ltr", "Ml", "Dozen", "Other"];

  const buildPurchasePayload = () => {
    return {
      purchaseNo: PurchaseNo,
      date: new Date(purchaseDate),
      sellerName,
      sellerPhone: phoneNumber,
      sellerAddress: address,

      items: items.map((item) => {
        const categoryObj = allCategory.find((c) => c._id === item.category);
        const subCategoryObj = item.subCategories.find(
          (sc) => sc._id === item.subcategory
        );

        return {
          name: item.name,
          code: item.item_code,
          categoryId: item.category,
          subCategoryId: item.subcategory,
          category: categoryObj?.name || "",
          subCategory: subCategoryObj?.name || "",
          unit: item.unit,
          quantity: Number(item.qty),
          price: Number(item.price),
          totalPrice: Number(item.total),
        };
      }),

      grossAmount: Number(grossTotal),
      discount: Number(discount),
      netAmount: Number(afterDiscount),
      roundOff: Number(roundOffValue),
      totalAmount: Number(payableAmount),
    };
  };

  const resetForm = () => {
    setPurchaseNo("");
    setpurchaseDate("");
    setsellerName("");
    setphoneNumber("");
    setaddress("");
    setDiscount(0);
    setItems([
      {
        name: "",
        item_code: "",
        category: "",
        subcategory: "",
        unit: "",
        qty: 0,
        price: 0,
        total: 0,
        subCategories: [],
        suggestions: [],
        showSuggestions: false,
      },
    ]);
  };

  const handleSavePurchase = async () => {
    try {
      setSaving(true);
      const payload = buildPurchasePayload();

      const res = await axios.put(
        `${BASE_URL}/api/purchase/update/${schoolId}/${invoice._id}`,
        payload
      );
      if (res.data.success) {
        toast.success(res.data.message || "Purchase updated successfully");
        onUpdated();
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update purchase"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full ${
    theme === "light"
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300"
  }`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`max-w-6xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Edit Purchase</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto px-2 py-2">
          {form ? (
            <>
              {/* ================= PURCHASE INFO ================= */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Purchase No *</Label>
                  <Input
                    className={inputClass}
                    type="text"
                    value={PurchaseNo}
                    onChange={(e) => setPurchaseNo(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    className={inputClass}
                    value={purchaseDate}
                    onChange={(e) => setpurchaseDate(e.target.value)}
                  />
                </div>
              </div>

              {/* ================= SELLER DETAILS ================= */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                  <Label>Seller Name *</Label>
                  <Input
                    className={inputClass}
                    type="text"
                    value={sellerName}
                    onChange={(e) => setsellerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    className={inputClass}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setphoneNumber(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Address</Label>
                  <Input
                    className={inputClass}
                    type="text"
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                  />
                </div>
              </div>

              {/* ================= ITEMS TABLE ================= */}
              <div className=" rounded-lg border mb-6 ">
                <table className="min-w-full text-sm">
                  <thead
                    className={`${
                      isDark
                        ? "bg-[#112038] text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <tr>
                      <th className="px-3 py-2">SL</th>
                      <th className="px-3 py-2">Item Name</th>
                      <th className="px-3 py-2">Item Code</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Sub Category</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-t ">
                        <td className="px-3 py-2">{index + 1}</td>

                        <td className="px-3 py-2 relative">
                          <Input
                            className={inputClass}
                            value={item.name}
                            onChange={(e) =>
                              handleItemNameChange(index, e.target.value)
                            }
                          />

                          {item.showSuggestions &&
                            item.suggestions.length > 0 && (
                              <ul
                                className={`absolute z-50  border rounded w-full max-h-40 overflow-y-auto shadow-md ${
                                  isDark ? "bg-[#112038]" : "bg-gray-100"
                                }`}
                              >
                                {item.suggestions.map((s) => (
                                  <li
                                    key={s._id}
                                    className="px-3 py-2  cursor-pointer"
                                    onClick={() => handleSelectItem(index, s)}
                                  >
                                    <div
                                      className={`font-medium ${
                                        isDark
                                          ? " text-gray-200"
                                          : " text-gray-700"
                                      }`}
                                    >
                                      {s.name}
                                    </div>
                                    <div
                                      className={`text-xs  ${
                                        isDark
                                          ? " text-gray-200"
                                          : " text-gray-700"
                                      }`}
                                    >
                                      Code: {s.code}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </td>

                        <td className="px-3 py-2">
                          <Input
                            className={inputClass}
                            value={item.item_code}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "item_code",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <select
                            className={`p-2 rounded border w-40 ${inputClass}`}
                            value={item.category}
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {allCategory.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className={`p-2 rounded border w-40 ${inputClass}`}
                            value={item.subcategory}
                            disabled={!item.category}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "subcategory",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            {item.subCategories.map((sc) => (
                              <option key={sc._id} value={sc._id}>
                                {sc.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3  py-2 w-32">
                          <select
                            className={`p-2 rounded border ${inputClass}`}
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {allUnit.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            className={inputClass}
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            className={inputClass}
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(index, "price", e.target.value)
                            }
                          />
                        </td>

                        <td className="px-3 py-2 text-right font-medium">
                          ₹{item.total.toFixed(2)}
                        </td>

                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={addRow}
                            className="text-green-500 mr-2"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeRow(index)}
                            disabled={items.length === 1}
                            className="text-red-500"
                          >
                            <Minus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================= TOTALS ================= */}
              <div className="flex justify-end mb-6">
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="flex justify-between">
                    <span>Gross Amount</span>
                    <span>₹{grossTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <Input
                      type="number"
                      className={`${inputClass} w-28 text-right`}
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between">
                    <span>Round Off</span>
                    <span>₹{roundOffValue.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Payable Amount</span>
                    <span>₹{payableAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ================= SAVE ================= */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSavePurchase}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Updating..." : "Update Purchase"}
                </Button>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPurchaseDialog;
