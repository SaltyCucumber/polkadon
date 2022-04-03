import { ButtonStyles } from '../constants';

export const styleSettings = {
  colors: {
    builder: '#fc8c04',
    white: '#ffffff',
  },
};

export const defaultButtonStyles: ButtonStyles = {
  width: '150',
  height: '40',
  color: styleSettings.colors.white,
  backgroundColor: styleSettings.colors.builder,
  fontSize: '16',
  borderRadius: '10',
  boxShadowColor: styleSettings.colors.builder,
};
