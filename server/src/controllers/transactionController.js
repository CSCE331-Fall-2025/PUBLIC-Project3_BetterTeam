import { insertTransaction, insertTransactionDish } from "../models/transactionModel.js";
import { getInventoryForDish, decrementInventory } from "../models/inventoryModel.js";

export async function createTransaction(req, res){
    try{
        const{ cart, fk_customer, fk_employee } = req.body;

        if(!cart || cart.length === 0){
            return res.status(400).json({ error: "Cart is empty" });
        }

        const total = cart.reduce((sum, dish) => sum + dish.price, 0);
        // temporary hardcoded employee and customer until login is fully finished
        const customerID = fk_customer ?? 11;
        const employeeID = fk_employee ?? 15;

        const transaction_id = await insertTransaction(
            customerID,
            employeeID,
            total
        );

        for(const dish of cart){
            await insertTransactionDish(transaction_id, dish.dish_id);

            const ingredients =  await getInventoryForDish(dish.dish_id);
            for(const item of ingredients){
                await decrementInventory(item.fk_inventory);
            }
        }

        return res.json({ message: "Transaction saved", transaction_id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create transaction"});
    }
}