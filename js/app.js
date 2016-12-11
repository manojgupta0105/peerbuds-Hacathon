var myApp = angular.module('myApp', ['ngRoute','ui.router','ui.bootstrap','ngTable','ngSanitize','nvd3'])

.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {

	 $urlRouterProvider.otherwise("/home");
	 
	 $stateProvider
		.state('home', {
			url: "/home",
			title: "Home",
			templateUrl: "partials/home.html",
			controller : "HomePageController"
		})
		.state('task1',{
			url: "/task1",
			title: "task 1",
			templateUrl: "partials/task1.html",
			controller : "FirstTaskController"
		})
		.state('task2',{
			url: "/task2",
			title: "task 2",
			templateUrl: "partials/task2.html",
			controller : "SecondTaskController"
		})
		.state('task3',{
			url: "/task3",
			title: "task 3",
			templateUrl: "partials/task3.html",
			controller : "ThirdTaskController"
		})

	//$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('');

 }
])
.controller("MainController",["$scope","$log","$rootScope","$state",function($scope,$log,$rootScope,$state){
	$rootScope.currTitle = $state.current.title;
	$rootScope.pageTitle = "Peerbuds Task - "+ $scope.currTitle;
}])


.controller("HomePageController",["$scope","$log","$rootScope","$state",function($scope,$log,$rootScope,$state){
	$rootScope.currTitle = $state.current.title;
	$rootScope.pageTitle = "Peerbuds Task - "+ $scope.currTitle;

}])
.controller("FirstTaskController",["$scope","$log","$rootScope","$state","NgTableParams","apiCallService","SessionService",
	function($scope,$log,$rootScope,$state,NgTableParams,apiCallService,SessionService){
	$rootScope.currTitle = $state.current.title;
	$rootScope.pageTitle = "Peerbuds Task - "+ $scope.currTitle;
	$scope.totalItems = 64;
  	$scope.currentPage = 1;
	$scope.responseData = [];
	$scope.currentDataSet = [];
	$scope.maxSize = 5;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};
	$scope.pageChanged = function(){
		$scope.currentDataSet = [];
		var startPos = ((($scope.currentPage - 1) * 10));
		var endPos = ((($scope.currentPage - 1) * 10)) + 10;
		$scope.currentDataSet = $scope.responseData.slice(startPos , endPos);
	};
	apiCallService.fetchDataFromAPI("getJSONData?filename=Posts.xml").then(
		function(success){
			$scope.responseData = success.data.posts.row;
			$scope.totalItems = $scope.responseData.length / 10;
			$scope.currentDataSet = $scope.responseData.slice((($scope.currentPage - 1) * 10) , 10);
		},
		function(error){

		}
	);
	
}])
.controller("SecondTaskController",["$scope","$log","$rootScope","$state","apiCallService","SessionService",
	function($scope,$log,$rootScope,$state,apiCallService,SessionService){
	$rootScope.currTitle = $state.current.title;
	$rootScope.pageTitle = "Peerbuds Task - "+ $scope.currTitle;
	$scope.totalItems = 64;
  	$scope.currentPage = 1;
	$scope.responseData = [];
	$scope.currentDataSet = [];
	$scope.maxSize = 5;

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.voteUp = function(postData){
		if(postData.votedUp == undefined){
			postData.votedUp = true;
		}
		else{
			postData.votedUp = !postData.votedUp;
		}
		if(postData.votedUp){
			postData.votedDown = false;
			postData.Score = parseInt(postData.Score) + 1;
		}
		else{
			postData.Score = parseInt(postData.Score) - 1;
		}
		SessionService.set("postData",$scope.currentDataSet);
		//console.log(JSON.stringify($scope.currentDataSet));
	}
	$scope.voteDown = function(postData){
		if(postData.votedDown == undefined){
			postData.votedDown = true;
		}
		else{
			postData.votedDown = !postData.votedDown;
		}
		if(postData.votedDown){
			postData.votedUp = false;
			postData.Score = parseInt(postData.Score) - 1;
		}
		else{
			postData.Score = parseInt(postData.Score) + 1;
		}

		SessionService.set("postData",$scope.currentDataSet);
	}

	$scope.pageChanged = function(){
		$scope.currentDataSet = [];
		var startPos = ((($scope.currentPage - 1) * 10));
		var endPos = ((($scope.currentPage - 1) * 10)) + 10;
		$scope.currentDataSet = $scope.responseData.slice(startPos , endPos);
	};
	apiCallService.fetchDataFromAPI("getJSONData?filename=Posts.xml").then(
		function(success){
			$scope.responseData = success.data.posts.row;
			$scope.totalItems = $scope.responseData.length / 10;
			$scope.currentDataSet = $scope.responseData.slice((($scope.currentPage - 1) * 10) , 10);
			var tmpData = SessionService.get("postData");
			var currenttmpdataSet = $scope.currentDataSet;
			for(var i =0; i<tmpData.length;i++){
				for(var j =0; j<$scope.currentDataSet.length;j++){
					if(tmpData[i].Id == $scope.currentDataSet[j].Id){
						$scope.currentDataSet[j].votedUp = tmpData[i].votedUp;
						$scope.currentDataSet[j].votedDown = tmpData[i].votedDown;
						$scope.currentDataSet[j].Score = tmpData[i].Score;
					}
				}
			}
			SessionService.set("postData",$scope.currentDataSet);
		},
		function(error){

		}
	);
	
}])

.controller("ThirdTaskController",["$scope","$log","$rootScope","$state","NgTableParams","apiCallService","SessionService",
	function($scope,$log,$rootScope,$state,NgTableParams,apiCallService,SessionService){
	$rootScope.currTitle = $state.current.title;
	$rootScope.pageTitle = "Peerbuds Task - "+ $scope.currTitle;
	
	apiCallService.fetchDataFromAPI("getJSONData?filename=Posts.xml").then(
		function(success){
			$scope.responseData = success.data.posts.row;
			$scope.totalItems = $scope.responseData.length / 10;
			$scope.tagWithQuestionCount = {};
			for(var i =0; i<responseData.length;i++){
				//responseData[i]
			}
		},
		function(error){

		}
	);
	
}])

.service('apiCallService', function($http,$q){
	var baseUrl = "http://localhost:8081/";
	var fetchDataFromAPI = function(urlEndpoint){
		return $http({
			method : 'GET',
			url : baseUrl + urlEndpoint
		}).then(function successCallback(response) {
			return response;
		}, function errorCallback(error) {
			return $q.reject(error)
		})
	};
	
	var postDataToAPI = function(urlEndpoint,param){
		return $http({
			method : 'POST',
			url : baseUrl + urlEndpoint,
			data : param
		}).then(function successCallback(response) {
			return response;
		}, function errorCallback(error) {
			return $q.reject(error);
		});
	}
	
	return {
		fetchDataFromAPI : fetchDataFromAPI,
		postDataToAPI : postDataToAPI
	}
})

.factory("SessionService", ['$window', function($window) {
	return {
		set:function(key, val) {
				$window.localStorage.setItem(key, JSON.stringify(val));
			},
		get: function(key) {
				var str = $window.localStorage.getItem(key);
				var result = undefined;
				try {
					result = str ? JSON.parse(str) : result;
				}
				catch (e) {
					console.log('Parse error for localStorage ' + key);
				}
				return result;
			},
		unset: function(key) {
				$window.localStorage.removeItem(key);
			},
		isExists: function(key){
			return $window.localStorage.getItem(key) !== null
		}
	}
}])


