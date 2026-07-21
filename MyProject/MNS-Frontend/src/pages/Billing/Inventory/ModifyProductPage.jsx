import React, { useEffect, useState } from 'react';
import PaginationTable from '../../../component/Table/PaginationTable';
import toast from 'react-hot-toast';

const getInventoryItemsURL = import.meta.env.VITE_GET_ALL_INVENTORY_ITEMS;

const ModifyProductPage = () => {
  const [inventoryData, setInventoryData] = useState([]);

  const getAllInventoryItems = async () => {
    try {
      const response = await fetch(getInventoryItemsURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
      if (!res?.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setInventoryData(res.data); // Store fetched data in state
    } catch (error) {
      toast.error("Error fetching inventory items");
      // console.error(error);
    }
  };

  useEffect(() => {
    getAllInventoryItems();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Modify Inventory Items</h2>
      <PaginationTable data={inventoryData} itemsPerPage={5} />
    </div>
  );
};

export default ModifyProductPage;