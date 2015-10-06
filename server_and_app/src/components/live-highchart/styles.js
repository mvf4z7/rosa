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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70%',
        margin: '1rem 1rem',
        color: palette.accent1Color
    },
    spinner: {

    }
};

export default styles;
