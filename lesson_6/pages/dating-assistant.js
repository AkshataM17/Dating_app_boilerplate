import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export default function DatingAssistantPage() {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const bg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    checkUser();
  }, [router]);

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      const response = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const name = data.name.split(" ")[0] || data.name;
        setUserName(name);
      }
    }
  };

  return (
    <Flex direction='column' h='92vh' bg={bg}>
      <Text
        fontSize='2xl'
        fontWeight='bold'
        textAlign='center'
        mb={4}
        color='gray.700'
      >
        You Have Logged In
      </Text>
    </Flex>
  );
}
