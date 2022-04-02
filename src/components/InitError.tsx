import { memo } from 'react';
import styled from 'styled-components';

import { initErrorTypes } from '../constants';

const SInitError = styled.div`
  padding: 10px 0;
`;
interface InitErrorProps {
  type: string;
}

const InitError = ({ type }: InitErrorProps) => {
  if (type === initErrorTypes.NO_EXTENSION) {
    return (
      <SInitError>
        Please download{' '}
        <a target='_blank' rel='noreferrer' href='https://polkadot.js.org/extension/'>
          Polkadot JS extension
        </a>
      </SInitError>
    );
  }

  if (type === initErrorTypes.NO_ACCOUNT) {
    return <SInitError>No polkadot.js account detected, please add account</SInitError>;
  }

  return null;
};

export default memo(InitError);
