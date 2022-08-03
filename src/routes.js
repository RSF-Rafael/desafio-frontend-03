import { getItem } from './utils/storage';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';

import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />

      <Route element={<ProtectedRoutes redirectTo='/login' />}>
        <Route path="/" element={<Navigate to='/home' />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>

  );
}

export default MainRoutes;