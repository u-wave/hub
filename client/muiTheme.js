import createPalette from 'material-ui/styles/palette';
import createTheme from 'material-ui/styles/theme';
import { pink } from 'material-ui/styles/colors';

export default function muiTheme() {
  const palette = createPalette({
    primary: {
      ...pink,
      500: '#9d2053',
      700: '#b20062',
      contrastDefaultColor: 'light'
    },
    type: 'dark',
  });

  palette.background.paper = '#303030';

  return createTheme({ palette });
}
