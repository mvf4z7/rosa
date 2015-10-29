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
            command: './mpu_prog.elf',
            args: ['../server_and_app/profile.json'],
            options: { cwd: '../oven_control_code' }
        }
    }
}

module.exports = config[env];
