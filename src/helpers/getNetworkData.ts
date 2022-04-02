import { NetworkData, supportedNetworks } from '../constants';

export const getNetworkData = (networkName: string): NetworkData | null => {
  const foundNetwork = supportedNetworks.find((network) => network.networkName === networkName.toLowerCase());

  if (foundNetwork) {
    return foundNetwork;
  }

  return null;
};
