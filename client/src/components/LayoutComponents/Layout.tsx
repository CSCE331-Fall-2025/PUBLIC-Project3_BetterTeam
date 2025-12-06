
import { Outlet } from 'react-router-dom';

import NavBar from './NavBar.tsx';
import Header from './Header';

import './Layout.css';

export function Layout() {
	return (
		<div className="layout">
            <div className="header-wrapper">
                <Header />
            </div>
			<div className="layout-content">
                <div className="navbar-wrapper">
                    <NavBar />
                </div>
                <main className="page">
                    <Outlet />
                </main>
			</div>
		</div>
	);
}
