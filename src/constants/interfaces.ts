export interface PolkadonConfig {
  modalTitle: string;
  networks: Network[];
}

export interface Network {
  networkName: string;
  recipientAddress: string;
}

export interface SenderAccount {
  accountName: string | undefined;
  accountAddress: string;
}

export interface NetworkData {
  networkName: string;
  provider: string;
  symbol: string;
}

export interface Donation {
  sender: string;
  amount: string;
}
