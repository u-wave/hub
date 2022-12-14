import { Container } from '@u-wave/react-server-list';

const { VITE_HUB_SERVER } = import.meta.env;

function App() {
  return <Container hub={VITE_HUB_SERVER} />;
}

export default App;
