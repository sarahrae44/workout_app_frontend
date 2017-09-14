console.log('app.js is working');

const app = angular.module('workout', []);

app.controller('mainController', ['$http', function($http) {
  this.message = "controller works";

  $http({
    method: 'GET',
    url: 'http://localhost:3000/bodies',
  }).then(response => console.log(response))
    .catch(err => console.log(err));

}]);
