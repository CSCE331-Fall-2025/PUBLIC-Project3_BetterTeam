import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ZReport } from "../pages/manager/Dashboard";

const API_BASE = import.meta.env.VITE_API_BASE;

interface ReportContextValue {
  zReportData: ZReport | null;
  setZReportData: (report: ZReport | null) => void;
  fetchTodaysReport: () => Promise<void>;
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [zReportData, setZReportDataState] = useState<ZReport | null>(null);

  useEffect(() => {
    const storedReport = localStorage.getItem("z_report_data");
    if (storedReport) {
      try {
        const report:ZReport = JSON.parse(storedReport);
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if(report.report_date === today){
            setZReportDataState(report);
        } else{
            localStorage.removeItem("z_report_data");
        }
      } catch {
        localStorage.removeItem("z_report_data");
      }
    }
  }, []);

  const setZReportData = (report: ZReport | null) => {
    setZReportDataState(report);
    if(report){
        localStorage.setItem("z_report_data", JSON.stringify(report));
    } else{
        localStorage.removeItem("z_report_data");
    }
  };

  const fetchTodaysReport = async () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    try{
        const response = await fetch(`${API_BASE}/api/manager/dailyReports?date=${today}`);

        if(response.ok){
            const data = await response.json();
            const processedData: ZReport = {
                report_date: data.report_date.slice(0, 10),
                total_revenue: parseFloat(data.total_revenue),
                transaction_count: parseInt(data.transaction_count, 10),
            };

            setZReportData(processedData);
        } else if(response.status === 404){
            console.log("No Z Report found for today");
            setZReportData(null);
        } else{
            console.error(`Failed to fetch today's Z Report: ${response.statusText}`);
        }
    } catch(e){
        console.error("Network or parsing error while re-fetching Z Report:", e);
    }
  };

  return (
    <ReportContext.Provider value={{ zReportData, setZReportData, fetchTodaysReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export function useReport() {
  const ctx = useContext(ReportContext);

  if (!ctx) {
    // Fallback for when hook is used outside of provider
    console.error("useReport must be used within a ReportProvider");
    return {
      zReportData: null,
      setZReportData: () => {},
      fetchTodaysReport: async () => {},
    } as ReportContextValue;
  }

  return ctx;
}
