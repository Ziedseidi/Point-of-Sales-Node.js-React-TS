import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface PrivateRouteProps {
    element: React.ReactElement;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
    const token = Cookies.get('token');

    return token ? element : <Navigate to={ path } replace />;
};

export default PrivateRoute;