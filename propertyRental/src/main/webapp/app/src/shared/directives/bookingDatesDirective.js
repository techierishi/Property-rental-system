var propertyDirective = angular.module("BookingDatesDirective", []);
/**
 * Check whether check in and check out dates match with each other.
 */
propertyDirective.directive('checkDatesMatch', function () {
    var isValid = function(name,date1,date2) {
		if(typeof date1 === 'undefined' || typeof date2 === 'undefined')
			return true;
    	var checkIn;
    	var checkOut;
    	if(name == "checkIn"){
    		checkIn = moment(date1,"DD/MM/YYYY");
    		checkOut = moment(date2);
    	}else{
    		checkIn = moment(date2);
    		checkOut = moment(date1,"DD/MM/YYYY");
    	}
    	if(checkIn.isAfter(checkOut)){
    		return false;
    	}
    	return true;
    };
    var isNotUnavailable = function(date,unavailableDates) {
    	if(!angular.isUndefined(unavailableDates)){
	    	var compare = moment(date,"DD/MM/YYYY");
	    	for(var j=0;j<unavailableDates.length;j++){
				var start = moment(unavailableDates[j].startDate);
				var end = moment(unavailableDates[j].endDate);
				if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
					return false;
				}
				if(compare.isBefore(moment(),'day') || compare.isSame(moment(),'day')){
					return false;
				}
			}
			return true;
    	}else{
    		return true;
    	}
    };
    return {
        require:'ngModel',
        scope:{
        	unavailableDates : "=checkDate"
        },
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//observe other input (they are in pairs)
            	//if other input changes(passed value to this directive changes, eg query.checkIn), we should check it (in observe)
            	//after that we check current input
            	//in a criss-cross manner validation 
            	//it seems that checkDatesMatch - reference to another input lol
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(actualValue)));
            	});
            	//if no watch and it doesn't have true, unavailableDates will be undefined.
            	scope.$watch('unavailableDates',function(){
            		var result = isNotUnavailable(viewValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch));
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);//very important http://stackoverflow.com/questions/11135864/scope-watch-is-not-updating-value-fetched-from-resource-on-custom-directive
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch)));
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(actualValue)));
            	});
            	scope.$watch('unavailableDates',function(){
            		var result = isNotUnavailable(modelValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch));
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch)));
            	return modelValue;
            });
        }
    };
});
/**
 * Directive for conversion from moment date object to string and vice versa
 */
propertyDirective.directive('filterDate',["$filter", function($filter){
	return {
		require:'ngModel',
		link: function(scope,element,attrs,modelCtrl){
			//convert data from model format to view format
			modelCtrl.$formatters.push(function(inputValue){
				if(typeof inputValue !== 'undefined'){
					var transformedInput = $filter("date")(inputValue,'dd/MM/yyyy');
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
					return transformedInput;
				}
			});
			//convert data from view format to model format
			modelCtrl.$parsers.push(function(data){
				return moment(data,"DD/MM/YYYY")._d;
			});
		}
	};
}]);
/**
 * Directive that shows booking price based on check in, check out dates and price per night.
 */
propertyDirective.directive('countBookingPrice',function(){
	return{
		scope:{
			checkIn:"=",
			checkOut:"=",
			nightPrice:"="
		},
		templateUrl:"shared/directives/partials/bookingPrice.html",
		link:function(scope,element,attr){
			scope.$watch("checkIn",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
			scope.$watch("checkOut",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
		}
	};
});