import useSWR from 'swr';
import { loadServers } from './hub';

export default function useServers(hub: string) {
  return useSWR(hub, loadServers, {
    refreshInterval: 30_000,
  });
}
