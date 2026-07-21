import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileInvoice, FaBoxOpen, FaChartLine, FaCalendarAlt, FaBell } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import urls from '../common/url'
import toast from 'react-hot-toast';
import axios from 'axios';
import { backendDomainR1 } from '../common/index'
import { User } from 'lucide-react';
import { SentimentSatisfiedRounded } from '@mui/icons-material';
import { Button } from "@mui/material";

const { getAllInvoicesUrl } = urls;

const allInvoiceMNS = import.meta.env.VITE_REACT_FETCH_INVOICE_MNS;
const allInvoiceSnigdha = import.meta.env.VITE_REACT_FETCH_INVOICE;

const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS
const fetchSnigdhaInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN
const getEmployeeUri = import.meta.env.VITE_REACT_GET_EMPLOYEE;

const DashboardPage = () => {
  const [allinvoice, setAllInvoice] = useState([])
  const [allinvoiceSnigdha, setAllInvoiceSnigdha] = useState([])
  const [clients, setClients] = useState([]);
  const [currentInventory, setCurrentInventory] = useState([]);
  const [SnigdhaCurrentInventory, setSnigdhaCurrentInventory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewReport, setViewReport] = useState(null);

    console.log("projects : ", projects)

  const getAllInvoices = async () => {
    try {
      const getAllData = await fetch(allInvoiceMNS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonData = await getAllData.json()
      // console.log("Invoice Data", jsonData) 
      if (jsonData?.success) {
        // toast.success("Successfully fetched Invoice Data")
        setAllInvoice(jsonData.data || [])
      }

    } catch (error) {
      toast.error("Server error")
      // console.error(error)
    }
  }

  const getAllInvoicesSnigdha = async () => {
    try {
      const getAllData = await fetch(allInvoiceSnigdha, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonData = await getAllData.json()
      if (jsonData.success) {
        // toast.success("Successfully fetched Invoice Data")
        setAllInvoiceSnigdha(jsonData.data || [])
      }

    } catch (error) {
      toast.error("Server error")
      // console.error(error)
    }
  }



  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/mns/crm`
      );
      setClients(response?.data?.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchCurrentInventory = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        fetchInventoryUrl
      );
      setCurrentInventory(response?.data?.data);
      if (response?.data?.success) {
        // toast.success(response?.data?.message)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      // setLoading(false);
    }
  };

  const fetchSnigdhaInventory = async () => {
    try {
      const response = await axios.get(fetchSnigdhaInventoryUrl);
      // console.log("res: ",response)
      setSnigdhaCurrentInventory(response?.data?.data);
    } catch (error) {
      // console.error("Error fetching employees", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(getEmployeeUri);
      // console.log("res: ",response)
      setEmployees(response?.data?.data);
    } catch (error) {
      // console.error("Error fetching employees", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/task`);
      // console.log("response : ", response);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProjects = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/payroll/fetch/wage-Details`);
      // console.log("response : ",response);
      if (response) {
        setProjects(response?.data?.data || []);
      }
    } catch (error) {
      // toast.error('Failed to fetch projects');
      // console.error('Error fetching projects:', error);
    } finally {
      // setLoading(false);
    }
  };

