import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Toast,
  VStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import CONTRACT_ADDRESS, {
  AUTO_UPDATE_NFT_ABI,
  AUTO_UPDATE_NFT_CONTRACT_ADDRESS,
} from "./constant";

import { ABI } from "./constant";
import { Spinner } from "@chakra-ui/react";
import confetti from "canvas-confetti";
import currentPrice from "./currentPrice";
import Image from "next/image";
import checkUpkeep from "./upKeep";
import performUpKeep from "./performUpKeep";
import Link from "next/link";
export default function Hero() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isminting, setIsminting] = useState(false);
  const [data, setData] = useState(null);
  const [price, setPrice] = useState("");
  const [isUpKeepNeeded, setIsUpKeepNeeded] = useState(false);
  const [performingupkeep, setPerformingupkeep] = useState(false);
  const toast = useToast();
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const price = await currentPrice();
    setPrice(price.price);
    const URI = await fetch(price.tokenURI);
    const JSONData = await URI.json();
    setData(JSONData);
  }
  function Upkeep() {
    toast({
      title: "Checking for upkeep",
      description: "Quering block-chain for latest data",
      position: "top-right",
      status: "info",
      duration: 2500,
      isClosable: true,
    });
    checkUpkeep().then((r) => {
      r[0] === true ? needUpKeep() : NoneedUpKeep();
    });
  }
  const NoneedUpKeep = () => {
    toast({
      title: "NFT Upto date",
      description: "No need to perform upkeep",
      position: "top-right",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setIsUpKeepNeeded(false);
  };
  const needUpKeep = () => {
    toast({
      title: "Upkeep is Needed",
      description: "Perform upkeep",
      position: "top-right",
      variant: "solid",
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
    setIsUpKeepNeeded(true);
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please Install Metamask");
      } else {
        const getAccount = await ethereum.request({
          method: "eth_requestAccounts",
        });
        let provider = new ethers.providers.Web3Provider(ethereum, "any");
        let signer = provider.getSigner();
        let chaindId = await signer.getChainId();
        if (chaindId !== 5) {
          setIsWalletConnected(false);
          signer.getChainId().then(async (res) => {
            if (res !== 4) {
              const rinkeby = await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x5" }],
              });
              const accounts = await ethereum.request({
                method: "eth_requestAccounts",
              });
              signer = provider.getSigner();
              setCurrentAccount(accounts[0]);
              setIsWalletConnected(true);
              console.log(currentAccount);
              localStorage.setItem(
                "currenyAccount",
                JSON.stringify(currentAccount)
              );
            }
          });
        }
        if (chaindId === 5) {
          setIsWalletConnected(true);
          setCurrentAccount(getAccount[0]);
          toast({
            title: "Wallet Connected",
            description: "You can now mint NFT",
            position: "top",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          console.log(currentAccount);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("currentAccount") > 0) {
      setCurrentAccount(localStorage.getItem("currentAccount"));
    } else {
      connectWallet();
    }
  }, []);
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
        title: "NFT Minted",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      confetti({
        particleCount: 1500,
        startVelocity: 120,
        spread: 500,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.8,
        },
      });
      console.log(songs);
      setIsminting(false);
    } catch (error) {
      if (error.code === 4001) {
        setIsminting(false);
        toast({
          title: "User Rejected Txn",
          position: "top",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }
  async function MintAutoUpdateNFT() {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      setIsminting(true);
      const contract = new ethers.Contract(
        AUTO_UPDATE_NFT_CONTRACT_ADDRESS,
        AUTO_UPDATE_NFT_ABI,
        signer
      );
      const Upkeep = await contract.safeMint(currentAccount);
      await songs.wait();
      toast({
        title: "NFT Minted",
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      confetti({
        particleCount: 500,
        startVelocity: 20,
        spread: 360,
      });
      console.log(songs);
      setIsminting(false);
    } catch (error) {
      if (error.code === 4001) {
        setIsminting(false);
        toast({
          title: "User Rejected Txn",
          position: "top",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }
  async function chainUpKeep() {
    setPerformingupkeep(true);
    toast({
      title: "Performing UpKeep",
      position: "top-right",
      status: "loading",
      isClosable: true,
    });
    const r = await performUpKeep();
    toast({
      title: "Performing UpKeep",
      position: "top-right",
      status: "loading",
      isClosable: true,
    });
    await r.wait();
    toast({
      title: "NFT updated",
      position: "top-right",
      status: "success",
      isClosable: true,
    });
    setPerformingupkeep(false);
    window.history.go(0);
  }
  return (
    <Flex
      h="container.sm"
      alignItems={"center"}
      px="10"
      flexDirection={["column", null, "row"]}
    >
      <VStack flex={"1"} px={["", null]}>
        <Flex fontSize={["2xl", null, "5xl"]}>
          What is a
          <Text mx={"2"} color={"orange.400"} fontWeight="extrabold">
            Dynamic NFT
          </Text>
          ?
        </Flex>
        <Text
          fontSize={["xl", null, "3xl"]}
          px={["1", null, "0"]}
          letterSpacing={[1, null, 0]}
          textAlign={["justify", null, "center"]}
        >
          A Dynamic NFT is a NFT that changes according to the current prices of
          BitCoin(BTC) in USD
        </Text>
        <Text fontSize={"2xl"}>
          Current price is {parseInt(price).toString().slice(0, 5)} USD
        </Text>
        {currentAccount && (
          <Text
            fontSize={["sm", null, "2xl"]}
            fontWeight={"bold"}
            textAlign="center"
          >
            NFT will be minted at {currentAccount}
          </Text>
        )}
        {performingupkeep ? (
          <Flex alignItems={"center"}>
            <Spinner color="red.500" />
            <Text marginInline={2} fontSize={24}>
              Updating the NFT{" "}
            </Text>
          </Flex>
        ) : null}
        {isminting ? (
          <Flex gap={"2"} fontSize="2xl" alignItems={"center"}>
            <Spinner />
            Minting NFT
          </Flex>
        ) : null}
        <Flex
          alignItems={"stretch"}
          gap={["0", null, "10"]}
          justifyContent={"center"}
          flexDirection={["column", "row"]}
        >
          {isWalletConnected ? (
            <>
              <Button
                my={[2, 8]}
                colorScheme={"purple"}
                fontSize={["xl", "xl", "2xl"]}
                variant={"solid"}
                color={"black"}
                onClick={MintNFT}
              >
                Mint NFT(Mannual-Update)
              </Button>
              <Button
                my={[2, 8]}
                colorScheme={"purple"}
                fontSize={["xl", "xl", "2xl"]}
                variant={"solid"}
                color={"black"}
                onClick={MintAutoUpdateNFT}
              >
                Mint NFT(Auto-Update)
              </Button>
            </>
          ) : (
            <Button
              my={[2, 8]}
              colorScheme={"purple"}
              fontSize={["xl", "xl", "2xl"]}
              variant={"solid"}
              color={"black"}
              onClick={connectWallet}
              disabled={isminting}
            >
              Connect Wallet
            </Button>
          )}
          <Button
            my={[2, 8]}
            colorScheme={"purple"}
            fontSize={["xl", "xl", "2xl"]}
            variant={"solid"}
            color={"black"}
            onClick={Upkeep}
          >
            Check Upkeep
          </Button>
          {isUpKeepNeeded === true && (
            <Button
              my="8"
              colorScheme={"purple"}
              fontSize="2xl"
              variant={"solid"}
              color={"black"}
              onClick={chainUpKeep}
            >
              Perform UpKeep
            </Button>
          )}
        </Flex>
      </VStack>
      <VStack flex={"0.8"}>
        {data && (
          <Flex
            bg={"whiteAlpha.200"}
            px={[4, 4]}
            py={[4, 2]}
            my={[2, 0]}
            rounded={"md"}
            flexDirection={"column"}
          >
            <Text
              fontSize={"4xl"}
              color="violet"
              fontWeight={"extrabold"}
              textAlign="center"
            >
              Live NFT
            </Text>
            <img
              className="rounded"
              src={data.image}
              width="350"
              height={"350"}
              style={{ borderRadius: "5px" }}
            />
            <VStack bg={"whiteAlpha.100"} p={[1, 2, 3]} rounded={"md"} my={2}>
              <Text
                color={"violet"}
                fontSize="3xl"
                fontWeight={"semibold"}
                letterSpacing={"widest"}
                textAlign={"center"}
              >
                {data.name.split("_").join("").toUpperCase()}
              </Text>
              <Button fontSize={"xl"}>
                <img src="/opensea.svg" />
                <a
                  href={
                    "https://testnets.opensea.io/assets/rinkeby/0x9AD01ceC84C2a28D86B0E8465c32d992f40a0ec2/0"
                  }
                  rel={"noreferrer"}
                  target={"_blank"}
                >
                  View On OpenSea
                </a>
              </Button>
            </VStack>
          </Flex>
        )}
      </VStack>
    </Flex>
  );
}
