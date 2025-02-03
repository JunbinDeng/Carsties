import EmptyFilter from '@/app/components/EmptyFilter';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SignIn(searchParams: any) {
  const callbackUrl = (await searchParams).callbackUrl;
  return (
    <EmptyFilter
      title='You need to be logged in to do that'
      subtitle='Please click below to login'
      showLogin
      callbackUrl={callbackUrl}
    />
  );
}
