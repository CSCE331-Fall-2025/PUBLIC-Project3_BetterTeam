import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type { ZReport } from "../pages/manager/Dashboard";

interface ReportContextValue {
  zReportData: ZReport | null;
  setZReportData: (report: ZReport | null) => void;
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

  return (
    <ReportContext.Provider value={{ zReportData, setZReportData }}>
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
    } as ReportContextValue;
  }

  return ctx;
}
