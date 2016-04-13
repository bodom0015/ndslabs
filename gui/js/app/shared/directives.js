/* global angular:false */

/**
 * This file defines custom directives that can be attached to HTML
 * elements to perform DOM manipulation operations.
 * 
 * @author lambert8
 * @see https://opensource.ncsa.illinois.edu/confluence/display/~lambert8/Directives
 */
angular.module('ndslabs-directives', [])
.directive('unique', [ '_', function(_) {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      // Grab our source list using the defined attribute value and scope
      var sourceName = attrs.unique

      // Figure out which field to look at to determine uniqueness
      var fieldName = attrs.uniqueField || 'name';
      
      // Add a parser that will enforce uniqueness on this field
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        
        var source = [];
        if (sourceName.indexOf(";") === -1 ) {
          source = scope[sourceName];
        } else {
          var split = _.split(sourceName, ";");
          while (split.length > 0) {
            source = _.concat(source, scope[split[0]]);
            split = _.drop(split);
          }
        }

        // Value already exists
        if (_.find(source, [ fieldName, value ])) {
          ngModel.$setValidity('unique', false); 
        } else {
          ngModel.$setValidity('unique', true); 
        }

        return value;
      })
    }
  }
}]);