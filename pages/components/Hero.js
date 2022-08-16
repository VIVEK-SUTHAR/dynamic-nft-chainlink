import { Box, Button, Flex, HStack, Text, Toast, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useToast } from '@chakra-ui/react'
import { CONTRACT_ADDRESS, ABI } from "./constant";
import { Spinner } from '@chakra-ui/react'
import confetti from "canvas-confetti";
import currentPrice from "./currentPrice";
import Image from "next/image";
import checkUpkeep from "./upKeep";

export default function Hero() {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState("");
    const [isminting, setIsminting] = useState(false);
    const [data, setData] = useState(null);
    const [price, setPrice] = useState("");
    const toast = useToast();
    useEffect(() => {
        currentPrice().then(res => {
            setPrice(res.price);
            console.log(price);
            fetch(res.tokenURI).then(res => {
                res.json().then(res => {
                    setData(res);
                })
            })
        })
    }, [])

    function Upkeep() {
        checkUpkeep().then(r => {
            r[0] === true ? toast({
                title: 'Upkeep is Needed',
                position: 'top-right',
                status: 'success',
                duration: 2000,
                isClosable: true,
            }) : toast({
                title: 'Wallet Connected',
                position: 'top-right',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        })
    }
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Please Install Metamask");
            }
            else {
                const getAccount = await ethereum.request({
                    method: 'eth_requestAccounts'
                });
                let provider = new ethers.providers.Web3Provider(ethereum, "any");
                let signer = provider.getSigner();
                let chaindId = await signer.getChainId();
                if (chaindId !== 4) {
                    setIsWalletConnected(false)
                    signer.getChainId().then(async (res) => {
                        if (res !== 4) {
                            const rinkeby = await ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: "0x4" }]
                            })
                            const accounts = await ethereum.request({
                                method: 'eth_requestAccounts',
                            });
                            signer = provider.getSigner();
                            setCurrentAccount(accounts[0]);
                            setIsWalletConnected(true);
                            console.log(currentAccount);
                        }
                    })
                }
                if (chaindId === 4) {
                    setIsWalletConnected(true);
                    setCurrentAccount(getAccount[0]);
                    toast({
                        title: 'Wallet Connected',
                        position: 'top-right',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    })
                    console.log(currentAccount);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    async function MintNFT() {
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
            setIsminting(true);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const songs = await contract.safeMint(currentAccount);
            await songs.wait();
            toast({
                title: 'NFT Minted',
                position: 'top-right',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            confetti({
                particleCount: 500,
                startVelocity: 20,
                spread: 360,
            });
            console.log(songs);
            setIsminting(false)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Flex h="container.sm" alignItems={"center"} px='10'>
            <VStack width={"50%"}>
                <Flex fontSize={"5xl"}>
                    What is a
                    <Text mx={"2"} color={"orange.400"} fontWeight="extrabold">
                        Dynamic NFT
                    </Text>
                    ?
                </Flex>
                <Text fontSize={"3xl"} textAlign="center">A Dynamic NFT is a NFT that changes according to the current prices of BTC in USD</Text>
                <Text fontSize={"2xl"}>Current price is {parseInt(price).toString().slice(0, 5)} USD</Text>
                {currentAccount && (
                    <Text fontSize={"xl"}>NFT will be minted at {currentAccount}</Text>
                )}
                {
                    isminting ? (
                        <Flex gap={"2"} fontSize="2xl" alignItems={'center'}>
                            <Spinner />Minting NFT
                        </Flex>
                    ) : (null)
                }
                <Flex alignItems={"center"} gap="10">
                    {
                        isWalletConnected ? (
                            <Button
                                my="8"
                                colorScheme={"purple"}
                                fontSize="2xl"
                                variant={"solid"}
                                color={"black"}
                                onClick={MintNFT}
                            >
                                Mint NFT
                            </Button>
                        ) : (
                            <Button
                                my="8"
                                colorScheme={"purple"}
                                fontSize="2xl"
                                variant={"solid"}
                                color={"black"}
                                onClick={connectWallet}
                                disabled={isminting}
                            >
                                Connect Wallet
                            </Button>
                        )
                    }
                    <Button
                        my="8"
                        colorScheme={"purple"}
                        fontSize="2xl"
                        variant={"solid"}
                        color={"black"}
                        onClick={Upkeep}
                    >Check Upkeep</Button>
                </Flex>
            </VStack>
            <VStack flex={"2"}>
                {
                    data && (
                        <figure>
                            <img className="rounded" src={data.image} width="350" height={"350"} style={{ borderRadius: "10px" }} />
                            <Text color={"blue.600"} fontSize="2xl" letterSpacing={"widest"} textAlign={"center"}>{data.name.split("_").join("").toUpperCase()}</Text>
                        </figure>)
                }

            </VStack>
        </Flex>
    )
}