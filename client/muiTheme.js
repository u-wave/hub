import createPalette from 'material-ui/styles/palette';
import createTheme from 'material-ui/styles/theme';

export default function muiTheme() {
  const palette = createPalette({
    primary: {
      500: '#9d2053',
      700: '#b20062',
      contrastDefaultColor: 'light'
    },
    type: 'dark',
  });

  palette.background.paper = '#303030';

  return createTheme({ palette });
}
