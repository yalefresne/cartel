import React, { createContext, useState, useContext } from 'react';

const NotifyContext = createContext();

/**
 * @returns \{notify, message, onClose\}
 * @notify Use this to show a notification
 * @message Used by Notification Component
 * @context Used by Notification Component
 * @onClose Used by Notification Component
 */
const useNotify = () => useContext(NotifyContext);

function NotifyContextProvider({ children }) {

  const [message, setMessage] = useState(undefined);
  const [context, setContext] = useState(undefined);

  /**
   * 
   * @param {String} message The message to be displayed
   * @param {Number} timeout in milliseconds(1000 for 1 second)
   * @param {Boolean} context True by Default.True for Success. False for Fail.
   */
  const notify = (message, timeout, context) => {
    if (timeout === undefined)
      timeout = 3000;
    if (context === undefined)
      context = true;
    setContext(context);
    setMessage(message);
    setTimeout(() => {
      setMessage(undefined);
    }, timeout);
  }

  const onClose = () => setMessage(undefined);


  return (
    <NotifyContext.Provider value={{ notify, message, context, onClose }}>
      {children}
    </NotifyContext.Provider>
  );
}

export { useNotify, NotifyContextProvider };