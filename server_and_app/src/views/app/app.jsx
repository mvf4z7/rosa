import React from 'react';
import { RouteHandler, Link } from 'react-router';

import Header from '../../components/header/header';

import mui from 'material-ui';
let ThemeManager = new mui.Styles.ThemeManager();


require('./app.scss');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { shrink: false };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    handleScroll() {
        let distanceY = window.pageYOffset,
            shrinkOn = 300;

        console.log('scroll event captured: ', distanceY);
        if(!this.state.shrink && distanceY > shrinkOn) {
            this.setState({ shrink: true });
        } else if (this.state.shrink && distanceY < shrinkOn) {
            this.setState({ shrink: false });
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
    		<div className="app-wrapper">
                <Header shrink={ this.state.shrink }/>
                <RouteHandler />
    		</div>
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
