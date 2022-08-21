import { ethers } from "ethers";
import CONTRACT_ADDRESS from "./constant";
import { ABI } from "./constant";

export default async function performUpKeep() {
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const price = await contract.getLatestPrice();
        const tokenURI = await contract.performUpkeep("0x");
        return tokenURI;
    } catch (error) {
        console.log(error);
    }
}