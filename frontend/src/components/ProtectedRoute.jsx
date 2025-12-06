import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.SERVER_API_URL || 'http://localhost:5000';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { state } = useAuth();
    const user = state.user;

    if (!user) {
        return <Navigate to="/authorize" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={`${API_URL}/dashboard/${user.role}`} replace />;
    }

    return children;
};

export default ProtectedRoute;