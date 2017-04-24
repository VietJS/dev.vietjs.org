var socket = io.connect();
var binId = '';

Vue.filter('formatDate', function(value) {
  return new Date(value);
});

var app = new Vue({
  el: '#app',
  data: {
    binId: '',
    binUrl: '',
    requests: []
  },
  methods: {
    setBinId: function (binId) {
      this.binId = binId;
      this.binUrl = getBasePath() + '/r/' + this.binId;
    },
    createBin: function () {
      socket.emit('createBin', {}, function () {
        console.log('createBin ....')
      });
    }
  }
});

var matchBinId = window.location.href.match(/\/([a-zA-Z0-9]+)\/inspect/);
if (matchBinId) {
  binId = matchBinId[1];
  app.setBinId(binId);
}

if (!binId) {
  socket.on('binId', function (data) {
    window.location.href = `/r/${data}/inspect`;
  });
}

socket.on('bin_' + binId, function (data) {
  app.requests.push(data);
});

function getBasePath() {
  let location = window.location;
  return location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '');
}