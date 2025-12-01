console.log(">>> FROM MenuBoard.tsx! <<<");

import { useEffect, useState } from 'react';
import { MenuBox } from '../../components/MenuComponents/MenuBox.tsx'
import './MenuBoard.css'

const API_BASE = import.meta.env.VITE_API_BASE;

export interface Dish{
  dish_id: number;
  name: string;
  price: number;
  type: string;
  imageUrl?: string;
}


function MenuBoard() {
  const [entrees, setEntrees] = useState<Dish[]>([]);
  const [sides, setSides] = useState<Dish[]>([]);
  const [drinks, setDrinks] = useState<Dish[]>([]);
  const [apps, setApps] = useState<Dish[]>([]);

  useEffect(() => {
    async function load() {
      try{
        console.log("Fetching Dishes...");
        const res = await fetch(`${API_BASE}/api/dishes`);
        console.log("Response status:", res.status);
        const all: Dish[] = await res.json();
        console.log("Dishes from backend", all);

        setEntrees(all.filter(d => d.type.toLowerCase() === "entree"));
        setSides(all.filter(d => d.type.toLowerCase() === "side"));
        setDrinks(all.filter(d => d.type.toLowerCase() === "drink"));

        setApps(
          all.filter(d => {
            const t = d.type.toLowerCase();
            return t === "appetizer" || t === "app";
          })
        );

      } catch(err){
        console.error("Failed to fetch menu:", err);
      }
    }
    load();
  }, []);

  return(
    <div className='board'>
      <MenuBox title="Entrees" dishes={entrees}/>
      <MenuBox title="Sides" dishes={sides}/>
      <MenuBox title="Drinks" dishes={drinks}/>
      <MenuBox title="Apps" dishes={apps}/>
    </div>
  );
}

export default MenuBoard;
