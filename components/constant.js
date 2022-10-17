import DynamicNFT from "./DynamicNFT.json";
import autonft from "./autonft.json";
const CONTRACT_ADDRESS = "0xB902295Ab815ECBC057861988C18F0e1dFA0912e";
const AUTO_UPDATE_NFT_CONTRACT_ADDRESS =
  "0xB6B2e6c61a9221792C90A600dB64a7E9fff37D28";
export const ABI = DynamicNFT.abi;
export const AUTO_UPDATE_NFT_ABI = autonft.abi;
export default CONTRACT_ADDRESS;
export { AUTO_UPDATE_NFT_CONTRACT_ADDRESS };
