import { useEffect, useState } from "react";
import type { Order } from "../../components/KitchenComponents/OrderCard";
import { OrderBox } from "../../components/KitchenComponents/OrderBox";
import "./kitchen.css";


function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders on mount
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    setOrders(stored ? JSON.parse(stored) : []);
  }, []);

  // Centralized updater
  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
  };

  return (
    <div className="kitchen-page">
      <div className="slots">
        <OrderBox
          title="Not Started"
          slot={0}
          orders={orders.filter(o => o.slot === 0)}
          onUpdateOrders={updateOrders}
        />
        <OrderBox
          title="Started"
          slot={1}
          orders={orders.filter(o => o.slot === 1)}
          onUpdateOrders={updateOrders}
        />
        <OrderBox
          title="Completed"
          slot={2}
          orders={orders.filter(o => o.slot === 2)}
          onUpdateOrders={updateOrders}
        />
      </div>
    </div>
  );
}

export default Kitchen;

