import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:6060/api/v1"; // backend port

const App = () => {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);

  // ✅ Fetch schema & products on load
  useEffect(() => {
    fetchSchema();
    fetchProducts();
  }, []);

  const fetchSchema = async () => {
    try {
      const res = await axios.get(`${API_BASE}/schema/get-schema/Product`);
      if (res.data?.data) {
        setSchema(res.data.data);
      } else {
        // first-time initialization
        const defaultSchema = {
          schemaName: "Product",
          fields: [
            { fieldName: "name", fieldType: "string", required: true },
            { fieldName: "description", fieldType: "string", required: true },
            { fieldName: "price", fieldType: "number", required: true },
            { fieldName: "category", fieldType: "string", required: true },
          ],
        };
        await axios.post(`${API_BASE}/schema/upsert-schema`, defaultSchema);
        setSchema(defaultSchema);
      }
    } catch (error) {
      console.error("Error fetching schema", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/get-products`);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // ✅ Handle form input
  const handleChange = (e, fieldName, fieldType) => {
    let value = e.target.value;
    if (fieldType === "number") value = Number(value);
    setFormData({ ...formData, [fieldName]: value });
  };

  // ✅ Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/products/create`, formData);
      setFormData({});
      fetchProducts();
      alert("Product added!");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  // ✅ Add new field to schema
  const addFieldToSchema = () => {
    const updated = {
      ...schema,
      fields: [
        ...schema.fields,
        { fieldName: "", fieldType: "string", required: false },
      ],
    };
    setSchema(updated);
  };

  // ✅ Update existing field
  const updateSchemaField = (index, key, value) => {
    const updated = { ...schema };
    updated.fields[index][key] = value;
    setSchema(updated);
  };

  // ✅ Save schema persistently
  const saveSchema = async () => {
    try {
      await axios.post(`${API_BASE}/schema/upsert-schema`, schema);
      alert("Schema updated & saved!");
      fetchSchema();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating schema");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dynamic Product System
          </h1>
          <p className="text-gray-600">Manage products with dynamic schema configuration</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ✅ Dynamic Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">+</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Add Product</h2>
            </div>
            {schema ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {schema.fields.map((field, i) => (
                  <div key={i} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.fieldName}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={field.fieldType === "number" ? "number" : "text"}
                      value={formData[field.fieldName] || ""}
                      onChange={(e) =>
                        handleChange(e, field.fieldName, field.fieldType)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required={field.required}
                      placeholder={`Enter ${field.fieldName}`}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Save Product
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading schema...</span>
              </div>
            )}
          </div>

          {/* ✅ Product List */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">📦</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Products ({products.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-gray-100 transition-colors duration-200">
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(p).map(([k, v]) => (
                          k !== '_id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt' && (
                            <div key={k} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600 capitalize">{k}:</span>
                              <span className="text-sm text-gray-800 font-semibold">{v?.toString()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📭</div>
                  <p className="text-gray-500">No products found</p>
                  <p className="text-gray-400 text-sm">Add your first product using the form</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Schema Builder */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">⚙️</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Schema Configuration</h2>
          </div>
          
          <div className="space-y-4">
            {schema &&
              schema.fields.map((field, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Field Name</label>
                      <input
                        type="text"
                        placeholder="Field Name"
                        value={field.fieldName}
                        onChange={(e) =>
                          updateSchemaField(index, "fieldName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Field Type</label>
                      <select
                        value={field.fieldType}
                        onChange={(e) =>
                          updateSchemaField(index, "fieldType", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            updateSchemaField(index, "required", e.target.checked)
                          }
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Required</span>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const updated = { ...schema };
                          updated.fields.splice(index, 1);
                          setSchema(updated);
                        }}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={addFieldToSchema}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              + Add Field
            </button>
            <button
              onClick={saveSchema}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Save Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;