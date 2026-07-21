import React, { useEffect, useState } from 'react';

const TeacherForm = ({ onSubmit, initialData = null, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    subjects: '',
    rfid: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        employeeId: initialData.employeeId || '',
        subjects: initialData.subjects || '',
        rfid: initialData.rfid || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      email: form.email,
      phone: form.phone,
      employeeId: form.employeeId,
      subjects: form.subjects,
      rfid: form.rfid
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name *" className="px-3 py-2 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 border rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border rounded" />
        <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" className="px-3 py-2 border rounded" />
        <input name="subjects" value={form.subjects} onChange={handleChange} placeholder="Subjects (comma separated)" className="px-3 py-2 border rounded" />
        <input name="rfid" value={form.rfid} onChange={handleChange} placeholder="RFID *" className="px-3 py-2 border rounded" required />
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer" disabled={loading} >
          {loading && <span className="mr-2">Saving...</span>}
          Save
          
          </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded cursor-pointer">Cancel</button>
      </div>
    </form>
  );
};

export default TeacherForm;