(function(){
  angular.module('starter')
  .controller('HomeController', ['$scope', '$state', 'DeviceFactory', HomeController]);

  function HomeController($scope, $state, DeviceFactory){

    $scope.devices = [];

    $scope.scan = function(){
      console.log('Scanning for devices.');
      DeviceFactory.reset();

      var scanParams = {"services": []};

      bluetoothle.startScan(
        function(status){
          if (status.status === 'scanStarted') {
            console.log('Scan has started successfully.');
          } else if (status.status === 'scanResult') {
            var device = status;
            console.log(device);

            var name = device.name ? device.name : 'Unknown';

            DeviceFactory.addDevice({ 'id': device.address, 'name': name });
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

    var getCharacteristics = function (device_id, service_id) {
      var params = {"address": device_id, "service": service_id};

      console.log('Getting characteristics for service ' + service_id + ' on device ' + device_id);

      bluetoothle.characteristics(
            function (result) {
              console.log(result);
            },
            function (error) {
              alert('Could not retrieve characteristics from the device/service.');
            },
            params);
    }

    $scope.connect = function(device_id){
      bluetoothle.connect(
        function(res){
          console.log('Connected to device ' + device_id + ' successfully.');
          console.log(res);

          bluetoothle.services(
            function (result) {
              console.log(result);
              if (result.services && result.services.length > 0) {
                for (i = 0; i < result.services.length; i++) {
                  getCharacteristics(device_id, result.services[i]);
                }
              }
            },
            function (result) {
              console.log(result);
              alert('Could not retrieve services from the device.');
            },
            {"address": device_id});

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
