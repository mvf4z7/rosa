import Radium from 'radium';

let keyFrames = Radium.keyframes({
	'0%': { transform: 'rotate(0deg)' },
	'100%': { transform: 'rotate(360deg)' }
}, 'Spinner');

let styles = {
	spinnerWrapper: {
		display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70%',
        margin: '1rem 1rem',
	},
	spinner: {
		animation: `${keyFrames} 1500ms infinite linear`,
		borderRadius: '0.5em',
		boxShadow: 'rgba(10, 92, 191, 0.7) 1.5em 0 0 0, rgba(10, 92, 191, 0.7) 1.1em 1.1em 0 0, rgba(10, 92, 191, 0.7) 0 1.5em 0 0, rgba(10, 92, 191, 0.7) -1.1em 1.1em 0 0, rgba(10, 92, 191, 0.7) -1.5em 0 0 0, rgba(10, 92, 191, 0.7) -1.1em -1.1em 0 0, rgba(10, 92, 191, 0.7) 0 -1.5em 0 0, rgba(10, 92, 191, 0.7) 1.1em -1.1em 0 0',
		display: 'inline-block',
		fontSize: '10px',
		width: '1em',
		height: '1em',
		margin: '1.5em',
		overflow: 'hidden',
		textIndent: '100%'
	}
}

export default styles;
