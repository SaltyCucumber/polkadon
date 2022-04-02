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
