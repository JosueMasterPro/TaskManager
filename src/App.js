import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/authContext';
import { ProtectedRoute } from './helpers/ProtectedRoute';

/* Importar Paginas */
import Main from './pages/main';
import Login from './pages/login';

function App() {

  return (
   <>
    <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/main" />} />
            <Route path="/main" element={
              <ProtectedRoute>
                <Main/>
              </ProtectedRoute>
              }/>
            <Route path='/login' element={ <Login/> }/>
          </Routes>
    </AuthProvider>
   </>
  );
}

export default App;
