const scss = require('rollup-plugin-scss');
module.exports = {
    rollup(config, options) {
        config.plugins.push(
            scss({fileName:"css/extremum-studio-components.css"})
        );
        return config;
    },
};
