import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Heading, Text, Button, Center, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface ResourceNotFoundPageProps {}

const ResourceNotFoundPage: FC<ResourceNotFoundPageProps> = () => {
    return (
        <Center h="100vh">
            <VStack spacing={4} textAlign="center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Heading as="h1" size="2xl">404</Heading>
                    <Text fontSize="xl">Oops! The page you're looking for doesn't exist.</Text>
                </motion.div>

                <Link to="/sign-in">
                    <Button colorScheme="blue">Go Back to Home page</Button>
                </Link>
            </VStack>
        </Center>
    );
};

export default ResourceNotFoundPage;