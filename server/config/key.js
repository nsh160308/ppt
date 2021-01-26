if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    console.log('process.env', process.env.NODE_ENV);
    module.exports = require('./dev');
}