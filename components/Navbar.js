import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Flex flexDirection={"row"} p="4" justifyContent={"center"} alignItems="center">
            {/* <Text fontSize={"2xl"} fontWeight="bold">
                DynamicNFT
            </Text> */}
            <Text
                display={{ base: "block", lg: "inline" }}
                bgClip="text"
                bgGradient="linear(to-r, green.400,purple.500)"
                fontWeight="extrabold"
                fontSize={"3xl"}
            >
                DynamicNFT
            </Text>{" "}
        </Flex>
    )
}