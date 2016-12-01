(function(){
  angular.module('starter')
  .factory('DeviceFactory', [DeviceFactory]);

  function DeviceFactory(){
    var devices = [];
    var deviceIds = {};
    return {
      addDevice: function(device){
        if (deviceIds[device.id]) {
          return;
        }
        devices.push(device);
        deviceIds[device.id] = true;
      },

      getDevices: function(){
        return devices;
      },

      getDevice: function(id){
        var device_found = devices.filter(function(device){
          return device.id == id;
        });
        return device_found[0];
      },

      reset: function(){
        devices = [];
        deviceIds = {};
      }

    };
  }

})();
