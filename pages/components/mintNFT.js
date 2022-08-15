export default async function MintNFT(address) {
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const songs = await contract.safeMint(address);
        await songs.wait();
        console.log(songs);
    } catch (error) {
        console.log(error);
    }
}