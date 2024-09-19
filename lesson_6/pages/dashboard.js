// pages/dashboard.js
import { useAuth } from "../contexts/AuthContext";
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Layout>
      <Box maxWidth='400px' margin='auto' mt={8}>
        <VStack spacing={4}>
          <Heading>Dashboard</Heading>
          <Text>Welcome, {user.name}!</Text>
          <Text>You are logged in!</Text>
          <Button onClick={logout} colorScheme='red'>
            Logout
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
}
