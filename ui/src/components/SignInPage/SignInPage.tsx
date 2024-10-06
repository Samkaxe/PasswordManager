import React, { FC, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    IconButton,
    Heading, useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import authService from "../../services/authService";

interface SignInPageProps {
    setIsAuthenticated: (value: boolean) => void;
}

const SignInPage: FC<SignInPageProps> = ({ setIsAuthenticated }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Start with login mode
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                await authService.login({ username, password });
                // Success toast for login
                setIsAuthenticated(true)
                toast({
                    title: "Login Successful",
                    description: "You've successfully logged in!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            } else {
                await authService.register({ username, email, password });
                setIsAuthenticated(true);
                // Success toast for registration
                toast({
                    title: "Registration Successful",
                    description: "You've successfully registered!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        } catch (error) {

            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="w-full h-full justify-center items-center flex pb-40">
            <VStack spacing={4} align="stretch" p={8} maxW="md">
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    {isLogin ? 'Sign In' : 'Sign Up'} {/* Dynamic heading */}
                </Heading>

                {!isLogin && ( // Conditionally render email field for sign-up
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                )}

                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                            <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={handleTogglePasswordVisibility}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme="blue" width="full" onClick={handleSubmit}>
                    {isLogin ? 'Sign In' : 'Sign Up'} {/* Dynamic button text */}
                </Button>

                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </Button>
            </VStack>
        </div>
    );
};

export default SignInPage;