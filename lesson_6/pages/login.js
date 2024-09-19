// pages/login.js
import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Box, VStack, Input, Button, Heading, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error", error);
      // Handle error (show message to user)
    }
  };

  return (
    <Layout>
      <Box maxWidth='400px' margin='auto' mt={8}>
        <VStack spacing={4}>
          <Heading>Login</Heading>
          <Input
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSubmit} colorScheme='blue'>
            Login
          </Button>
          <Text>
            Don't have an account?{" "}
            <Button variant='link' onClick={() => router.push("/signup")}>
              Sign up
            </Button>
          </Text>
        </VStack>
      </Box>
    </Layout>
  );
}
