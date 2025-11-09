import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/any/Home.tsx';
import Login from './pages/any/Login.tsx';
import Signup from './pages/any/Signup.tsx';
import MenuBoard from './pages/any/MenuBoard.tsx';
import CashierHome from './pages/cashier/CashierHome.tsx';
import ManagerHome from './pages/manager/ManagerHome.tsx';
import CustomerHome from './pages/customer/CustomerHome.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/menu" element={<MenuBoard />} />
                <Route path="/cashier" element={<CashierHome />} />
                <Route path="/manager" element={<ManagerHome />} />
                <Route path="/customer" element={<CustomerHome />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;