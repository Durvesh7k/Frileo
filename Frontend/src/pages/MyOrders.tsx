
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/providers/AuthProvider";
import { Package, PackageCheck, Eye } from "lucide-react";
import { orders } from "@/data/mock";
import { Order } from "@/types";

export default function MyOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "buyer") {
      return user && order.buyerId === user.id;
    } else {
      return user && order.sellerId === user.id;
    }
  });

  const handleCompleteOrder = (orderId: string) => {
    // In a real application, this would call an API
    console.log("Marking order as completed:", orderId);
    toast({
      title: "Order completed",
      description: "The order has been marked as completed",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">
            Manage your orders, track their status, and communicate with your clients.
          </p>
        </div>

        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as "buyer" | "seller")}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="buyer" className="flex items-center gap-2">
              <Package size={16} />
              Orders I've Made
            </TabsTrigger>
            <TabsTrigger value="seller" className="flex items-center gap-2">
              <PackageCheck size={16} />
              Orders I've Received
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyer" className="animate-fade-in">
            <OrdersTable 
              orders={filteredOrders} 
              showSellerInfo={true}
              actionButton={
                (order) => (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/orders/${order.id}`} className="flex items-center gap-2">
                      <Eye size={16} /> View Details
                    </a>
                  </Button>
                )
              }
            />
          </TabsContent>

          <TabsContent value="seller" className="animate-fade-in">
            <OrdersTable 
              orders={filteredOrders} 
              showBuyerInfo={true}
              actionButton={
                (order) => (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/orders/${order.id}`} className="flex items-center gap-1">
                        <Eye size={14} /> View
                      </a>
                    </Button>
                    
                    {order.status === "IN_PROGRESS" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteOrder(order.id)}
                        className="flex items-center gap-1"
                      >
                        <PackageCheck size={14} /> Complete
                      </Button>
                    )}
                  </div>
                )
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface OrdersTableProps {
  orders: Order[];
  showSellerInfo?: boolean;
  showBuyerInfo?: boolean;
  actionButton: (order: Order) => React.ReactNode;
}

function OrdersTable({ orders, showSellerInfo, showBuyerInfo, actionButton }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-2 text-sm text-gray-500">
          You don't have any orders {showSellerInfo ? "placed" : "received"} yet.
        </p>
        <Button className="mt-4" asChild>
          <a href="/gigs">Explore Gigs</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gig</TableHead>
            {showSellerInfo && <TableHead>Seller</TableHead>}
            {showBuyerInfo && <TableHead>Buyer</TableHead>}
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.gigTitle}</TableCell>
              {showSellerInfo && <TableCell>{order.sellerName}</TableCell>}
              {showBuyerInfo && <TableCell>{order.buyerName}</TableCell>}
              <TableCell>${order.price.toFixed(2)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{actionButton(order)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
