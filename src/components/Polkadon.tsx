import { useCallback, useState } from 'react';
import { utils } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ButtonStyles, Donation, DonationStatus, NetworkData, PolkadonConfig, SenderAccount } from '../constants';
import { defaultButtonStyles, getNetworkData } from '../helpers';
import PolkadonModal from './PolkadonModal';
import InitError from './InitError';

const SDonationButton = styled.button<SDonationButtonProps>`
  width: ${({ buttonStyles }) => `${buttonStyles.width ? buttonStyles.width : defaultButtonStyles.width}px`};
  height: ${({ buttonStyles }) => `${buttonStyles.height ? buttonStyles.height : defaultButtonStyles.height}px`};
  color: ${({ buttonStyles }) => (buttonStyles.color ? buttonStyles.color : defaultButtonStyles.color)};
  background-color: ${({ buttonStyles }) => (buttonStyles.backgroundColor ? buttonStyles.backgroundColor : defaultButtonStyles.backgroundColor)};
  font-size: ${({ buttonStyles }) => `${buttonStyles.fontSize ? buttonStyles.fontSize : defaultButtonStyles.fontSize}px`};
  border-radius: ${({ buttonStyles }) => `${buttonStyles.borderRadius ? buttonStyles.borderRadius : defaultButtonStyles.borderRadius}px`};
  border: 0;
  box-shadow: 0 0 3px 0 ${({ buttonStyles }) => (buttonStyles.boxShadowColor ? buttonStyles.boxShadowColor : defaultButtonStyles.boxShadowColor)};
`;

interface SDonationButtonProps {
  buttonStyles: ButtonStyles;
}

interface PolkadonProps {
  config: PolkadonConfig;
}

export const Polkadon = ({ config }: PolkadonProps) => {
  const { networks } = config;
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [recipient, setRecipient] = useState('');
  const [subscanAddress, setSubscanAddress] = useState('');
  const [subscanTransaction, setSubscanTransaction] = useState('');
  const [accounts, setAccounts] = useState<SenderAccount[]>([]);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [initError, setInitError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [donationStatus, setDonationStatus] = useState('');
  const [donationInProgress, setDonationInProgress] = useState(false);

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
        return;
      }

      const networkConfig = networks.find((network) => network.networkName === networkName);
      if (!networkConfig) {
        return;
      }

      const provider = new WsProvider(networkData.provider);
      const api = await ApiPromise.create({ provider });

      setRecipient(networkConfig.recipientAddress);
      setSubscanAddress(`https://${networkName}.subscan.io/account/${networkConfig.recipientAddress}`);
      setApi(api);
      setNetworkData(networkData);
    },
    [networks],
  );

  const makeDonation = useCallback(
    async ({ sender, amount }: Donation) => {
      if (api && networkData) {
        try {
          setDonationInProgress(true);
          setDonationStatus(DonationStatus.INIT);
          const decimals = api.registry.chainDecimals[0];
          const injector = await web3FromAddress(sender);
          const amountBN = utils.parseUnits(amount, decimals);

          const unsub = await api.tx.balances
            .transfer(recipient, amountBN.toString())
            .signAndSend(sender, { signer: injector.signer }, ({ events = [], status, txHash }) => {
              if (status.isInBlock) {
                setDonationStatus(DonationStatus.ADDED);
              } else if (status.isFinalized) {
                setSubscanTransaction(`https://${networkData.networkName}.subscan.io/extrinsic/${txHash.toHex()}`);

                events.forEach(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setDonationStatus(DonationStatus.SUCCESS);
                  } else if (method === 'ExtrinsicFailed') {
                    setDonationStatus(DonationStatus.FAILED);
                  }
                });

                unsub();
              }
            });
        } catch (error) {
          setDonationStatus(DonationStatus.ERROR);
        } finally {
          setDonationInProgress(false);
        }
      }
    },
    [api, networkData, recipient],
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
    setApi(null);
    setRecipient('');
    setSubscanAddress('');
    setSubscanTransaction('');
    setAccounts([]);
    setNetworkData(null);
    setInitError('');
    setShowModal(false);
    setDonationStatus('');
    setDonationInProgress(false);
  };

  return (
    <>
      <SDonationButton buttonStyles={config.buttonStyles} onClick={initDonationModal}>
        Donate now
      </SDonationButton>
      {initError && <InitError type={initError} />}
      <PolkadonModal
        config={config}
        showModal={showModal}
        closeModal={closeModal}
        connectApi={connectApi}
        makeDonation={makeDonation}
        recipient={recipient}
        subscanAddress={subscanAddress}
        subscanTransaction={subscanTransaction}
        accounts={accounts}
        networkData={networkData}
        donationStatus={donationStatus}
        donationInProgress={donationInProgress}
      />
    </>
  );
};
