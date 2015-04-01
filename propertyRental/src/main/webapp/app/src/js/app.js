/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ui.bootstrap.datetimepicker','angularFileUpload','PropertyService','PropertyController','PropertyDirective']);

rentalApp.constant('API_URL',"/propertyRental/");

rentalApp.config(
	function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state("home", {
				url:"/",
				views: {
					"mainView":{
						templateUrl:"partials/home.html",
						controller:"HomeController"
					}
				},
                data : {
                	authorities:[]
                }
			})
			.state("queryProperties",{
				url:"/queryProperties/:address/:country/:city/:admArea/:checkIn/:checkOut/:guestNumber",
				views: {
					"mainView":{
						templateUrl:"partials/propertyListByQuery.html",
						controller:"SearchPropertiesCtrl"
					}
				},
                data : {
                    	authorities:[]
                }
			})
			.state("showProperty",{
				url:"/showProperty/{propertyId}/{checkIn}/{checkOut}/{guestNumber}",
				views:{
					"mainView":{
						templateUrl:"partials/showProperty.html",
						controller:"ShowPropertyCtrl"
					}
				},
				params:{
					checkIn:"",
					checkOut:"",
					guestNumber:""
				},
                data : {
                    	authorities:[]
                }
			})
			.state("addProperty",{
				abstract:true,
				url:"/addProperty",
				views:{
					"mainView":{
						templateUrl:"partials/addProperty/addProperty.html",
						controller:"AddPropertyCtrl"
					}
				},
                data : {
                    	authorities:['ROLE_USER']
                }
			})
			.state("addProperty.mainDetails",{
				url:"",
				parent:"addProperty",
				controller:"AddPropertyCtrl",
				templateUrl:"partials/addProperty/mainDetails.html"
			})
			.state("addProperty.sizing",{
				url:"/sizing",
				parent:"addProperty",
				controller:"AddPropertyCtrl",
				templateUrl:"partials/addProperty/propSize.html"
			})
			.state("addProperty.detailedDesc",{
				url:"/detailedDesc",
				parent:"addProperty",
				controller:"AddPropertyCtrl",
				templateUrl:"partials/addProperty/detailedDesc.html"
			})
			.state("addProperty.photos",{
				url:"/photos",
				parent:"addProperty",
				controller:"AddPropertyCtrl",
				templateUrl:"partials/addProperty/propPhotos.html"
			})
			.state("updateProperty",{
				url:"/updateProperty/{propertyId}",
				views:{
					"mainView":{
						templateUrl:"partials/updateProperty.html",
						controller:"UpdatePropertyCtrl"
					}
				},
                data : {
                    	authorities:['ROLE_USER']
                }
			})
			.state("showMyProperties",{
				url:"/showMyProperties",
				views:{
					"mainView":{
						templateUrl:"partials/showMyProperties.html",
						controller:"ShowMyPropertiesCtrl"
					}
				},
                data : {
                    	authorities:['ROLE_USER']
                }
			})
			.state("showMyBookings",{
				url:"/showMyBookings",
				views:{
					"mainView":{
						templateUrl:"partials/showMyBookings.html",
						controller:"ShowMyBookingsCtrl"
					}
				},
                data : {
                	authorities:["ROLE_USER"]
                }
			})
			.state("login",{
				url:"/login",
				views:{
					"mainView":{
						templateUrl:"partials/login.html",
						controller:"LoginCtrl"
					}
				},
                data : {
                    	authorities:[]
                }
			})
			.state("register",{
				url:"/register",
				views:{
					"mainView":{
						templateUrl:"partials/register.html",
						controller:"RegisterCtrl"
					}
				},
                data : {
                    	authorities:[]
                }
			})
			.state("logout",{
				url:"/logout",
				views:{
					"mainView":{
						controller:"LogoutCtrl"
					}
				},
                data : {
                    authorities:['ROLE_USER']
                }
			})
			.state("accessDenied",{
                url : "/accessDenied",
                templateUrl: "partials/accessDenied.html",
                data : {
                	authorities:[]
                }
            });
	}
);
/*
 * For multi step form
 */
rentalApp.value('addPropFormSteps', [
                     {uiSref: 'addProperty.mainDetails', valid: false},
                     {uiSref: 'addProperty.sizing', valid: false},
                     {uiSref: 'addProperty.detailedDesc', valid: false},
                     {uiSref: 'addProperty.photos', valid: false}
]);
//to intercept all 403 errors
rentalApp.factory('httpErrorResponseInterceptor', [ '$q', '$location',
		function($q, $location) {
			return {
				response : function(responseData) {
					return responseData;
				},
				responseError : function error(response) {
					switch (response.status) {
					case 401:
						console.log("DOES IT EVEN WORK?)");
						localStorage.removeItem("currentUsername");
						localStorage.removeItem("authority");
						$location.path('/login');
						break;
					case 403:
						localStorage.removeItem("currentUsername");
						localStorage.removeItem("authority");
						$location.path('/accessDenied');
						break;
					default:
						//$location.path('/error');
						console.log("ERROR AAAA");
					}

					return $q.reject(response);
				}
			};
}]);
rentalApp.config([ '$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpErrorResponseInterceptor');
} ]);
rentalApp.run(["$rootScope","$state","addPropFormSteps",function($rootScope, $state,addPropFormSteps){
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		//console.log("controlling....",result);
		return result;
	};
	$rootScope.getAuthority = function(){
		return localStorage.getItem("authority");
	}
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams){
		//console.log("toState",toState);
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        //if(!$rootScope.isLoggedIn() && $rootScope.toState.data.loggedIn){
        if(!$rootScope.isLoggedIn() && $rootScope.toState.data.authorities.length != 0){
        	console.log("should check");
	        $rootScope.returnToState = toState;
	        $rootScope.returnToStateParams = toStateParams;
	        if($rootScope.isLoggedIn() && $rootScope.toState.data.authorities.indexOf($rootScope.getAuthority()) == -1){
	            event.preventDefault();
	        	$state.go('accessDenied');
	        }else{
	        	//console.log("REDIRECTING to login");
	            event.preventDefault();
	            $state.go('login');
	        }
        }
        
        //for multistep form:
        var canGoToStep = false;
        // only go to next if previous is valid
        var toStateIndex = _.findIndex(addPropFormSteps, function(formStep) {
        	console.log(toState.name);
          return formStep.uiSref === toState.name;
        });
        console.log('toStateIndex',toStateIndex)
        if(toStateIndex === 0) {
          canGoToStep = true;
        } else {
        	console.log(toStateIndex - 1);
          canGoToStep = addPropFormSteps[toStateIndex - 1].valid;
        }
        console.log('canGoToStep', toState.name, canGoToStep);
        
        // Stop state changing if the previous state is invalid
        if(!canGoToStep) {
            // Abort going to step
            event.preventDefault();
        }
    });
	
}]);
