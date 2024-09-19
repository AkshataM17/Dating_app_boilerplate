import { Box } from "@chakra-ui/react";

export default function Layout({ children }) {
  return (
    <Box minHeight='100vh' padding={4}>
      {children}
    </Box>
  );
}
