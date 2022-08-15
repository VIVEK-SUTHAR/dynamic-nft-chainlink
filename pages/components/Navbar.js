import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";

export default function Navbar() {
    return (
        <Flex flexDirection={"row"} p="4" justifyContent={"space-between"} alignItems="center">
            <Text fontSize={"2xl"} fontWeight="bold">
                DynamicNFT
            </Text>
            <HStack gap={"12"}>
                <Link>What is DynamicNFT</Link>
                <Link>Learn More</Link>
            </HStack>
        </Flex>
    )
}