const CONTRACT_ADDRESS = "0x6968e292689EE7205a42E69398EfdFB17Aee3DBf";
const SEPOLIA_CHAIN_ID = 11155111n;
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

const ABI = [
  "function getOwner() view returns (address)",
  "function getTotalVotes() view returns (uint256)",
  "function getVotes(uint256 candidate) view returns (uint256)",
  "function voters(address voter) view returns (bool)",
  "function vote(uint256 candidate)",
  "function resetVotes()",
];

const elements = {
  connectWallet: document.querySelector("#connectWallet"),
  contractAddress: document.querySelector("#contractAddress"),
  walletAddress: document.querySelector("#walletAddress"),
  networkName: document.querySelector("#networkName"),
  candidateOneVotes: document.querySelector("#candidateOneVotes"),
  candidateTwoVotes: document.querySelector("#candidateTwoVotes"),
  totalVotes: document.querySelector("#totalVotes"),
  voteCandidateOne: document.querySelector("#voteCandidateOne"),
  voteCandidateTwo: document.querySelector("#voteCandidateTwo"),
  refreshVotes: document.querySelector("#refreshVotes"),
  voterStatus: document.querySelector("#voterStatus"),
  resetVotes: document.querySelector("#resetVotes"),
  message: document.querySelector("#message"),
};

let provider;
let signer;
let contract;
let currentAccount;

elements.contractAddress.textContent = shortenAddress(CONTRACT_ADDRESS);
setButtonsDisabled(true);
loadReadOnlyData();

elements.connectWallet.addEventListener("click", connectWallet);
elements.refreshVotes.addEventListener("click", refreshData);
elements.voteCandidateOne.addEventListener("click", () => vote(1));
elements.voteCandidateTwo.addEventListener("click", () => vote(2));
elements.resetVotes.addEventListener("click", resetVotes);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", () => window.location.reload());
}

async function loadReadOnlyData() {
  try {
    provider = getReadOnlyProvider();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    await refreshVotes();
  } catch (error) {
    showMessage(parseError(error), "error");
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    showMessage("Please install MetaMask or another Ethereum wallet.", "error");
    return;
  }

  try {
    showMessage("Connecting wallet...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    await ensureSepoliaNetwork();

    signer = await provider.getSigner();
    currentAccount = await signer.getAddress();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    elements.walletAddress.textContent = shortenAddress(currentAccount);
    elements.connectWallet.textContent = "Wallet Connected";
    setButtonsDisabled(false);
    await refreshData();
    showMessage("Wallet connected.", "success");
  } catch (error) {
    showMessage(parseError(error), "error");
  }
}

async function ensureSepoliaNetwork() {
  const network = await provider.getNetwork();
  if (network.chainId === SEPOLIA_CHAIN_ID) {
    elements.networkName.textContent = "Sepolia";
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (error) {
    if (error.code !== 4902) {
      throw error;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia",
          nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.sepolia.org"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ],
    });
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  elements.networkName.textContent = "Sepolia";
}

async function refreshData() {
  await refreshVotes();
  await refreshVoterStatus();
}

async function refreshVotes() {
  try {
    const [candidateOne, candidateTwo, total] = await Promise.all([
      contract.getVotes(1),
      contract.getVotes(2),
      contract.getTotalVotes(),
    ]);

    elements.candidateOneVotes.textContent = candidateOne.toString();
    elements.candidateTwoVotes.textContent = candidateTwo.toString();
    elements.totalVotes.textContent = total.toString();
  } catch (error) {
    showMessage(parseError(error), "error");
  }
}

async function refreshVoterStatus() {
  if (!currentAccount || !contract) {
    return;
  }

  try {
    const [hasVoted, owner] = await Promise.all([
      contract.voters(currentAccount),
      contract.getOwner(),
    ]);

    elements.voterStatus.textContent = hasVoted
      ? "This wallet has already voted."
      : "This wallet has not voted yet.";

    const isOwner = owner.toLowerCase() === currentAccount.toLowerCase();
    elements.resetVotes.disabled = !isOwner;
  } catch (error) {
    showMessage(parseError(error), "error");
  }
}

async function vote(candidate) {
  try {
    setActionButtonsDisabled(true);
    showMessage(`Submitting vote for candidate ${candidate}...`);

    const tx = await contract.vote(candidate);
    showMessage("Waiting for transaction confirmation...");
    await tx.wait();

    await refreshData();
    showMessage(`Vote for candidate ${candidate} confirmed.`, "success");
  } catch (error) {
    showMessage(parseError(error), "error");
  } finally {
    setActionButtonsDisabled(false);
  }
}

async function resetVotes() {
  try {
    setActionButtonsDisabled(true);
    showMessage("Submitting reset transaction...");

    const tx = await contract.resetVotes();
    showMessage("Waiting for reset confirmation...");
    await tx.wait();

    await refreshData();
    showMessage("Votes reset.", "success");
  } catch (error) {
    showMessage(parseError(error), "error");
  } finally {
    setActionButtonsDisabled(false);
  }
}

function getReadOnlyProvider() {
  return new ethers.JsonRpcProvider("https://rpc.sepolia.org");
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    currentAccount = undefined;
    signer = undefined;
    elements.walletAddress.textContent = "Not connected";
    elements.voterStatus.textContent =
      "Connect your wallet to see whether this address has already voted.";
    setButtonsDisabled(true);
    showMessage("Wallet disconnected.");
    return;
  }

  connectWallet();
}

function setButtonsDisabled(disabled) {
  elements.voteCandidateOne.disabled = disabled;
  elements.voteCandidateTwo.disabled = disabled;
  elements.resetVotes.disabled = true;
}

function setActionButtonsDisabled(disabled) {
  elements.voteCandidateOne.disabled = disabled;
  elements.voteCandidateTwo.disabled = disabled;
  elements.refreshVotes.disabled = disabled;

  if (disabled) {
    elements.resetVotes.disabled = true;
  } else {
    refreshVoterStatus();
  }
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function showMessage(text, type = "") {
  elements.message.textContent = text;
  elements.message.className = `message ${type}`.trim();
}

function parseError(error) {
  console.error(error);
  return (
    error?.reason ||
    error?.shortMessage ||
    error?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
}
