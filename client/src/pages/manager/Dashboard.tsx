import { useState, useEffect } from 'react';
import Button from '../../components/ButtonComponents/Button.tsx'
import './Dashboard.css'

const API_BASE = import.meta.env.VITE_API_BASE;

interface XReport {
    hour_of_day: number,
    total_transactions: string,
    total_sales: number,
}

interface ZReport {
    report_date: string,
    total_revenue: number,
    transaction_count: number,
}

function ManagerHome() {

    const [xReportData, setXReportData] = useState<XReport[] | null>(null); 
    const [zReportData, setZReportData] = useState<ZReport | null>(null); 
    const [isProcessing, setIsProcessing] = useState(false);

    function handleXReport() {
        if(!xReportData || xReportData.length === 0){
            alert('No X Report data.');
            return;
        }

        const detailLines = xReportData.map(x => 
            `Hour ${x.hour_of_day}: ${x.total_transactions} transactions, $${x.total_sales.toFixed(2)} sales`
        ).join('\n');

        const grandTotalSales = xReportData.reduce((sum, report) => sum + report.total_sales, 0);
        const grandTotalTransactions = xReportData.reduce((sum, report) => sum + parseInt(report.total_transactions), 0);
    
        const grandReport = 
            `X Report Summary\n\n` + 
            `${detailLines}\n` +
            `--------------------------------------\n` +
            `Grand Total: \n` +
            `Total Transactions: ${grandTotalTransactions}\n` +
            `Total Sales: $${grandTotalSales.toFixed(2)}`;
        
        alert(grandReport);
    }

    // hook that fetches the data
    useEffect(() => {
        const fetchXReport = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch(`${API_BASE}/api/manager/xReport`);

                if(!response.ok){
                    throw new Error('Failed to fetch X Report');
                }

                // this parses the json and converts it into an XReport array
                const data:XReport[] = await response.json();

                setXReportData(data);


            } catch (error) {
                console.error('X Report Error:', error);
                setXReportData(null);
            }
        };

        fetchXReport();
    }, []);

    function handleZReport() {
        if(window.confirm('This can only be done once a day. Proceed?')){
            const fetchZReport = async () => {

                setIsProcessing(true);

                try {
                    const response = await fetch(`${API_BASE}/api/manager/zReport`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                    });

                    if(!response.ok){
                        const errorText = await response.text();
                        throw new Error(`Failed to close day: ${errorText}`);
                    }

                    // this parses the json and converts it into an XReport array
                    const data = await response.json();

                    const processedData: ZReport = {
                        report_date: data.report_date,
                        total_revenue: parseFloat(data.total_revenue),
                        transaction_count: parseInt(data.transaction_count, 10),
                    };

                    setZReportData(processedData);
                    setXReportData([]);

                    alert(`Final report for ${processedData.report_date} finalized. Totals reset.`);

                } catch (error) {
                    console.error('Z Report Error:', error);
                    alert('Error closing day, check console for logs.')
                } finally {
                    setIsProcessing(false);
                }
            };
            fetchZReport();
        }
    }

    return(
        <div className='managerHome'>

            {isProcessing && <div>Processing Z Report... Please wait.</div>}

            {zReportData && (
                <div className='zDisplay'>
                    <h2>Z Report Finalized: {zReportData.report_date}</h2>
                    <p>Total Revenue: ${zReportData.total_revenue.toFixed(2)}</p>
                    <p>Total Transactions: {zReportData.transaction_count}</p>
                    <hr/>
                    <p>Daily sales totals have been archived and reset for the next business day.</p>
                </div>
            )}
            <div className = 'buttonContainer'>
                <Button name={'X Report'} onClick={handleXReport}/>
                <Button name={'Z Report'} onClick={handleZReport}/>
            </div>
        </div>
    );
}

export default ManagerHome;
