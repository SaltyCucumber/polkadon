import { useCallback, useEffect, useState } from 'react';
import { utils } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import 'bootstrap/dist/css/bootstrap.min.css';

import PolkadonButton from './PolkadonButton';

interface PolkadonProps {
  receiver: string;
}

export const Polkadon = ({ receiver }: PolkadonProps) => {
  const [api, setApi] = useState<ApiPromise>();

  useEffect(() => {
    const setup = async () => {
      await web3Enable('Polkadon');
      await web3Accounts();

      const provider = new WsProvider('wss://rococo-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      setApi(api);
    };

    setup();
  }, []);

  const makeDonation = useCallback(async (sender) => {
    if (api) {
      const decimals = api.registry.chainDecimals[0];

      const injector = await web3FromAddress(sender);

      const amountBN = utils.parseUnits('0.1', decimals);
      await api.tx.balances.transfer(receiver, amountBN.toString()).signAndSend(sender, { signer: injector.signer });
    }
  }, [api, receiver]);

  return <PolkadonButton makeDonation={makeDonation} />;
};
