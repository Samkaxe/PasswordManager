import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, List, ListItem, IconButton, useToast, VStack
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {credentialService} from "../../services/credentialService";
import {CredentialDto} from "../../dtos/CredentialDto";

const ManageCredentialsPage = () => {
    const [credentials, setCredentials] = useState([]);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();

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
                isClosable: true
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
                isClosable: true
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
                isClosable: true
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
                isClosable: true
            });
            fetchCredentials(); // Refresh the list
        } catch (error) {
            toast({
                title: "Failed to Delete Credential",
                description: "try again",
                status: "error",
                duration: 3000,
                isClosable: true
            });
        }
    };

    return (
        <VStack spacing={4}>
            <FormControl>
                <FormLabel>Website URL</FormLabel>
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                <FormLabel>Username</FormLabel>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button mt={4} colorScheme="teal" onClick={addCredential}>Add Credential</Button>
            </FormControl>
            <List spacing={3}>
                {credentials.map((cred: CredentialDto) => (
                    <ListItem key={cred.id}>
                        {cred.websiteUrl} - {cred.username}
                        <IconButton
                            icon={<DeleteIcon />}
                            onClick={() => deleteCredential(cred.id)}
                            aria-label="Delete credential"
                            colorScheme="red"
                        />
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
};

export default ManageCredentialsPage;
