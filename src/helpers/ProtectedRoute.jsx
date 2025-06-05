import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext';
import LoadingPage from "../components/LoadingPage";

export function ProtectedRoute({ children }){
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingPage/>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};
