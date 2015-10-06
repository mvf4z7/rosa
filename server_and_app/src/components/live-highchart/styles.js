import theme from '../../views/app/theme';
let palette = theme.getPalette();

let styles = {
    chartWrapper: {
        height: '70%',
        margin: '1rem 1rem'
    },
    highChart: {
        height: '100%'
    },
    spinnerWrapper: {
        display: '-webkit-box',
        display: '-ms-flexbox',
        display: '-webkit-flex',
        display: 'flex',
        WebkitAlignItems: 'center',
        alignItems: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center',
        height: '70%',
        margin: '1rem 1rem',
        color: palette.accent1Color
    },
    spinner: {

    }
};

export default styles;