const fetchComplaints = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/site-visits`);
      // console.log("response : ",response);
      if (response.data.success) {
        setComplaints(
          response?.data?.data.filter(
            (site) => site?.complaints?.trim() !== ""
          ) || []
        );
      }
    } catch (error) {
      // toast.error('Failed to fetch projects');
      // console.error('Error fetching projects:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
    fetchClients();
    fetchCurrentInventory();
    fetchEmployees();
    fetchTasks();
    fetchProjects();
    getAllInvoicesSnigdha();
    fetchSnigdhaInventory();
    fetchComplaints();
  }, [])

  const TotalInvoice = allinvoice?.length + allinvoiceSnigdha?.length;
  const TotalCustomer = clients?.length;
  const TotalInventory = currentInventory?.length;
  const TotalEmployee = employees?.length;
  const TotalProjects = projects?.length;



  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Update loading state based on actual data
    if (allinvoice?.length > 0 || clients?.length > 0 || currentInventory?.length > 0 || employees?.length > 0) {
      setLoading(false);
    }
  }, [allinvoice, clients, currentInventory, employees]);
  // Define default inventory data first before using it
  const inventoryData = [
    { name: 'In Stock', value: 50, color: '#4ade80' },
    { name: 'Low Stock', value: 10, color: '#facc15' },
    { name: 'Out of Stock', value: 0, color: '#f87171' },
  ];

  // Calculate inventory status data from real inventory
  const calculateInventoryStatus = (inventory) => {
    if (!inventory || inventory?.length === 0) return inventoryData;

    const inStock = inventory?.filter(item => (parseInt(item?.quantity) || 0) > 10)?.length;
    const lowStock = inventory?.filter(item => (parseInt(item?.quantity) || 0) > 0 && (parseInt(item?.quantity) || 0) <= 10)?.length;
    const outOfStock = inventory?.filter(item => (parseInt(item?.quantity) || 0) === 0)?.length;

    const total = inStock + lowStock + outOfStock || 1; // Avoid division by zero

    return [
      { name: 'In Stock', value: Math.round((inStock / total) * 100), color: '#4ade80', count: inStock },
      { name: 'Low Stock', value: Math.round((lowStock / total) * 100), color: '#facc15', count: lowStock },
      { name: 'Out of Stock', value: Math.round((outOfStock / total) * 100), color: '#f87171', count: outOfStock },
    ];
  };

  // Calculate task status data
  const calculateTaskStatus = () => {
    if (!data || data?.length === 0) return [];

    const pendingTasks = data.filter(task => task?.taskStatus === 'pending' || task?.taskStatus === 'Pending');
    const inProgressTasks = data.filter(task => task?.taskStatus === 'in-progress' || task?.taskStatus === 'In Progress');
    const completedTasks = data.filter(task => task?.taskStatus === 'completed' || task?.taskStatus === 'Completed');
    const otherTasks = data.filter(task =>
      task?.taskStatus !== 'pending' &&
      task?.taskStatus !== 'Pending' &&
      task?.taskStatus !== 'in-progress' &&
      task?.taskStatus !== 'In Progress' &&
      task?.taskStatus !== 'completed' &&
      task?.taskStatus !== 'Completed'
    );

    return [
      {
        name: 'Pending',
        value: pendingTasks?.length,
        color: '#f97316',
        tasks: pendingTasks.map(task => task?.taskName || 'Unnamed Task')
      },
      {
        name: 'In Progress',
        value: inProgressTasks?.length,
        color: '#3b82f6',
        tasks: inProgressTasks.map(task => task?.taskName || 'Unnamed Task')
      },
      {
        name: 'Completed',
        value: completedTasks?.length,
        color: '#22c55e',
        tasks: completedTasks.map(task => task?.taskName || 'Unnamed Task')
      },
      {
        name: 'Other',
        value: otherTasks?.length,
        color: '#94a3b8',
        tasks: otherTasks.map(task => task?.taskName || 'Unnamed Task')
      },
    ];
  };
  // Get real inventory data
  const realInventoryData = calculateInventoryStatus(currentInventory);
  const snigdhaInventoryData = calculateInventoryStatus(SnigdhaCurrentInventory);
  const taskStatusData = calculateTaskStatus();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back to MNS Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={TotalCustomer}
          icon={<FaUsers className="text-blue-500" />}
          loading={loading}
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard
          title="Total Invoices"
          value={TotalInvoice}
          icon={<FaFileInvoice className="text-purple-500" />}
          loading={loading}
          trend="+2.4%"
          trendUp={true}
        />
        <StatCard
          title="Inventory Items in mns"
          value={TotalInventory}
          icon={<FaBoxOpen className="text-green-500" />}
          loading={loading}
          trend="+1.8%"
          trendUp={true}
        />
        <StatCard
          title="Total Employee"
          value={TotalEmployee}
          icon={<FaUsers className="text-orange-500" />}
          loading={loading}
          trend="+8.1%"
          trendUp={true}
        />
        <StatCard
          title="Total Projects"
          value={TotalProjects}
          icon={<FaChartLine className="text-indigo-500" />}
          loading={loading}
          trend="+3.5%"
          trendUp={true}
        />
      </div>

      {/* Charts Section - REPLACED REVENUE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status in MNS</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={realInventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {realInventoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.count || 0} items)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status in Snigdha</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={snigdhaInventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {snigdhaInventoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.count || 0} items)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

         <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Complaints
          </h2>

          {/* Viewport */}
          <div className="h-80 overflow-hidden relative">
            {/* Animated track */}
            <div className="absolute top-0 left-0 w-full animate-scroll">
              {[
                ...complaints
              ].map((complaint, index) => (
                <p
                  key={index}
                  className="whitespace-nowrap py-1 text-red-700 font-semibold cursor-pointer"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  {complaint.siteName}
                </p>
              ))}
            </div>
          </div>
        </div>
    


        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Status</h2>
          <div className="h-80 flex items-center justify-center">
            {taskStatusData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStatusData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const taskList = props.payload.tasks || [];
                      return [
                        <div>
                          <div><strong>{value} tasks</strong></div>
                          {taskList?.length > 0 && (
                            <ul className="mt-1 pl-4 list-disc">
                              {taskList.slice(0, 5).map((task, i) => (
                                <li key={i} className="text-xs">{task}</li>
                              ))}
                              {taskList?.length > 5 && (
                                <li className="text-xs italic">...and {taskList?.length - 5} more</li>
                              )}
                            </ul>
                          )}
                        </div>,
                        name
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      padding: '0.5rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No task data available
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Additional Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Invoice Value</h3>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(allinvoice?.reduce((sum, inv) => sum + (parseFloat(inv?.grandTotal) || 0), 0) /
                (allinvoice?.length || 1))}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Invoices This Month</h3>
            <p className="text-xl font-bold text-gray-800">
              {allinvoice?.filter(inv => {
                const invDate = new Date(inv?.date);
                const now = new Date();
                return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
              })?.length}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Inventory Value in mns</h3>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(currentInventory?.reduce((sum, item) =>
                sum + ((parseInt(item?.quantity) || 0) * (parseFloat(item?.unit_prize) || 0)), 0))}
            </p>
          </div>
          {/* <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Tasks</h3>
            <p className="text-xl font-bold text-gray-800">
              {data?.filter(task =>
                task?.taskStatus !== 'completed' && task?.taskStatus !== 'Completed')?.length}
            </p>
          </div> */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Projects</h3>
            <p className="text-xl font-bold text-gray-800">
              {projects?.filter(project =>
                project?.status !== 'completed' && project?.status !== 'Completed')?.length}
            </p>
          </div>
        </div>
      </div>

      {/* Project Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Project Management</h2>
          {/* <a href="/projects" className="text-blue-600 text-sm hover:underline">View All Projects</a> */}
        </div>

        {/* Project Status Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Started</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {projects?.filter(project =>
                project?.currentStatus === 'started' || project?.currentStatus === 'started')?.length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {projects?.filter(project =>
                project?.currentStatus === 'in-progress' || project?.currentStatus === 'In Progress')?.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {projects?.filter(project =>
                project?.currentStatus === 'completed' || project?.currentStatus === 'Completed')?.length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">On Hold </h3>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {projects?.filter(project =>
                project?.currentStatus === 'on-hold' || project?.currentStatus === 'on-hold')?.length}
            </p>
          </div>
        </div> */}

        {/* Recent Projects */}
        <h3 className="text-md font-medium text-gray-700 mb-3">Recent 5 Projects</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th> 
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects?.slice(-5).reverse().map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{project?.siteName || "N/A"}</td>
                   <td className="px-4 py-3 text-sm text-gray-900">{project?.vendorName || "N/A"}</td> 
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {project?.state || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {project?.category || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">
                    {Number(project?.total).toFixed(2) || "N/A"}
                  </td>
                  {/* <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${project?.currentStatus === 'completed' || project?.currentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                        project?.currentStatus === 'in-progress' || project?.currentStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          project?.currentStatus === 'on-hold' || project?.currentStatus === 'on-hold' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}
                    >
                      {project?.currentStatus || "N/A"}
                    </span>
                  </td> */}
                </tr>
              ))}
              {projects?.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-sm text-gray-500 text-center">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent 5 Invoices from MNS </h2>
            {/* <a href="/view-invoice" className="text-blue-600 text-sm hover:underline">View All</a> */}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allinvoice?.slice(0, 8).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice?.invoiceNumber || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice?.receiverDetails?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{invoice?.date || new Date(invoice?.createDate).toLocaleDateString() || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(invoice?.grandTotal || "N/A")}</td>
                    {/* <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {invoice.status}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent 5 Invoices from Snigdha </h2>
            {/* <a href="/view-invoice" className="text-blue-600 text-sm hover:underline">View All</a> */}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allinvoiceSnigdha?.slice(0, 8).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice?.invoiceNumber || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice?.receiverDetails?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{invoice?.date || new Date(invoice?.createDate).toLocaleDateString() || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(invoice?.grandTotal || "N/A")}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent 5 Tasks</h2>
            <a href="#" className="text-blue-600 text-sm hover:underline">View Calendar</a>
          </div>
          <div className="space-y-4">
            {data?.slice(-5).reverse().map((task) => (
              <div key={task.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full mr-3 
                  ${task.taskPrioritization === 'High' ? 'bg-red-500' :
                    task.taskPrioritization === 'Medium' ? 'bg-yellow-500' :
                      'bg-blue-500'}`}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{task?.taskName}</h3>
                    <span className="text-xs text-gray-500">{task?.taskPrioritization}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <FaCalendarAlt className="mr-1" />
                    <span>Due: {task?.taskEndDate}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <User className="mr-1 w-4 h-4" />
                    <span>Employee Name : {task?.employeeName}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <SentimentSatisfiedRounded className="mr-1" fontSize='15px' />
                    <span>Task Status : {task?.taskStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
{selectedComplaint && (
        <Modal onClose={() => setSelectedComplaint(null)}>
          <div className="p-6 space-y-6 w-full relative">
            <button
              type="button"
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-red-500 font-bold text-2xl cursor-pointer z-20"
            >
              &times;
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-blue-700">
                Complaint Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {selectedComplaint.date}
              </div>
              <div>
                <span className="font-semibold">Time:</span>{" "}
                {selectedComplaint.time}
              </div>
              <div>
                <span className="font-semibold">Site:</span>{" "}
                {selectedComplaint.siteName}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Complaints:</span>{" "}
                {selectedComplaint.complaints}
              </div>
            </div>
            <Button
              variant="outlined"
              color="primary"
              className="w-full"
              onClick={() => {
                setViewReport(selectedComplaint);
                setSelectedComplaint(null);
              }}
            >
              View Details
            </Button>
          </div>
        </Modal>
      )}

      {viewReport && (
        <Modal onClose={() => setViewReport(null)}>
          <div className="p-6 space-y-6 w-full relative">
            <button
              type="button"
              onClick={() => setViewReport(null)}
              className="absolute top-4 right-4 text-red-500 font-bold text-2xl cursor-pointer z-20"
            >
              &times;
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-blue-700">
                Report Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Date:</span> {viewReport.date}
              </div>
              <div>
                <span className="font-semibold">Time:</span> {viewReport.time}
              </div>
              <div>
                <span className="font-semibold">Executive:</span>{" "}
                {viewReport.executiveName}
              </div>
              <div>
                <span className="font-semibold">Site:</span>{" "}
                {viewReport.siteName}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Address:</span>{" "}
                {viewReport.locationAddress || viewReport.address}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Observations:</span>{" "}
                {viewReport.observations}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Complaints:</span>{" "}
                {viewReport.complaints}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Questions & Answers
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                        #
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                        Question
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                        Answer
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewReport.checklistItems || []).map((q, i) => (
                      <tr key={q.id || i}>
                        <td className="px-2 py-1 text-xs">{i + 1}</td>
                        <td className="px-2 py-1 text-xs">{q.description}</td>
                        <td
                          className={`px-2 py-1 text-sm font-bold ${
                            q.status === "Yes"
                              ? "text-green-500"
                              : q.status === "No"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {q.status}
                        </td>
                        <td className="px-2 py-1 text-xs">{q.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, loading, trend, trendUp }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
      {!loading && trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

// --- Modal Dialog Overlay ---
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 backdrop-blur-[8px]" onClick={onClose}></div>
    <div className="relative z-10 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-5xl">
      {children}
    </div>
  </div>
);

export default DashboardPage;