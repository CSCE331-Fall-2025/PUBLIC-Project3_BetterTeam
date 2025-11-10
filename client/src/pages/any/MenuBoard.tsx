import React from 'react'
import { DishBox } from '../../components/DishComponents/DishBox.tsx'
import './MenuBoard.css'

const page = {
    name: 'Menu-Board',
    user: 'Any',
};

export interface Dish{
    name: string;
    price: number;
    imageUrl?: string;
}

const allEntrees: Dish[] = [
  { name: "Orange Chicken", price: 7, imageUrl: "../../../assets/orangechick.PNG" },
  { name: "Beijing Beef", price: 7, imageUrl: "../../../assets/beijing.PNG" },
  { name: "Honey Walnut Shrimp", price: 8, imageUrl: "../../../assets/shrimp.PNG" },
  { name: "Broccoli Beef", price: 6, imageUrl: "../../../assets/brocbeef.PNG" },
  { name: "Kung Pao Chicken", price: 7, imageUrl: "../../../assets/kungpao.PNG" }
];

const allSides: Dish[] = [
  { name: "Fried Rice", price: 4, imageUrl: "../../../assets/ricefried.PNG" },
  { name: "Chow Mein", price: 4, imageUrl: "../../../assets/chowmein.PNG" },
];

const allDrinks: Dish[] = [
  { name: "Coke", price: 4, imageUrl: "../../../assets/coke.PNG" },
  { name: "Dr. Pepper", price: 3, imageUrl: "../../../assets/drp.PNG" },
];

const allApps: Dish[] = [
  { name: "Cream Cheese Rangoon", price: 3, imageUrl: "../../../assets/rangoon.PNG" },
  { name: "Veggie Spring Roll", price: 3, imageUrl: "../../../assets/veggieroll.PNG" },
];

function MenuBoard() {
    return(
        <>
            <DishBox title={'Entrees'} dishes = {allEntrees}/>  
            <DishBox title={'Sides'} dishes = {allSides}/>
            <DishBox title={'Drinks'} dishes = {allDrinks}/>
            <DishBox title={'Apps'} dishes = {allApps}/>
        </>
    );
}

export default MenuBoard;
