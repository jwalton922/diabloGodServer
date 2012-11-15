'use strict';

/* Filters */

angular.module('diabloApp.filters', []).
  filter('caps', function() {
  	return function(input, output) {
  		return input.replace(/_/g, " ");
  	}
  });
