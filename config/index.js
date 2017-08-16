require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 3000,
        lng: 'zh_CN',
        modules: {
            verifycode: {
                module: process.cwd() + '/lib'
            }
        }
    },
    production: {
        port: 3000,
        lng: 'zh_CN',
        redis: 'redis://redis.db',
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
