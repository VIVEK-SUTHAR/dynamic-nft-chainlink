import { ethers } from "ethers";
import { ABI, AUTO_UPDATE_NFT_ABI, AUTO_UPDATE_NFT_CONTRACT_ADDRESS } from "./constant";

export default async function checkUpkeep() {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(AUTO_UPDATE_NFT_CONTRACT_ADDRESS, AUTO_UPDATE_NFT_ABI, signer);
    const Upkeep = await contract.safeMint();
    return Upkeep;
  } catch (error) {
    console.log(error);
  }
}
