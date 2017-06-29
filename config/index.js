require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 3000,
        modules: {
            verifycode: {
                module: process.cwd() + '/lib'
            }
        }
    },
    production: {
        port: 3000,
        redis: 'redis://redis.db',
        VerifyCodeExpire: 3600,
        modules: {
            verifycode: {
                module: process.cwd() + '/lib'
            }
        }
    }
};

var env = process.env.NODE_ENV || 'development';
config = config[env] || config['development'];
config.env = env;

module.exports = config;
