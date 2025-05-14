class ItemModel {
  constructor({
    id = null,
    name = "",
    description = "",
    category = "",
    quantity = 0,
    price = 0,
    createdAt = new Date(),
    isAvailable = true,
  }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.price = price;
    this.createdAt =
      createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.isAvailable = isAvailable;
  }

  static fromJSON(json) {
    return new ItemModel({
      ...json,
      createdAt: new Date(json.createdAt),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      createdAt: this.createdAt.toISOString(),
      isAvailable: this.isAvailable,
    };
  }
}

export default ItemModel;
