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
  const [input, setInput] = useState("");
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
        </VStack>
      </Box>
      <Box
        borderTop='1px'
        borderColor={borderColor}
        p={4}
        bg={useColorModeValue("white", "gray.800")}
      ></Box>
    </Flex>
  );
}
