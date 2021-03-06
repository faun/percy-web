/*global module*/

module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    screens: {
      xs: '460px',
      sm: '544px',
      md: '768px',
      lg: '1012px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      translucent: 'rgba(0, 0, 0, 0.5)',
      white: '#fff',
      dark: {
        '300': '#9c9ca1',
        '400': '#505053',
        '500': '#38383a',
        '600': '#2c2c2c',
        '700': '#242425',
        '800': '#1e1e1e',
        '900': '#0f0f10',
      },
      gray: {
        '000': '#fbfafc',
        '100': '#f0eef1',
        '200': '#e1dfe2',
        '300': '#a69fa8',
        '400': '#7c727f' /* secondary-text-color */,
        '500': '#69616b',
        '600': '#544e56',
        '700': '#3f3a40' /* base-color */,
        '800': '#2a272b',
        '900': '#151315',
      },
      red: {
        '000': '#fdeeed',
        '100': '#f8cdc9',
        '200': '#f4aca4',
        '300': '#ef8b80',
        '400': '#eb6a5c',
        '500': '#e74e3e' /* base-color */,
        '600': '#da2e1b',
        '700': '#b62616',
        '800': '#911f12',
        '900': '#6d170d',
      },
      orange: {
        '100': '#ffefe6',
        '500': '#ff7b2f',
      },
      yellow: {
        '000': '#fffbeb',
        '100': '#fff2c2',
        '200': '#ffe999',
        '300': '#ffe070',
        '400': '#ffd542' /* base-color */,
        '500': '#ffce1f',
        '600': '#f5c000',
        '700': '#cca000',
        '800': '#a38000',
        '900': '#7a6000',
      },
      green: {
        '000': '#edfaee',
        '100': '#d9f4dc',
        '200': '#bbecc2',
        '300': '#99e3a2',
        '400': '#6fd77c',
        '500': '#43cb54' /* base-color */,
        '600': '#30b041',
        '700': '#279035',
        '800': '#1f702a',
        '900': '#16501e',
      },
      blue: {
        '000': '#ebf5fe',
        '100': '#c9e4f8',
        '200': '#a5d3f3',
        '300': '#81c1ef',
        '400': '#5dafea',
        '500': '#1faaee' /* base-color */,
        '600': '#1773b5',
        '700': '#135c90',
        '800': '#0e456c',
        '900': '#092e48',
      },
      purple: {
        '000': '#fefcfe',
        '100': '#fdfafe',
        '200': '#fbf6fd',
        '300': '#f6edfa',
        '400': '#eedbf6',
        '500': '#d7b5e5',
        '600': '#9e66bf' /* brand-color */,
        '700': '#7d3395',
        '800': '#5c007a',
        '900': '#2c023f',
      },
    },
    spacing: {
      px: '1px',
      xs: '2px',
      sm: '4px',
      '0': '0',
      '1': '8px',
      '1-1/2': '12px',
      '2': '16px',
      '3': '24px',
      '4': '32px',
      '5': '40px',
      '6': '48px',
      '7': '56px',
      '8': '64px',
      '9': '72px',
      '16': '128px',
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: 'var(--bg-color-primary)',
      secondary: 'var(--bg-color-secondary)',
      ternary: 'var(--bg-color-ternary)',
      code: 'var(--bg-color-code)',
      'btn-toggle': 'var(--bg-color-action-toggle)',
      action: 'var(--bg-color-action)',
    }),
    backgroundPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    },
    borderColor: theme => ({
      ...theme('colors'),
      default: 'var(--border-color-primary)',
      secondary: 'var(--border-color-secondary)',
      ternary: 'var(--border-color-ternary)',
      quaternary: 'var(--border-color-quaternary)',
      input: 'var(--border-color-input)',
    }),
    borderRadius: {
      none: '0',
      sm: '2px',
      default: '4px',
      lg: '6px',
      xl: '8px',
      full: '9999px',
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    },
    boxShadow: {
      default: '0 2px 4px 0 rgba(0,0,0,0.10)',
      md: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(63, 58, 64, 0.06)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      none: 'none',
      'purple-underline': '0 1px 0 #9e66bf',
      'input-focus': '0px 0px 8px rgba(158, 102, 191, 0.2)',
      'purple-lg': '0 4px 12px rgba(158, 102, 191, 0.4)',
      px: '0px 1px 0px var(--shadow-px)',
    },
    container: {},
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      'not-allowed': 'not-allowed',
    },
    fill: {
      current: 'currentColor',
    },
    flex: {
      '1': '1 1 0%',
      '2': '2 2 0%',
      '3': '3 3 0%',
      '4': '4 4 0%',
      '5': '5 5 0%',
      '6': '6 6 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
    },
    flexGrow: {
      '0': '0',
      default: '1',
    },
    flexShrink: {
      '0': '0',
      default: '1',
    },
    fontFamily: {
      sans: [
        'proxima-nova',
        'system-ui',
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      serif: [
        'Constantia',
        'Lucida Bright',
        'Lucidabright',
        'Lucida Serif',
        'Lucida',
        'DejaVu Serif',
        'Bitstream Vera Serif',
        'Liberation Serif',
        'Georgia',
        'serif',
      ],
      mono: [
        'source-code-pro',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    fontSize: {
      '2xs': '8px',
      xs: '10px',
      sm: '12px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '42px',
      '5xl': '48px',
      nav: '14px',
    },
    fontWeight: {
      hairline: '100',
      thin: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    height: {
      auto: 'auto',
      full: '100%',
      screen: '100vh',
      '0': '0',
      px: '1px',
      '1': '4px',
      '2': '8px',
      '3': '16px',
      '4': '1rem',
      '6': '1.5rem',
      '8': '25px',
      '10': '30px',
      '11': '34px',
      '12': '42px',
      '14': '14px',
      '16': '4rem',
      '20': '20px',
      '24': '110px',
      '28': '28px',
      '32': '8rem',
      '40': '40px',
      '48': '12rem',
      '64': '16rem',
    },
    inset: {
      '0': '0',
      auto: 'auto',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.05em',
      normal: '0',
      sm: '.5px',
      px: '1px',
      wide: '2px',
      wider: '0.05em',
      widest: '0.1em',
    },
    lineHeight: {
      none: '1',
      tight: '1.3',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      loosest: '3',
    },
    listStyleType: {
      none: 'none',
      circle: 'circle',
      disc: 'disc',
      decimal: 'decimal',
    },
    margin: (theme, {negative}) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...negative(theme('spacing')),
    }),
    maxHeight: {
      full: '100%',
      screen: '100vh',
      '28': '28px',
    },
    maxWidth: {
      '0': '0',
      xs: '460px',
      sm: '544px',
      md: '768px',
      lg: '1012px',
      xl: '1280px',
      '2xl': '70rem',
      '3xl': '80rem',
      '4xl': '90rem',
      '5xl': '100rem',
      full: '100%',
    },
    minHeight: {
      '0': '0',
      full: '100%',
      screen: '100vh',
    },
    minWidth: {
      '0': '0',
      full: '100%',
    },
    objectPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
    opacity: {
      '0': '0',
      '25': '0.25',
      '50': '0.5',
      '75': '0.75',
      '100': '1',
    },
    order: {
      first: '-9999',
      last: '9999',
      none: '0',
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9',
      '10': '10',
      '11': '11',
      '12': '12',
    },
    padding: theme => theme('spacing'),
    placeholderColor: theme => theme('colors'),
    stroke: {
      current: 'currentColor',
    },
    textColor: theme => ({
      ...theme('colors'),
      primary: 'var(--text-color-primary)',
      secondary: 'var(--text-color-secondary)',
      btn: 'var(--text-color-btn)',
    }),
    width: {
      auto: 'auto',
      '0': '0',
      px: '1px',
      '1': '4px',
      '2': '8px',
      '3': '16px',
      '4': '1rem',
      '6': '1.5rem',
      '8': '25px',
      '9': '2.5rem',
      '10': '38px',
      '12': '3rem',
      '14': '14px',
      '16': '4rem',
      '20': '20px',
      '24': '110px',
      '28': '28px',
      '32': '8rem',
      '40': '40px',
      '48': '12rem',
      '64': '16rem',
      '320': '320px',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      '90vw': '90vw',
      full: '100%',
      screen: '100vw',
    },
    zIndex: {
      auto: 'auto',
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      top: 999999,
    },
  },
  variants: {
    accessibility: ['responsive', 'focus'],
    alignContent: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    cursor: ['responsive'],
    display: ['responsive'],
    fill: ['responsive'],
    flex: ['responsive'],
    flexDirection: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    flexWrap: ['responsive'],
    float: ['responsive'],
    fontFamily: ['responsive'],
    fontSize: ['responsive'],
    fontSmoothing: ['responsive'],
    fontStyle: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    inset: ['responsive'],
    justifyContent: ['responsive'],
    letterSpacing: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    objectFit: ['responsive'],
    objectPosition: ['responsive'],
    opacity: ['responsive', 'hover', 'focus'],
    order: ['responsive'],
    outline: ['responsive', 'focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    placeholderColor: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    stroke: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    wordBreak: ['responsive'],
    zIndex: ['responsive'],
  },
  corePlugins: {},
  plugins: [
    function ({addUtilities}) {
      const newUtilities = {
        '.trans': {
          transition: 'all 250ms ease-in-out',
        },
        '.trans-opacity': {
          'transition-property': 'opacity',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
