import React from 'react';
import { RouteHandler, Link } from 'react-router';

require('./header.scss');

class Header extends React.Component {
    render() {
        let wrapperClassList = ['header'],
            titleCLassList = ['nav-title'];

        if(this.props.shrink) {;
            wrapperClassList.push('smaller');
            titleCLassList.push('smaller');
        }

        wrapperClassList = wrapperClassList.join(' ');
        titleCLassList = titleCLassList.join(' ');

        return (
            <div className={ wrapperClassList }>
                <div className={ titleCLassList }>Michael Fanger</div>
                <div className='nav'>
                    <Link to='home' className='nav-button' activeClassName='nav-button-active'>Home</Link>
                    <Link to='info' className='nav-button' activeClassName='nav-button-active'>Info</Link>
                </div>
            </div>
        );
    }

    handleScroll() {
        console.log('hello world');
    }
}

export default Header;
