export interface PolkadonConfig {
  modalTitle: string;
  networks: Network[];
  buttonStyles: ButtonStyles;
}

export interface ButtonStyles {
  width?: string;
  height?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  borderRadius?: string;
  boxShadowColor?: string;
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
