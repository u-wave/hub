import * as Colors from 'material-ui/styles/colors';
import * as ColorManipulator from 'material-ui/styles/colorManipulator';
import * as Spacing from 'material-ui/styles/spacing';

export default {
  spacing: Spacing,
  fontFamily: 'Open Sans, sans-serif',
  palette: {
    primary1Color: '#9d2053',
    primary2Color: '#b20062',
    primary3Color: Colors.lightWhite,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.white,
    alternateTextColor: Colors.lightWhite,
    canvasColor: '#303030',
    borderColor: ColorManipulator.fade(Colors.fullWhite, 0.3),
    disabledColor: ColorManipulator.fade(Colors.darkWhite, 0.3),
  },
};
