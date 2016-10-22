
eventSearchApp.controller('ticketmasterController', ['$scope', function ticketmasterController($scope) {

	$scope.ticketmasterEvents = [];



	$scope.getTicketMasterResults = function() {

		$scope.ticketMasterUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + $scope.searchQuery + 
			'&stateCode=' + $scope.geolocation.state + 
			'&apikey=q4TYfyTINvAAreR3WlqGWyqHbZHkmfuG';


		$.ajax({
			type: 'GET',
			url: ticketMasterUrl, 
			dataType: 'json',
			success: function(json) {
				console.log(json);

				if (typeof json._embedded !== 'undefined') {
					displayTicketMasterResults(json._embedded.events);
				} else {
					$('.ticketmaster-results').html('').append('<p>No TicketMaster events found.</p>');
				}
	        },
			error: function(xhr, status, err) {
				console.error('TicketMaster call failed:\n XHR: ' + xhr + '\nStatus: ' + status + '\nError: ' + err);
			}
		});

	};




	$scope.displayTicketMasterResults = function(eventArray) {


		for (var i = 0; i < eventArray.length; i++) {

			var currentEvent = eventArray[i];

			var date = new Date(currentEvent.dates.start.dateTime);

			var city = currentEvent._embedded.venues[0].city,
				state = currentEvent._embedded.venues[0].state,
				country = currentEvent._embedded.venues[0].country,
				location = '';


			if (typeof city !== 'undefined' && typeof state !== 'undefined' ) {

				// if both values are defined then it will add this location and ignore rest of if statement
				location = city.name + ', ' + state.name;

			// anything after the initial if statement will have only one of the values defined, in this case the city	
			} else if (typeof city !== 'undefined' && typeof state === 'undefined') {

				location = city.name;

				// if there is a city but no state, venue might be out of the US, so add a country if possible.
				if (typeof country !== 'undefined') {
					location += ', ' + country.name;
				}

			// only state is defined
			} else if (typeof state !== 'undefined' && typeof city !== 'undefined') {
				location = state.name;

			} else {
				location = '';
			}


			console.log(location);

			$scope.ticketmasterEvents.push({
				url: currentEvent.url || '',
				name: currentEvent.name || '',
				image: currentEvent.images[0].url || '',
				date: (date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() || ''),
				location: location,
				source: 'TicketMaster'
			});

		}
	};




    $scope.$on('eventQuery', function(event, query) { 

    	$scope.getTicketMasterResults();
   	});



}]);