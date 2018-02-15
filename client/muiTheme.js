import createPalette from 'material-ui/styles/createPalette';
import createTheme from 'material-ui/styles/createMuiTheme';
import pink from 'material-ui/colors/pink';

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
