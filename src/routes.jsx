import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import getItem from './utils/storage/getItem';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token');
    return token ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
    return (
        <Routes>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />

            <Route element={<ProtectedRoutes redirectTo='/sign-in' />}>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path='/home' element={<Home />} />
            </Route>
        </Routes>
    )
}

export default MainRoutes;