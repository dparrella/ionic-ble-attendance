(function(){
  angular.module('starter')
  .controller('DeviceController', ['$scope', '$state', '$stateParams', 'DeviceFactory', DeviceController]);

  function DeviceController($scope, $state, $stateParams, DeviceFactory){

    var me = this;

    var service_id = '12AB';
    var characteristic_id = '34CD';

    me.attendee = {
      firstname: '',
      lastname: ''
    }

    $scope.init = function(){
      $scope.device = DeviceFactory.getDevice($stateParams.id);
    }

    var disconnect = function () {
      var params = {"address": $stateParams.id};
      bluetoothle.disconnect(
        function () {
          console.log('Disconnected successfully from ' + $stateParams.id);
          bluetoothle.close(
            function () {
              console.log('Closed successfully.');
            },
            function () {
              console.log('Failed to close.');
            },
            params);
        },
        function () {
          alert('Failed to disconnect from ' + $stateParams.id);
        },
        params);
    }

    $scope.attend = function(){

      var bytes = bluetoothle.stringToBytes(JSON.stringify(me.attendee));
      var value = bluetoothle.bytesToEncodedString(bytes);

      var writeParams = {
        "address": $stateParams.id,
        "service": service_id,
        "characteristic": characteristic_id,
        "value": btoa(JSON.stringify(me.attendee)),
        "type": "response"
      }

      console.log('Attending: ' + JSON.stringify(writeParams));

      bluetoothle.write(
        function(response){
          if(response === 'OK'){
            alert("Your attendance is recorded!");
            disconnect();
            $state.go('home');
          }
        },
        function(err){
          console.error(err);
          alert("Error occured while trying to record your attendance. Please try again.");
        },
        writeParams
      );
    }

    $scope.backToHome = function(){
      $state.go('home');
      disconnect();
    }

  }

})();
