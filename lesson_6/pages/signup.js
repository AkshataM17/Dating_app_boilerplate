// pages/signup.js
import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Box, VStack, Input, Button, Heading } from "@chakra-ui/react";
import Layout from "../components/Layout";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
    } catch (error) {
      console.error("Signup error", error);
      // Handle error (show message to user)
    }
  };

  return (
    <Layout>
      <Box maxWidth='400px' margin='auto' mt={8}>
        <VStack spacing={4}>
          <Heading>Sign Up</Heading>
          <Input
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
}
