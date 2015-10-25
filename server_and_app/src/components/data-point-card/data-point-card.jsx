import React from 'react';
import Radium from 'radium';

class DataPointCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={styles.container}>
                DataPointCard
            </div>
        );
    }


}



let styles = {
    container: {
        display: 'inline-block',
        backgroundColor: '#FFFAFA',
        boxShadow: '0px 10px 6px -6px #777',
        padding: '2rem',
        margin: '1rem 1rem'
    }
};

export default Radium(DataPointCard);
