import React, { useEffect, useState } from "react";
import Table from "../../componants/components/contactUs/Table";
import axios from "axios";
import { getContactUs } from "../../config/config";

const API_URL = `${getContactUs.contactUsUrl}`;

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data.contacts || []);
    } catch (err) {
      toast.error("Failed to fetch contacts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Contact deleted successfully.");
      fetchContacts();
    } catch (err) {
      toast.error("Failed to delete contact.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Contact Us Enquiries</h2>
      </div>
      <Table
        data={contacts}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ContactUs;