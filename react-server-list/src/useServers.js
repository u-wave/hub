import { loadServers } from './hub';
import useSWR from 'swr';

/**
 * @param {string} hub
 * @return {{ data?: import('./hub').Server[], error?: Error }}
 */
export default function useServers(hub) {
  return useSWR(hub, loadServers, {
    refreshInterval: 30_000,
  });
}
