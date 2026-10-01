import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dishes from './pages/Dishes.jsx';
import Orders from './pages/Orders.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewOrder from './pages/NewOrder.jsx';

const Protected = ({ children }) =>
  localStorage.getItem('access') ? children : <Navigate to="/login" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dishes" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dishes" element={<Dishes />} />
        <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/orders/new" element={<Protected><NewOrder /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}