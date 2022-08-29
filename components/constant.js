import DynamicNFT from "./DynamicNFT.json"
import autonft from './autonft.json'
const CONTRACT_ADDRESS = "0x9AD01ceC84C2a28D86B0E8465c32d992f40a0ec2";
const AUTO_UPDATE_NFT_CONTRACT_ADDRESS =
  "0xB6B2e6c61a9221792C90A600dB64a7E9fff37D28";
export const ABI = DynamicNFT.abi;
export const AUTO_UPDATE_NFT_ABI = autonft.abi;
export default CONTRACT_ADDRESS
export {AUTO_UPDATE_NFT_CONTRACT_ADDRESS};