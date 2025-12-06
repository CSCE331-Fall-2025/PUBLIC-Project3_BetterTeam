import { insertTransaction, insertTransactionDish } from "../models/transactionModel.js";
import { getInventoryForDish, decrementInventory } from "../models/inventoryModel.js";

const ICE_ID = 58;

export async function createTransaction(req, res){
    try{
        console.log("Incoming Body:", req.body);

        const { cart, fk_customer, fk_employee } = req.body;

        console.log("Parsed cart:", cart);
        console.log("CustomerID:", fk_customer, "EmployeeID:", fk_employee);

        if(!cart || cart.length === 0){
            return res.status(400).json({ error: "Cart is empty" });
        }

        const total = cart.reduce((sum, dish) => sum + dish.price, 0);
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
            for(const item of ingredients){
                const invId = item.fk_inventory;
                const customLevels = dish.customization || {};
                const level = customLevels[invId] || "normal";
                
                let decrementBy = 1;
                if(level === "none") decrementBy = 0;
                else if (level === "extra") decrementBy = 2;

                if(decrementBy > 0){
                    await decrementInventory(invId, decrementBy);
                }
            }

            if(dish.type === "drink"){
                const customIceLevel = dish.customization?.[ICE_ID] ?? "normal";

                let iceDecrement = 0;

                if(customIceLevel === "normal") iceDecrement = 1;
                if(customIceLevel === "extra") iceDecrement = 2;
                if(customIceLevel === "none") iceDecrement = 0;

                if (iceDecremenet > 0) {
                    await decrementInventory(ICE_ID, iceDecrement);
                }
            }
        }

        return res.json({ message: "Transaction saved", transaction_id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create transaction"});
    }
}