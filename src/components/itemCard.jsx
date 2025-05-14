import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const formattedDate = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="h-full flex flex-col animate-fade-in hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
          <Badge variant={item.isAvailable ? "default" : "outline"}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Added {formattedDate}</p>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {item.description || "No description"}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{item.category || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium">{item.quantity}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium text-green-600">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
