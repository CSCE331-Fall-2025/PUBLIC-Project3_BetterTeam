import { useState } from 'react'
import './App.css'

import Home from './pages/any/Home.tsx'
import login from './pages/any/Login.tsx'
import Signup from './pages/any/Signup.tsx'
import CashierHome from './pages/cashier/CashierHome.tsx'
import ManagerHome from './pages/manager/ManagerHome.tsx'
import CustomerHome from './pages/customer/CustomerHome.tsx'

function App() {
    return(
        <Home />
    );
}

export default App