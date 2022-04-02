import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

import { PolkadonConfig, SenderAccount } from '../constants';
import { getNetworkData } from '../helpers';
import PolkadonModal from './PolkadonModal';
import InitError from './InitError';

const SContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface PolkadonProps {
  config: PolkadonConfig;
}

export const Polkadon = ({ config }: PolkadonProps) => {
  // TODO validate config
  const { networks } = config;
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [recipient, setRecipient] = useState('');
  const [subscanAddress, setSubscanAddress] = useState('');
  const [accounts, setAccounts] = useState<SenderAccount[]>([]);
  const [initError, setInitError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const init = useCallback(async () => {
    const extensions = await web3Enable('Polkadon');

    if (extensions.length > 0) {
      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        setAccounts(accounts.map((account) => ({ accountName: account.meta.name, accountAddress: account.address })));
      } else {
        return 'NO_ACCOUNT';
      }
    } else {
      return 'NO_EXTENSION';
    }

    return null;
  }, []);

  const connectApi = useCallback(
    async (networkName: string) => {
      const networkData = getNetworkData(networkName);
      if (networkData === null) {
        // TODO handle unknown network
        return;
      }

      const networkConfig = networks.find((network) => network.networkName === networkName);
      if (!networkConfig) {
        // TODO handle unknown network
        return;
      }

      const provider = new WsProvider(networkData.provider);
      const api = await ApiPromise.create({ provider });

      setRecipient(networkConfig.recipientAddress);
      setSubscanAddress(`https://${networkName}.subscan.io/account/${networkConfig.recipientAddress}`);
      setApi(api);
    },
    [networks],
  );

  const makeDonation = useCallback(
    async (sender) => {
      if (api) {
        const decimals = api.registry.chainDecimals[0];

        const injector = await web3FromAddress(sender);

        const amountBN = utils.parseUnits('0.1', decimals);
        await api.tx.balances.transfer(recipient, amountBN.toString()).signAndSend(sender, { signer: injector.signer });
      }
    },
    [api, recipient],
  );

  const initDonationModal = async () => {
    const error = await init();
    if (error) {
      setInitError(error);
    } else {
      setInitError('');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setApi(null);
    setRecipient('');
    setSubscanAddress('');
    setAccounts([]);
  };

  return (
    <SContainer>
      <button onClick={initDonationModal}>Donate now</button>
      {initError && <InitError type={initError} />}
      <PolkadonModal
        config={config}
        showModal={showModal}
        closeModal={closeModal}
        connectApi={connectApi}
        makeDonation={makeDonation}
        recipient={recipient}
        subscanAddress={subscanAddress}
        accounts={accounts}
      />
    </SContainer>
  );
};
