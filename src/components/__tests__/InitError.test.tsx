import { cleanup, render, screen } from '@testing-library/react';

import { initErrorTypes } from '../../constants';
import InitError from '../InitError';

describe('InitError', () => {
  afterEach(cleanup);

  test('If polkadot extension was not found then show suggestion to download it', () => {
    render(<InitError type={initErrorTypes.NO_EXTENSION} />);
  
    expect(screen.getByText('Please download')).toBeInTheDocument();
    expect(screen.queryByText('No polkadot.js account detected')).not.toBeInTheDocument();
  });
  
  test('If no account present in polkadot extension then show suggestion to add one', () => {
    render(<InitError type={initErrorTypes.NO_ACCOUNT} />);
  
    expect(screen.getByText('No polkadot.js account detected, please add account')).toBeInTheDocument();
    expect(screen.queryByText('Please download')).not.toBeInTheDocument();
  });
})
