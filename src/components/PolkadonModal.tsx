import { ChangeEvent, memo } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

import { PolkadonConfig, SenderAccount } from '../constants';

const SFormGroup = styled(Form.Group)`
  margin-bottom: 25px;
`;

interface PolkadonModalProps {
  config: PolkadonConfig;
  showModal: boolean;
  closeModal: () => void;
  connectApi: (networkName: string) => void;
  makeDonation: (sender: string) => void;
  recipient: string;
  subscanAddress: string;
  accounts: SenderAccount[];
}

const PolkadonModal = ({ config, showModal, closeModal, connectApi, makeDonation, recipient, subscanAddress, accounts }: PolkadonModalProps) => {
  const { modalTitle, networks } = config;

  const selectNetwork = (event: ChangeEvent<HTMLSelectElement>) => {
    connectApi(event.target.value);
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <SFormGroup controlId='donationForm.network'>
          <Form.Label>Network</Form.Label>
          <Form.Select onChange={selectNetwork} defaultValue='Select network'>
            <option value='Select network' disabled>
              Select network
            </option>
            {networks.map((network) => (
              <option key={network.networkName} value={network.networkName}>
                {network.networkName}
              </option>
            ))}
          </Form.Select>
        </SFormGroup>
        {recipient && subscanAddress && (
          <SFormGroup controlId='donationForm.recipient'>
            <Form.Label>
              Recipient address{' '}
              <a target='_blank' rel='noreferrer' href={subscanAddress}>
                check on subscan
              </a>
            </Form.Label>
            <Form.Control type='text' value={recipient} disabled />
          </SFormGroup>
        )}
        {accounts.length > 0 && (
          <SFormGroup controlId='donationForm.account'>
            <Form.Label>Sender address</Form.Label>
            <Form.Select defaultValue='Select account'>
              <option value='Select network' disabled>
                Select account
              </option>
              {accounts.map((account: SenderAccount) => (
                <option key={account.accountAddress} value={account.accountAddress}>
                  {account.accountName ?? account.accountAddress}
                </option>
              ))}
            </Form.Select>
          </SFormGroup>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button disabled>Donate now</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(PolkadonModal);
