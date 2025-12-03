
import './Layout.css';

import { Outlet } from 'react-router-dom';

import NavBar from './NavBar.tsx';
import Header from './Header';



export function Layout() {
	return (
		<div className="layout">
			<Header/>
			<div className="layout-content">
				<NavBar />
				<main className="page">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
