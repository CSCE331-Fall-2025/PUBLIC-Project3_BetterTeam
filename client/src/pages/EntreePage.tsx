import React, {useEffect, useState} from "react";
import {EntreeCard} from "../components/EntreeComponents/EntreeCard.tsx";

export const EntreePage: React.FC = () => {
  const entrees = [
    {
      name: "Orange Chicken",
      price: 5.0,
      imageUrl: "../../assets/orangechick.PNG",
    },
    {
      name: "Beijing Beef",
      price: 6.0,
      imageUrl: "../../assets/beijing.PNG",
    },
    {
      name: "Honey Walnut Shrimp",
      price: 6.5,
      imageUrl: "../../assets/shrimp.PNG",
    },
    {
      name: "Broccoli Beef",
      price: 5.5,
      imageUrl: "../../assets/brocbeef.PNG",
    },
  ];

  return(
    <div className="min-h-screen bg-orange-50 p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Choose Your Entree</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {entrees.map((dish, index) => (
                <EntreeCard
                key={index}
                name={dish.name}
                price={dish.price}
                imageUrl={dish.imageUrl}
            />
            ))}
        </div>
    </div>
  );
};

export default EntreePage;