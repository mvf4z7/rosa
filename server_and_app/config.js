var env = process.env.NODE_ENV || 'development';
console.log('env: ', env)
var config = {
    development: {
        ledProgram: {
            command: 'python',
            args: ['demo.py'],
        }
    },
    production: {
        ledProgram: {
            command: './build.sh',
            args: ['run'],
            options: { cwd: '../oven_control_code' }
        }
    }
}

module.exports = config[env];
