(function(){
  angular.module('starter')
  .controller('HomeController', ['$scope', '$state', 'DeviceFactory', HomeController]);

  function HomeController($scope, $state, DeviceFactory){

    $scope.devices = [];

    $scope.scan = function(){
      console.log('Scanning for devices.');
      DeviceFactory.reset();

      var scanParams = {
        "services": []
      };

      bluetoothle.startScan(
        function(status){
          switch (status.status) {
            case 'scanStarted':
              console.log('Scan has started successfully.');
              break;
            case 'scanResult':
              var device = status;

              console.log('Found device: ' + JSON.stringify(device));

              if (device.name) {
                DeviceFactory.addDevice({ 'id': device.address, 'name': device.name });
              }
              break;
            default:
              console.error('Unknown status object returned: ' + JSON.stringify(status));
          }
        },
        function(err){
          console.log('Failed to scan for devices.');
          alert('Scanning failed. Please try again.');
        },
        scanParams
      );

      setTimeout(
          bluetoothle.stopScan,
          10000,
          function(){
            $scope.$apply(function(){
              $scope.devices = DeviceFactory.getDevices();
            });
          },
          function(){
            // Stopping scan failed
            console.error('Failed to stop scanning.');
          }
      );

    }

    $scope.connect = function(device_id){
      bluetoothle.connect(
        function(res){
          console.log('Connected to device ' + device_id + ' successfully.');
          console.log(res);

          bluetoothle.discover(
            function (result) {
              console.debug(JSON.stringify(result));
            },
            function (error) {
              console.error(JSON.stringify(error));
            },
            {"address": device_id, "clearCache": true});

          $state.go('device', { 'id': device_id });
        },
        function(err){
          alert('Something went wrong while trying to connect. Please try again');
        },
        { "address": device_id }
      );
    }

  }

})();
