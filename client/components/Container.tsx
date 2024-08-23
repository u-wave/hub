import Loading from './Loading';
import ServerList from './ServerList';
import useServers from './useServers';

type ContainerProps = {
  /** URL of the announce server to use to discover üWave servers. */
  hub?: string,
};
function Container({ hub = 'https://announce.u-wave.net/' }: ContainerProps) {
  const { data, error } = useServers(hub);

  if (error) {
    return <Loading message={error.message} />;
  }
  if (data) {
    return <ServerList servers={data} />;
  }

  return <Loading message="Loading available servers..." />;
}

export default Container;
