import React, { useState } from "react";
import { useItems } from "../contexts/itemContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Search, Plus } from "lucide-react";
import ItemCard from "./itemCard";
import ItemForm from "./itemForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Dashboard = () => {
  const { items, loading, error, deleteItem } = useItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [categoryStatsTab, setCategoryStatsTab] = useState("items");

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(items.map((item) => item.category)),
  ].filter(Boolean);

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && item.isAvailable) ||
      (availabilityFilter === "unavailable" && !item.isAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Calculate some stats
  const totalItems = items.length;
  const totalAvailable = items.filter((item) => item.isAvailable).length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Category stats for tab display
  const categoryStats = {};
  items.forEach((item) => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = {
        count: 0,
        value: 0,
      };
    }
    categoryStats[item.category].count += 1;
    categoryStats[item.category].value += item.price * item.quantity;
  });

  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
  };

  const confirmDelete = async () => {
    if (deleteItemId) {
      await deleteItem(deleteItemId);
      setDeleteItemId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Snappy Item Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your items efficiently and stay organized.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger
                value="categories"
                onClick={() => setCategoryStatsTab("items")}
              >
                Categories
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-2 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground">
                    Available
                  </p>
                  <p className="text-2xl font-bold">{totalAvailable}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border col-span-2 sm:col-span-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="categories" className="space-y-4 mt-2">
              <div className="flex space-x-2 mb-2">
                <TabsList className="grid grid-cols-2 w-full max-w-[200px]">
                  <TabsTrigger
                    value="items"
                    onClick={() => setCategoryStatsTab("items")}
                  >
                    By Items
                  </TabsTrigger>
                  <TabsTrigger
                    value="value"
                    onClick={() => setCategoryStatsTab("value")}
                  >
                    By Value
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="grid gap-2">
                {Object.entries(categoryStats).map(([category, stats]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 bg-card rounded-md border"
                  >
                    <span>{category}</span>
                    <span className="font-medium">
                      {categoryStatsTab === "items"
                        ? `${stats.count} items`
                        : `$${stats.value.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={availabilityFilter}
            onValueChange={setAvailabilityFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available Only</SelectItem>
              <SelectItem value="unavailable">Unavailable Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">Loading items...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-lg text-muted-foreground mb-2">No items found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm ||
            categoryFilter !== "all" ||
            availabilityFilter !== "all"
              ? "Try adjusting your filters or search term."
              : "Start by adding some items to your inventory."}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ItemForm
            item={currentItem}
            onCancel={() => {
              setShowForm(false);
              setCurrentItem(null);
            }}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
