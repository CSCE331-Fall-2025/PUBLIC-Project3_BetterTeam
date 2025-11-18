import Button from '../../components/ButtonComponents/Button.tsx'
import './Dashboard.css'

function ManagerHome() {

    function handleXReport() {
        alert('Items sold today :');
    }

    function handleZReport() {
        alert('Total sold today :');
    }

    return(
        <div className='managerHome'>
            <div className = 'buttonContainer'>
                <Button name={'X Report'} onClick={handleXReport}/>
                <Button name={'Z Report'} onClick={handleZReport}/>
                {/* <Button name={'Logout'} onClick={handleLogout}/> */}
            </div>
        </div>
    );
}

export default ManagerHome;
