'use client';

import React, { useState } from 'react';
import { updateAuctionTest } from '../actions/auctionActions';
import { Button } from 'flowbite-react';

export default function AuthTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<never>();

  function doUpdate() {
    setResult(undefined);
    setLoading(true);
    updateAuctionTest()
      .then((res) => setResult(res))
      .catch((err) => setResult(err))
      .finally(() => setLoading(false));
  }

  const resultText = JSON.stringify(result, null, 2);

  return (
    <div className='flex items-center gap-4'>
      <Button outline isProcessing={loading} onClick={doUpdate}>
        Test auth
      </Button>
      <div>{resultText}</div>
    </div>
  );
}
