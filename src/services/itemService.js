import ItemModel from "../models/ItemModel";

/**
 * Service for handling item operations
 */
class ItemService {
  constructor() {
    // For demo purposes, we'll use localStorage instead of a real API
    this.storageKey = "snappy_items";
    this.initializeItems();
  }

  initializeItems() {
    // Check if we have items in localStorage
    const storedItems = localStorage.getItem(this.storageKey);

    if (!storedItems) {
      // Add some demo data if no items exist
      const demoItems = [
        new ItemModel({
          name: "Laptop",
          description: "MacBook Pro 16-inch",
          category: "Electronics",
          quantity: 5,
          price: 2399.99,
        }),
        new ItemModel({
          name: "Coffee Mug",
          description: "Ceramic coffee mug with logo",
          category: "Kitchen",
          quantity: 20,
          price: 12.99,
        }),
        new ItemModel({
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse",
          category: "Electronics",
          quantity: 15,
          price: 29.99,
        }),
        new ItemModel({
          name: "Notebook",
          description: "Hardcover notebook, 200 pages",
          category: "Office Supplies",
          quantity: 50,
          price: 4.99,
        }),
      ];

      this.saveItems(demoItems);
    }
  }

  async getAllItems() {
    // Simulate API call delay
    await this.simulateNetworkDelay();

    const items = this.getItemsFromStorage();
    return items;
  }

  async getItemById(id) {
    await this.simulateNetworkDelay();

    const items = this.getItemsFromStorage();
    const item = items.find((item) => item.id === id);

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async createItem(itemData) {
    await this.simulateNetworkDelay();

    const newItem = new ItemModel(itemData);
    const items = this.getItemsFromStorage();

    items.push(newItem);
    this.saveItems(items);

    return newItem;
  }

  async updateItem(id, itemData) {
    await this.simulateNetworkDelay();

    const items = this.getItemsFromStorage();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Item not found");
    }

    // Update the item but preserve its ID
    const updatedItem = new ItemModel({
      ...itemData,
      id: id,
      createdAt: items[index].createdAt,
    });

    items[index] = updatedItem;
    this.saveItems(items);

    return updatedItem;
  }

  async deleteItem(id) {
    await this.simulateNetworkDelay();

    const items = this.getItemsFromStorage();
    const filteredItems = items.filter((item) => item.id !== id);

    if (filteredItems.length === items.length) {
      throw new Error("Item not found");
    }

    this.saveItems(filteredItems);
    return true;
  }

  // Helper methods
  getItemsFromStorage() {
    const storedItems = localStorage.getItem(this.storageKey) || "[]";
    const parsedItems = JSON.parse(storedItems);
    return parsedItems.map((item) => ItemModel.fromJSON(item));
  }

  saveItems(items) {
    const serializedItems = items.map((item) => item.toJSON());
    localStorage.setItem(this.storageKey, JSON.stringify(serializedItems));
  }

  async simulateNetworkDelay() {
    // Simulate network delay for realistic API behavior
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
}

// Create a singleton instance
const itemService = new ItemService();
export default itemService;
