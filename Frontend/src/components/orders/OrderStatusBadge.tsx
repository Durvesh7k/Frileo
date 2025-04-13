
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  
  switch (status) {
    case "PENDING":
      variant = "outline";
      break;
    case "IN_PROGRESS":
      variant = "secondary";
      break;
    case "COMPLETED":
      variant = "default";
      break;
    case "CANCELLED":
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant}>
      {status.replace("_", " ")}
    </Badge>
  );
}
