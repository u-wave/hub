import { Container } from '@u-wave/react-server-list';

const { HUB_SERVER } = process.env;

function App() {
  return <Container hub={HUB_SERVER} />;
}

export default App;
