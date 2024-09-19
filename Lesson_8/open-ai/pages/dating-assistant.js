import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Grid,
  useColorModeValue,
  Avatar,
  Icon,
  Center,
} from "@chakra-ui/react";
import { Send, User, MessageSquare, FileText, Shirt, Mail } from "lucide-react";

const InfoCard = ({ icon, text }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      bg={bgColor}
      p={4}
      borderRadius='lg'
      textAlign='center'
      height='100%'
      boxShadow='md'
      transition='all 0.2s'
      _hover={{ transform: "scale(1.05)" }}
    >
      <Icon as={icon} size={24} mb={2} color={textColor} />
      <Text fontSize='sm' color={textColor}>
        {text}
      </Text>
    </Flex>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function DatingAssistantPage() {
  const [input, setInput] = useState("Greetings");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const bg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      setConversation((prev) => [...prev, { role: "user", content: input }]);
      const currentInput = input;
      setInput("");
      setIsLoading(true);

      const encodedInput = encodeURIComponent(currentInput);
      const eventSource = new EventSource(
        `/api/dating-guide/stream?input=${encodedInput}&token=${token}`
      );

      let assistantResponse = "";

      eventSource.onmessage = (event) => {
        try {
          setIsLoading(false);
          const data = JSON.parse(event.data);
          if (data.content === "[DONE]") {
            eventSource.close();
          } else {
            assistantResponse += data.content;
            setConversation((prev) => {
              const newConv = [...prev];
              if (newConv[newConv.length - 1]?.role === "assistant") {
                newConv[newConv.length - 1].content = assistantResponse;
              } else {
                newConv.push({
                  role: "assistant",
                  content: assistantResponse.trim(),
                });
              }
              return newConv;
            });
          }
        } catch (error) {
          console.error("Error parsing event data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        alert(
          "Connection Error: Failed to connect to the server. Please try again."
        );
      };
    } catch (error) {
      console.error("Error getting advice:", error);
      alert("Error: An error occurred while getting advice. Please try again.");
    }
  };

  return (
    <Flex direction='column' h='92vh' bg={bg}>
      <Box flex={1} overflowY='auto' px={4} py={6}>
        <VStack
          spacing={6}
          align='stretch'
          maxW='3xl'
          mx='auto'
          w='full'
          h='full'
          justifyContent='center'
        >
          <Text
            fontSize='2xl'
            fontWeight='bold'
            textAlign='center'
            mb={4}
            color='gray.700'
          >
            {getGreeting()}, {userName}
          </Text>
          <Center>
            <Grid templateColumns='repeat(2, 1fr)' gap={4} maxW='md'>
              <InfoCard icon={MessageSquare} text='Ask for dating advice' />
              <InfoCard
                icon={FileText}
                text='Get tips for writing a great profile'
              />
              <InfoCard icon={Shirt} text='Outfit suggestions for a date' />
              <InfoCard icon={Mail} text='Help crafting messages to matches' />
            </Grid>
          </Center>
          <Center>
            <Button
              h='2rem'
              w={20}
              size='sm'
              bg='red'
              _hover={{ color: "brand.500" }}
              onClick={handleSubmit}
            >
              Hi, OpenAI
            </Button>
          </Center>
        </VStack>
      </Box>
      <Box
        borderTop='1px'
        borderColor={borderColor}
        p={4}
        bg={useColorModeValue("white", "gray.800")}
      >
        <Flex maxW='3xl' mx='auto'>
          <Text
            fontSize='lg'
            fontWeight='bold'
            textAlign='center'
            mb={4}
            color='gray.700'
          >
            {conversation[1]?.content}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
