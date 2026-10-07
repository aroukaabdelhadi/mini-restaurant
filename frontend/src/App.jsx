import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dishes from './pages/Dishes.jsx';
import Categories from './pages/Categories.jsx';
import Tables from './pages/Tables.jsx';
import Orders from './pages/Orders.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewOrder from './pages/NewOrder.jsx';
import Navbar from './components/Navbar.jsx';
import RoleProtected from './components/RoleProtected.jsx';
import Reservation from './pages/Reservation.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dishes" element={<RoleProtected roles={['admin']}><Dishes /></RoleProtected>} />
        <Route path="/categories" element={<RoleProtected roles={['admin']}><Categories /></RoleProtected>} />
        <Route path="/tables" element={<RoleProtected roles={['admin', 'waiter']}><Tables /></RoleProtected>} />
        <Route path="/orders" element={<RoleProtected roles={['admin', 'waiter', 'cook']}><Orders /></RoleProtected>} />
        <Route path="/orders/new" element={<RoleProtected roles={['admin', 'waiter']}><NewOrder /></RoleProtected>} />
        <Route path="/dashboard" element={<RoleProtected roles={['admin']}><Dashboard /></RoleProtected>} />
      </Routes>
    </BrowserRouter>
  );
}