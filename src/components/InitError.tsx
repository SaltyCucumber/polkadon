import { memo } from 'react';

import { initErrorTypes } from '../constants/errorTypes';

interface InitErrorProps {
  type: string;
}

const InitError = ({ type }: InitErrorProps) => {
  if (type === initErrorTypes.NO_EXTENSION) {
    return (
      <div>
        Please download{' '}
        <a target='_blank' rel='noreferrer' href='https://polkadot.js.org/extension/'>
          Polkadot JS extension
        </a>
      </div>
    );
  }

  if (type === initErrorTypes.NO_ACCOUNT) {
    return <div>No polkadot.js account detected, please add account</div>;
  }

  return null;
};

export default memo(InitError);
