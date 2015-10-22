var env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        ledProgram: {
            command: 'python',
            args: ['demo.py'],
        }
    },
    production: {
        ovenControlProgram: {
            command: './build.sh',
            args: ['run'],
            options: { cwd: '../oven_control_code' }
        }
    }
}

module.exports = config[env];
