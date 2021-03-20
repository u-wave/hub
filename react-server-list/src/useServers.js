import useSWR from 'swr';
import { loadServers } from './hub';

/**
 * @param {string} hub
 * @return {{ data?: import('./hub').Server[], error?: Error }}
 */
export default function useServers(hub) {
  return useSWR(hub, loadServers, {
    refreshInterval: 30_000,
  });
}
