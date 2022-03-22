import { memo, useState } from 'react';
import Form from 'react-bootstrap/Form';

import Polkadon from './Polkadon';

const Demo = () => {
  const [receiver, setReceiver] = useState();

  // TODO create dynamic config

  return (
    <>
      <Form>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Receiver address:</Form.Label>
          <Form.Control type='text' placeholder='Enter donation receiver address' />
        </Form.Group>
      </Form>
      {receiver && (
        <Polkadon receiver={receiver} />
      )}
    </>
  );
};

export default memo(Demo);
