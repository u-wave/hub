import React from 'react';
import { loadServers, announceEvents } from './hub';

const {
  useCallback,
  useEffect,
  useState,
} = React;

function addServer(list, update) {
  const servers = list.map((server) => (server.publicKey === update.publicKey ? update : server));
  if (servers.indexOf(update) === -1) {
    servers.unshift(update);
  }
  return servers;
}

/**
 * @param {string} hub
 * @return {import('./hub').Server[]}
 */
export default function useServers(hub) {
  const [servers, setServers] = useState(null);

  const handleUpdate = useCallback((update) => {
    setServers((existingServers) => addServer(existingServers, update));
  }, []);

  useEffect(() => {
    loadServers(hub).then((newServers) => {
      setServers(newServers);
    });

    const events = announceEvents(hub, handleUpdate);
    return () => events.remove();
  }, [hub, handleUpdate]);

  return servers;
}
