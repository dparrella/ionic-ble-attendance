var bleno = require('bleno');

var attendees = [];
var settings = {
  service_id: '12AB',
  characteristic_id: '34CD'
};

bleno.on('stateChange', function(state){
  if(state === 'poweredOn'){
    console.log('Device is on, advertising...');
    bleno.startAdvertising('AttendanceApp', [settings.service_id]);
  }else{
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error){
    if(error){
      // error on advertise start
      console.log('Failed to start advertising');
    }else{
      console.log('started..');
      bleno.setServices([
        new bleno.PrimaryService({
          uuid : settings.service_id,
          characteristics : [
            new bleno.Characteristic({
              value : null,
              uuid : settings.characteristic_id,
              properties : ['write'],
              onWriteRequest : function(data, offset, withoutResponse, callback){
                var attendee = JSON.parse(data.toString());
                attendee.time_entered = Date.now();
                attendees.push(attendee);
                console.log(attendees);
                callback(this.RESULT_SUCCESS);
              }
            })
          ]
        })
      ]);
    }
});
