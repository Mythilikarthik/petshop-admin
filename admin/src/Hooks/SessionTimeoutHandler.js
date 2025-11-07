import React from 'react';
import useSessionTimeout from './useTimeoutSession';

const SessionTimeoutHandler = () => {
  useSessionTimeout(30);
  return null;
};

export default SessionTimeoutHandler;
