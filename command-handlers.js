module.exports = {
  setup: function(api, nodemiral) {
    if (!api.getConfig().chromadb) {
      console.log(
        'Not setting up chromadb since there is no chromadb config'
      );
      return;
    }

    var chromadbSessions = api.getSessions(['chromadb']);
    var appSessions = api.getSessions(['app']);
    var chromadbConfig = api.getConfig().chromadb;

    if (appSessions.length !== 1) {
      console.log(
        'To use built-in chromadb setup, you have to have only one meteor server'
      );
      return;
    } else if (chromadbSessions[0]._host !== appSessions[0]._host) {
      console.log(
        'To use built-in chromadb setup, both the meteor app and chromadb db need to be on the same server'
      );
      return;
    }

    var list = nodemiral.taskList('Setup Chromadb');

    list.executeScript('Setup Environment', {
      script: api.resolvePath(__dirname, 'assets/chromadb-setup.sh'),
      vars: {
        chromadbVersion: chromadbConfig.version || 'latest',
        chromadbHost: chromadbConfig.host || '127.0.0.1',
        chromadbPort: chromadbConfig.port || '8000',
        chromadbDir: '/opt/chromadb'
      }
    });

    return api.runTaskList(list, appSessions, { verbose: api.getVerbose() });
  },
  logs: function(api) {
    var args = api.getArgs();
    var sessions = api.getSessions(['chromadb']);

    // remove chromadb from args sent to docker
    args.shift();

    return api.getDockerLogs('chromadb', sessions, args);
  },
  start: function(api, nodemiral) {
    var list = nodemiral.taskList('Start Chromadb');
    var sessions = api.getSessions(['chromadb']);
    var config = api.getConfig().chromadb;

    list.executeScript('Start Chromadb', {
      script: api.resolvePath(__dirname, 'assets/chromadb-start.sh'),
      vars: {
        chromadbVersion: config.version || 'latest',
        chromadbHost: config.host || '127.0.0.1',
        chromadbPort: config.port || '8000',
        chromadbDir: '/opt/chromadb'
      }
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  },
  stop: function(api, nodemiral) {
    var sessions = api.getSessions(['chromadb']);
    var list = nodemiral.taskList('Stop Chromadb');
    
    list.executeScript('Stop Chromadb', {
      script: api.resolvePath(__dirname, 'assets/chromadb-stop.sh')
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  }
};
