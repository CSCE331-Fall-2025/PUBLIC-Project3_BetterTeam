import express from "express";
import { createTransaction } from "../controllers/transactionController.js";

const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

// so chat this is the paypal access token for the api and it is used to authenticate the requests to the paypal api
const getAccessToken = async () => {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get access token: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
};

// and this is the route for creating a paypal order and it is used to create a paypal order for the customer
router.post("/create-order", async (req, res) => {
    try {
        const { cart } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const total = cart.reduce((sum, dish) => sum + Number(dish.price), 0);

        const accessToken = await getAccessToken();

        const orderData = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: Number(total).toFixed(2)
                    },
                    description: "Restaurant Order"
                }
            ]
        };

        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "PayPal-Request-Id": `order-${Date.now()}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.text();
            return res.status(response.status).json({ error: `PayPal API error: ${error}` });
        }

        const order = await response.json();
        res.json({ orderId: order.id });
    } catch (err) {
        console.error("Error creating PayPal order:", err);
        res.status(500).json({ error: "Failed to create PayPal order" });
    }
});

// this is the route for capturing a paypal payment and it is used to capture a paypal payment for the customer
router.post("/capture-order", async (req, res) => {
    try {
        const { orderId, cart, fk_customer, fk_employee } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const accessToken = await getAccessToken();

        // this is the request to capture the payment
        const captureResponse = await fetch(
            `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );

        if (!captureResponse.ok) {
            const error = await captureResponse.text();
            return res.status(captureResponse.status).json({ error: `PayPal capture error: ${error}` });
        }

        const captureData = await captureResponse.json();

        // this is the request to create a transaction in the database
        if (captureData.status === "COMPLETED" && cart) {
            try {
                const transactionReq = {
                    body: { cart, fk_customer, fk_employee }
                };
                // this is the request to create a transaction in the database
                let transactionResult = null;
                const transactionRes = {
                    json: (data) => {
                        transactionResult = data;
                        return transactionRes;
                    },
                    status: (code) => ({
                        json: (data) => {
                            transactionResult = { status: code, ...data };
                            return transactionRes;
                        }
                    })
                };

                await createTransaction(transactionReq, transactionRes);
            } catch (transactionError) {
                console.error("Error creating transaction:", transactionError);
                // this handles the error if the transaction fails to be created
                return res.status(500).json({ 
                    error: "Payment captured but failed to save transaction",
                    paypalOrderId: orderId
                });
            }
        }

        res.json({
            status: captureData.status,
            orderId: captureData.id,
            paypalOrderId: orderId
        });
    } catch (err) {
        console.error("Error capturing PayPal order:", err);
        res.status(500).json({ error: "Failed to capture PayPal order" });
    }
});

export default router;
