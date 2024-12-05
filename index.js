var commandHandlers = require('./command-handlers');
var validate = require('./validate');

module.exports = {
  name: 'chromadb',
  description: 'Commands to setup and manage Chromadb',
  commands: {
    setup: {
      description: 'Installs and starts Chromadb',
      handler: commandHandlers.setup
    },
    logs: {
      description: 'View Chromadb logs',
      builder: function(yargs) {
        return yargs.strict(false);
      },
      handler: commandHandlers.logs
    },
    start: {
      description: 'Start Chromadb',
      handler: commandHandlers.start
    },
    stop: {
      description: 'Stop Chromadb',
      handler: commandHandlers.stop
    }
  },
  validate: {
    chromadb: validate
  },
  prepareConfig: function(config) {
    if (config.app && config.chromadb) {
      if (!config.app.docker) {
        config.app.docker = {};
      }
      if (!config.app.docker.args) {
        config.app.docker.args = [];
      }

      config.app.docker.args.push('--link=chromadb:chromadb');
      config.app.docker.args.push('--env=CHROMA_DB_URL=http://chromadb:8000');
    }
  },
  hooks: {
    'post.setup': function(api) {
      if (!api.getConfig().chromadb) {
        return;
      }

      return api.runCommand('chromadb.setup')
        .then(function() {
          return api.runCommand('chromadb.start');
        });
    }
  }
};
