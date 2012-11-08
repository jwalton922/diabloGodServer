'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('diabloApp.services', [])
  .factory('appConstants', function () {
  	var appConstants = {};

  	appConstants.rootUrl = 'http://serene-brook-2107.herokuapp.com/';
  
  	return appConstants;
  });