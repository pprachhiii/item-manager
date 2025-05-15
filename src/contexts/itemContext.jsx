import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import itemService from "../services/itemService";

// Create context
const itemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all items on initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items");
      toast.error("Failed to load items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get item by ID
  const getItem = async (id) => {
    try {
      setLoading(true);
      const item = await itemService.getItemById(id);
      setSelectedItem(item);
      return item;
    } catch (err) {
      setError("Failed to get item details");
      toast.error("Failed to load item details");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new item
  const createItem = async (itemData) => {
    try {
      setLoading(true);
      const newItem = await itemService.createItem(itemData);
      setItems((prevItems) => [...prevItems, newItem]);
      toast.success("Item created successfully!");
      return newItem;
    } catch (err) {
      setError("Failed to create item");
      toast.error("Failed to create item");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing item
  const updateItem = async (id, itemData) => {
    try {
      setLoading(true);
      const updatedItem = await itemService.updateItem(id, itemData);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedItem : item))
      );
      toast.success("Item updated successfully!");
      return updatedItem;
    } catch (err) {
      setError("Failed to update item");
      toast.error("Failed to update item");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      setLoading(true);
      await itemService.deleteItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!");
      return true;
    } catch (err) {
      setError("Failed to delete item");
      toast.error("Failed to delete item");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    items,
    loading,
    error,
    selectedItem,
    fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
  };

  return <itemContext.Provider value={value}>{children}</itemContext.Provider>;
};

// Custom hook to use the item context
export const useItems = () => {
  const context = useContext(itemContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemProvider");
  }
  return context;
};

export default itemContext;
