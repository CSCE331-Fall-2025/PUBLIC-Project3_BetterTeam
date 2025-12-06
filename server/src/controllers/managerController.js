// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getXReport, getZReport, getDailyReportDates, getDailyReportByDate } from "../models/managerModel.js";

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

        if(err.code === '23505' && err.constraint === "dailyreports_report_date_key"){
            return res.status(409).json({ error: "Z Report already exists"});
        }
        res.status(500).json({ error: "Failed to fetch Z-Report: ", err});
    }
}

export async function getDailyReports(req, res) {
    const { date } = req.query;

    try {
        let reports;
        if(date){
            reports = await getDailyReportByDate(date);
            if(!reports){
                return res.status(404).json({ error: `Report for ${date} not found.`});
            }
        } else{
            reports = await getDailyReportDates();
        }

        res.json(reports);

    } catch (err) {
        console.error("Error fetching daily reports:", err);
        res.status(500).json({ error: "Failed to fetch daily reports" });
    }
}