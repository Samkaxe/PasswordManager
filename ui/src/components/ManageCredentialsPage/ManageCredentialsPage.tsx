import React, { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    useToast,
    VStack,
    HStack,
    Box,
    InputRightElement,
    InputGroup, List, ListItem,
} from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { credentialService } from "../../services/credentialService";
import { CredentialDto } from "../../dtos/CredentialDto";

const ManageCredentialsPage = () => {
    const [credentials, setCredentials] = useState<CredentialDto[]>([]);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const
        toast = useToast();

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const data = await credentialService.getCredentials();
            setCredentials(data);
        } catch (error) {
            toast({
                title: "Error fetching credentials",
                description: 'Try reloading page',
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const addCredential = async () => {
        try {
            await credentialService.createCredential({ websiteUrl, username, password });
            toast({
                title: "Credential Added",
                description: "Your website credential has been added successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setWebsiteUrl('');
            setUsername('');
            setPassword('');
            await fetchCredentials(); // Refresh the list
        } catch (error) {
            toast({
                title: "Failed to Add Credential",
                description: "try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const deleteCredential = async (websiteId: number) => {
        try {
            await credentialService.deleteCredential(websiteId);
            toast({
                title: "Credential Deleted",
                description: "The website credential has been removed.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            await fetchCredentials(); // Refresh the list
        } catch (error) {
            toast({
                title: "Failed to Delete Credential",
                description: "try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);


    return (
        <Box p={8} className={"flex flex-row justify-between gap-4 max-w-4xl w-full"}>
            <VStack as="form" onSubmit={(e) => { e.preventDefault(); addCredential(); }} spacing={4} align="stretch" maxW="md" mb={8}>
                <FormControl>
                    <FormLabel>Website URL</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter website URL"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
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
                <Button colorScheme="blue" type="submit">
                    Add Credential
                </Button>
            </VStack>

            {/* Display the list of credentials */}
            <List spacing={3}>
                {credentials.map((credential) => (
                    <ListItem key={credential.id} p={4} borderWidth="1px" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                        <span>{credential.websiteUrl}</span>
                        <span>Username: {credential.username}</span>
                        <IconButton
                            colorScheme="red"
                            aria-label="Delete credential"
                            icon={<DeleteIcon />}
                            onClick={() => deleteCredential(credential.id)}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ManageCredentialsPage;
