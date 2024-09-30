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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="w-full h-full justify-center items-center flex pb-40">
            <VStack spacing={4} align="stretch" p={8} maxW="md">
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="Enter your email" />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" />
                        <InputRightElement width="4.5rem">
                            <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={handleTogglePasswordVisibility}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme="blue" width="full">
                    Sign In
                </Button>
            </VStack>

        </div>
    );
};

export default SignInPage;