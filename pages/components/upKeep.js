import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "./constant";

export default async function checkUpkeep() {
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const Upkeep = await contract.checkUpkeep("0x");
        return Upkeep;

    } catch (error) {
        console.log(error);
    }
}