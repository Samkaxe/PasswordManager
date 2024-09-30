import React, {StrictMode, useState} from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ManageCredentialsPage from "./components/ManageCredentialsPage/ManageCredentialsPage";
import SignInPage from "./components/SignInPage/SignInPage";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially not authenticated

    return (
    <StrictMode>
        <ColorModeScript initialColorMode='dark' />
        <ChakraProvider>

            <BrowserRouter>
                <Routes>
                    <Route path="*" element={isAuthenticated ? <Navigate to="/manage-credentials" replace /> : <Navigate to="/sign-in" replace />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/manage-credentials" element={<ManageCredentialsPage />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </StrictMode>
  );
}

export default App;
