import { insertTransaction, insertTransactionDish } from "../models/transactionModel.js";
import { getInventoryForDish, decrementInventory, getInventoryItemById } from "../models/inventoryModel.js";

const ICE_ID = 58;

export async function createTransaction(req, res){
    try{
        const { cart, fk_customer, fk_employee } = req.body;
        if(!cart || cart.length === 0){
            return res.status(400).json({ error: "Cart is empty" });
        }

        const required = {};

        for(const dish of cart){
            const ingredients = await getInventoryForDish(dish.dish_id);
            const custom = dish.customization || {};

            for(const ing of ingredients){
                const invId = ing.fk_inventory;
                if(dish.type === "drink" && invId !== ICE_ID) continue;

                const level = custom[invId] || "normal";

                let amount = 1;
                if(level === "none") amount = 0;
                if(level === "extra") amount = 2;

                if(invId === ICE_ID){
                    const iceItem = await getInventoryItemById(ICE_ID);
                    if(iceItem.current_inventory <= 0){
                        amount = 0;
                    }
                }

                if(!required[invId]) required[invId] = 0;
                required[invId] += amount;
            }
        }

        for(const invId of Object.keys(required)){
            const needed = required[invId];
            if(needed === 0) continue;

            const item = await getInventoryItemById(invId);

            if(!item) continue;

            if(item.current_inventory < needed) {
                return res.status(400).json({
                    error: `Not enough ${item.item}! Need ${needed}, only ${item.current_inventory} available.`,
                    shortage: item.item
                });
            }
        }

        const total = cart.reduce((sum, dish) => sum + Number(dish.price), 0);
        const customerID = fk_customer ?? 26;
        const employeeID = fk_employee ?? 29;

        const transaction_id = await insertTransaction(
            customerID,
            employeeID,
            total
        );

        for(const dish of cart){
            await insertTransactionDish(transaction_id, dish.dish_id);

            const ingredients =  await getInventoryForDish(dish.dish_id);
            const custom = dish.customization || {};

            for(const ing of ingredients){
                const invId = ing.fk_inventory;

                if(dish.type === "drink" && invId !== ICE_ID) continue;

                const level = custom[invId] || "normal";

                let dec = 1;
                if(level === "none") dec = 0;
                if(level === "extra") dec = 2;

                if(invId === ICE_ID){
                    const iceItem = await getInventoryItemById(ICE_ID);
                    if(iceItem.current_inventory <= 0){
                        dec = 0;
                    }
                }

                if(dec > 0){
                    await decrementInventory(invId,dec);
                }
            }
        }

        return res.json({ message: "Transaction saved", transaction_id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create transaction"});
    }
}