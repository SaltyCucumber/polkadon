import { ChangeEvent, FormEvent, memo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

import { Donation, NetworkData, PolkadonConfig, SenderAccount } from '../constants';

const SFormGroup = styled(Form.Group)`
  margin-bottom: 25px;
`;

interface PolkadonModalProps {
  config: PolkadonConfig;
  showModal: boolean;
  closeModal: () => void;
  connectApi: (networkName: string) => void;
  makeDonation: ({ sender, amount }: Donation) => void;
  recipient: string;
  subscanAddress: string;
  subscanTransaction: string;
  accounts: SenderAccount[];
  networkData: NetworkData | null;
  donationStatus: string;
  donationInProgress: boolean;
}

const PolkadonModal = ({
  config,
  showModal,
  closeModal,
  connectApi,
  makeDonation,
  recipient,
  subscanAddress,
  subscanTransaction,
  accounts,
  networkData,
  donationStatus,
  donationInProgress,
}: PolkadonModalProps) => {
  const { modalTitle, networks } = config;
  const [validated, setValidated] = useState(false);

  const selectNetwork = (event: ChangeEvent<HTMLSelectElement>) => {
    connectApi(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.target as HTMLFormElement;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    const data = new FormData(form);
    const formProps = Object.fromEntries(data) as unknown as Donation;
    makeDonation(formProps);
  };

  const handleClose = () => {
    closeModal();
    setValidated(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <SFormGroup controlId='donationForm.network'>
            <Form.Label>Network</Form.Label>
            <Form.Select required onChange={selectNetwork}>
              <option value=''>Select network</option>
              {networks.map((network) => (
                <option key={network.networkName} value={network.networkName}>
                  {network.networkName}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type='invalid'>Select network to make donation</Form.Control.Feedback>
          </SFormGroup>

          <SFormGroup controlId='donationForm.recipient'>
            <Form.Label>
              Recipient address{' '}
              {subscanAddress && (
                <a target='_blank' rel='noreferrer' href={subscanAddress}>
                  check on subscan
                </a>
              )}
            </Form.Label>
            <Form.Control required type='text' value={recipient} disabled />
          </SFormGroup>

          {accounts.length > 0 && (
            <>
              <SFormGroup controlId='donationForm.account'>
                <Form.Label>Sender address</Form.Label>
                <Form.Select name='sender' required>
                  <option value=''>Select account</option>
                  {accounts.map((account: SenderAccount) => (
                    <option key={account.accountAddress} value={account.accountAddress}>
                      {account.accountName ?? account.accountAddress}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Select address you wish to donate from</Form.Control.Feedback>
              </SFormGroup>
              <SFormGroup controlId='donationForm.amount'>
                <Form.Label>Amount {networkData?.symbol}</Form.Label>
                <Form.Control name='amount' required placeholder='0.00' pattern='(0\.[0-9]*)|([1-9][0-9]*(\.[0-9]+)?)' type='text' />
                <Form.Control.Feedback type='invalid'>Invalid amount</Form.Control.Feedback>
              </SFormGroup>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={donationInProgress} type='submit'>
            Donate now
          </Button>
        </Modal.Footer>

        {donationStatus && (
          <Modal.Body>
            <div>Status: {donationStatus}</div>
            {subscanTransaction && (
              <a target='_blank' rel='noreferrer' href={subscanTransaction}>
                Check transaction on subscan
              </a>
            )}
          </Modal.Body>
        )}
      </Form>
    </Modal>
  );
};

export default memo(PolkadonModal);
