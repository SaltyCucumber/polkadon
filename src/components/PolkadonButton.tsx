import { memo } from 'react';

interface PolkadonButtonProps {
  makeDonation: (sender: string) => void;
}

const PolkadonButton = ({ makeDonation }: PolkadonButtonProps) => {
  const initDonationModal = () => {
    // TODO init modal with inputs
  };

  // const confirmDonation = (sender: string) => {
  //   makeDonation(sender);
  // };

  return <button onClick={initDonationModal}>Donate now!</button>;
};

export default memo(PolkadonButton);
