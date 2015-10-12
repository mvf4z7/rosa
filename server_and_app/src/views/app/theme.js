import mui from 'material-ui';
let Colors = mui.Styles.Colors;

let theme = {
    getPalette() {
        return {
            primary1Color: '#09954A',
            primary2Color: '#088C46',
            primary3Color: '#018E43',
            accent1Color: '#0A5CBF',
            accent2Color: '#0B66D5',
            accent3Color: '#0B88D5',
            textColor: Colors.darkBlack,
            canvasColor: Colors.white,
            borderColor: '#0A5CBF',
        };
    },
    getComponentThemes(palette, spacing) {
        let obj = {
            menuItem: {
                hoverColor: 'rgba(0, 0, 0, 0)'
            }
        }

        return obj;
    }
};

export default theme;
