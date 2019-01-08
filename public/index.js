'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

var i;

function BookingPrice(barId, time, persons, deductibleReduction)
{
  var pricePerHour;
  var pricePerPerson;
  var bookingPrice;
  for(i=0; i<bars.length; i++)
  {
    if(bars[i].id === barId)
    {
      pricePerHour = bars[i].pricePerHour;
      pricePerPerson = bars[i].pricePerPerson;
    }
  }

  if(persons>10)
  {
    if(persons>20)
    {
      if(persons>60)
      {
        var timeComponent = time * pricePerHour;
        var peopleComponent = persons * pricePerPerson * 0.5;
      }
      else{
        var timeComponent = time * pricePerHour;
        var peopleComponent = persons * pricePerPerson * 0.7;
      }
    }
    else{
      var timeComponent = time * pricePerHour;
      var peopleComponent = persons * pricePerPerson * 0.9;
    }
  }
  else{
    var timeComponent = time * pricePerHour;
    var peopleComponent = persons * pricePerPerson;
  }

  bookingPrice = timeComponent+peopleComponent;

  var reduc = 0;

  if(deductibleReduction)
  {
    reduc += persons;
  }



  var commission = bookingPrice*0.3;
  var insurance = commission*0.5;
  var treasury = persons;
  var privateaser = commission - insurance - treasury + reduc;
  //bookingPrice+=reduc;


  var values = [bookingPrice, insurance, treasury, privateaser, commission, reduc];

  return values;
}

var j=0;


for(j=0; j<events.length; j++)
{
  var values = BookingPrice(events[j].barId, events[j].time, events[j].persons, events[j].options.deductibleReduction)

  events[j].price = values[0];
  events[j].commission.insurance = values[1];
  events[j].commission.treasury = values[2];
  events[j].commission.privateaser = values[3];

  //Paying actors
  var k=0;
  for(k=0; k<actors.length; k++)
  {
    if(events[j].id === actors[k].eventId)
    {
      actors[k].payment[0].amount = values[0];
      actors[k].payment[1].amount = values[0] - values[4] - values[5];
      actors[k].payment[2].amount = values[1];
      actors[k].payment[3].amount = values[2];
      actors[k].payment[4].amount = values[3];
    }
  }
}



console.log(bars);
console.log(events);
console.log(actors);
