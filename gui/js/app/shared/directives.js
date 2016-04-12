/* global angular:false */

/**
 * This file defines custom directives that can be attached to HTML
 * elements to perform DOM manipulation operations.
 * 
 * @author lambert8
 * @see https://opensource.ncsa.illinois.edu/confluence/display/~lambert8/Directives
 */
angular.module('ndslabs-directives', [])
.directive('uniqueStack', [ '_', 'Stacks', function(_, Stacks) {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      var fieldName = attrs.uniqueStack || 'name';

      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;

        // Value already exists
        if (_.find(Stacks.all, [ fieldName, value ])) {
          ngModel.$setValidity('unique', false); 
        } else {
          ngModel.$setValidity('unique', true); 
        }

        return value;
      })
    }
  }
}])
.directive('uniqueVolume', [ '_', 'Volumes', function(_, Volumes) {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      var fieldName = attrs.uniqueVolume || 'name';

      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;

        // Value already exists
        if (_.find(Volumes.all, [ fieldName, value ])) {
          ngModel.$setValidity('unique', false); 
        } else {
          ngModel.$setValidity('unique', true); 
        }

        return value;
      })
    }
  }
}]);