import { useState, useEffect } from 'react';
import { useReport } from '../../context/ReportContext.tsx';
import Button from '../../components/ButtonComponents/Button.tsx'
import './Dashboard.css'

const API_BASE = import.meta.env.VITE_API_BASE;

interface XReport {
    hour_of_day: number,
    total_transactions: string,
    total_sales: number,
}

export interface ZReport {
    report_date: string,
    total_revenue: number,
    transaction_count: number,
    manager_name?: string,
}

function ManagerHome() {

    const [xReportData, setXReportData] = useState<XReport[] | null>(null); 
    const { zReportData, setZReportData, fetchTodaysReport } = useReport();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [reportDates, setReportDates] = useState<string[] | null>(null);
    const [histReportData, setHistReportData] = useState<ZReport | null>(null);
    const [fetchingHistory, setFetchingHistory] = useState(false);

    useEffect(() => {
        if(zReportData === null){
            fetchTodaysReport();
        }
    }, [zReportData, fetchTodaysReport]);

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
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch X Report: ${errorText}`);
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

                const authUser = localStorage.getItem('auth_user');
                let managerId = null;

                if(authUser){
                    try{
                        const user = JSON.parse(authUser);
                        managerId = user.id;
                    } catch(e){
                        console.error('Failed to parse auth_user from localStorage:', e);
                        alert('Could not identify manager. Cannot process Z Report.');
                        setIsProcessing(false);
                        return;
                    }
                }

                if(!managerId){
                    alert('Could not identify manager. Cannot process Z Report.');
                    setIsProcessing(false);
                    return;  
                }

                try {
                    const response = await fetch(`${API_BASE}/api/manager/zReport`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({managerId}),
                    });

                    if(!response.ok){
                        if(response.status === 409){
                            alert('Z Report already made for today');
                            return;
                        }

                        const errorText = await response.text();
                        throw new Error(`Failed to close day: ${errorText}`);
                    }

                    // this parses the json and converts it into an XReport array
                    const data = await response.json();

                    const processedData: ZReport = {
                        report_date: data.report_date.slice(0, 10),
                        total_revenue: parseFloat(data.total_revenue),
                        transaction_count: parseInt(data.transaction_count, 10),
                    };

                    setZReportData(processedData);
                    setXReportData([]);

                    alert(`Final report for ${processedData.report_date} finalized. Totals reset.`);

                } catch (error) {
                    console.error('Z Report Error:', error);
                    alert('Unknown error occurred during Z Report processing. Please check console for details.');
                } finally {
                    setIsProcessing(false);
                }
            };
            fetchZReport();
        }
    }

    async function fetchReportDates(){
        setFetchingHistory(true);
        try{
            const response = await fetch(`${API_BASE}/api/manager/dailyReports`);

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to fetch report dates: ${errorText}`);
            }

            const dates: string[] = await response.json();
            setReportDates(dates);
        } catch(error){
            console.error('Report Dates Error:', error);
            alert('Could not load historical report dates.');
        } finally{
            setFetchingHistory(false);
        }
    }

    function handleViewHistory(){
        setShowHistory(prev => !prev);
        setHistReportData(null);

        if(!showHistory && !reportDates){
            fetchReportDates();
        }
    }

    async function handleSelectReport(date: string){
        if(!date){
            setHistReportData(null);
            return;
        }

        setFetchingHistory(true);
        try{
            const response = await fetch(`${API_BASE}/api/manager/dailyReports?date=${date}`);

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to fetch report for ${date}: ${errorText}`);
            }

            const data: ZReport = await response.json();

            setHistReportData({
                report_date: data.report_date.slice(0, 10),
                total_revenue: parseFloat(data.total_revenue as unknown as string),
                transaction_count: parseInt(data.transaction_count as unknown as string, 10),
                manager_name: data.manager_name,
            });
        } catch(error){
            console.error(`Error fetching report for ${date}:`, error);
            alert(`Could not load report for ${date}`);
        } finally{
            setFetchingHistory(false);
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
            <div className='historyContainer'>
                <Button name={showHistory ? 'Hide Prev Reports' : 'View Prev Z Reports'} onClick={handleViewHistory} />
                {showHistory && (
                    <div className='historyPanel'>
                        {fetchingHistory && !reportDates && <div>Loading Report History...</div>}
                        {reportDates && reportDates.length > 0 && (
                            <div className='reportList'>
                                <h3>Select a report date:</h3>
                                <select onChange={(e) => handleSelectReport(e.target.value)} disabled={fetchingHistory}>
                                    <option value=''>Select Date</option>
                                    {reportDates.map((date) => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {reportDates && reportDates.length === 0 && <div>No previous reports found.</div>}
                        {histReportData && (
                            <div className='historicalZDisplay'>
                                <h4>Z Report for: {histReportData.report_date}</h4>
                                <p>Report filed by: {histReportData.manager_name}</p>
                                <p>Revenue: ${histReportData.total_revenue}</p>
                                <p>Transactions: {histReportData.transaction_count}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className = 'buttonContainer'>
                <Button name={'X Report'} onClick={handleXReport}/>
                <Button name={'Z Report'} onClick={handleZReport}/>
            </div>
        </div>
    );
}

export default ManagerHome;
