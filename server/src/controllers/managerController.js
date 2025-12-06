// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getXReport, getZReport } from "../models/managerModel.js";

export async function xReport(req, res) {
    try {
        const items = await getXReport();
        res.json(items);
    } catch (err) {
        console.error("Error fetching X-Report:", err);
        res.status(500).json({ error: "Failed to fetch X-Report" });
    }
}

export async function zReport(req, res) {
    try {
        const items = await getZReport();
        res.json(items);
    } catch (err) {
        console.error("Error fetching Z-Report:", err);
        res.status(500).json({ error: "Failed to fetch Z-Report" });
    }
}