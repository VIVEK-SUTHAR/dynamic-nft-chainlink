import { ethers } from "ethers";
import { ABI } from "./constant";
import CONTRACT_ADDRESS from "./constant";

export default async function currentPrice(address) {
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const price = await contract.getLatestPrice();
        const tokenURI = await contract.tokenURI(0);
        return { price, tokenURI };

    } catch (error) {
        console.log(error);
    }
}