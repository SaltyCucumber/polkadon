import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import PolkadonModal from '../PolkadonModal';

describe('PolkadonModal', () => {
  afterEach(cleanup);

  const defaultProps = {
    config: {
      modalTitle: 'Donate to Bob',
      networks: [
        { networkName: 'westend', recipientAddress: 'address1' },
        { networkName: 'rococo', recipientAddress: 'address2' },
        { networkName: 'polkadot', recipientAddress: 'address3' },
        { networkName: 'kusama', recipientAddress: 'address4' },
      ],
      buttonStyles: {
        width: '270',
        height: '50',
        fontSize: '20',
        borderRadius: '15',
      },
    },
    showModal: false,
    closeModal: jest.fn(),
    connectApi: jest.fn(),
    makeDonation: jest.fn(),
    recipient: '',
    subscanAddress: '',
    subscanTransaction: '',
    accounts: [],
    networkData: null,
    donationStatus: '',
    donationInProgress: false,
  };

  test('by default modal should not be rendered', () => {
    render(<PolkadonModal {...defaultProps} />);

    expect(screen.queryByTestId('polkadon-modal')).not.toBeInTheDocument();
  });

  test('once showModal is true, render the modal', () => {
    const props = { ...defaultProps, showModal: true, accounts: [{ accountName: 'accountName', accountAddress: 'accountAddress' }] };
    render(<PolkadonModal {...props} />);

    expect(screen.getByText(props.config.modalTitle)).toBeInTheDocument();
    expect(screen.getByText('Select network')).toBeInTheDocument();
    expect(screen.getByText('Recipient address')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'check on subscan' })).not.toBeInTheDocument();
    expect(screen.getByText('Sender address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Donate now' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Check transaction on subscan' })).not.toBeInTheDocument();
  });

  test('given subscan recipient address, render link for it', () => {
    const props = {
      ...defaultProps,
      showModal: true,
      subscanAddress: 'https://subscan.io/address',
    };
    render(<PolkadonModal {...props} />);

    expect(screen.getByRole('link', { name: 'check on subscan' })).toHaveAttribute('href', props.subscanAddress);
  });

  test('given donation status and subscan transaction address, render link for it', () => {
    const props = {
      ...defaultProps,
      showModal: true,
      donationStatus: 'in progress',
      subscanTransaction: 'https://subscan.io/transaction',
    };
    render(<PolkadonModal {...props} />);

    expect(screen.getByRole('link', { name: 'Check transaction on subscan' })).toHaveAttribute('href', props.subscanTransaction);
  });

  test('changing network should trigger connectApi', () => {
    const props = {
      ...defaultProps,
      showModal: true,
    };
    render(<PolkadonModal {...props} />);

    const selector = screen.getByTestId('select-network');
    fireEvent.change(selector);

    expect(props.connectApi).toBeCalledTimes(1);
  });
});
