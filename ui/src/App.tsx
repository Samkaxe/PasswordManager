import React, { StrictMode, useState } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ManageCredentialsPage from "./components/ManageCredentialsPage/ManageCredentialsPage";
import SignInPage from "./components/SignInPage/SignInPage";
import ResourceNotFoundPage from "./components/ResourceNotFoundPage/ResourceNotFoundPage";
import {ChakraProvider, ColorModeScript, ToastProvider} from "@chakra-ui/react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <StrictMode>
            <ChakraProvider>
                <ToastProvider></ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Unauthenticated Routes */}
                            <Route path="/sign-in" element={!isAuthenticated ? <SignInPage /> : <Navigate to="/manage-credentials" replace />} />

                            {/* Authenticated Routes */}
                            <Route path="/manage-credentials" element={isAuthenticated ? <ManageCredentialsPage /> : <Navigate to="/sign-in" replace />} />
                            {/* Add other authenticated routes here in a similar fashion */}

                            {/* Catch-all for authenticated users */}
                            <Route path="*" element={isAuthenticated ? <ResourceNotFoundPage /> : <Navigate to="/sign-in" replace />} />
                        </Routes>
                    </BrowserRouter>
            </ChakraProvider>
        </StrictMode>
    );
}

export default App;