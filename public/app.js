console.log('app.js is working');

const app = angular.module('workout_app', []);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  this.message = "controller works";
  this.url = 'http://localhost:3000';
  this.user = {};
  this.users = [];
  this.muscle = {};
  this.body = {};
  this.body.exercise = {};

// ===================== User-related =========================
// user login
  this.login = function(userPass) {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }},
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));
  }

// get user
  this.getUsers = function() {
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response.data);
      if (response.data.status === 401) {
        this.error = " Unauthorized";
      } else {
        this.users = response.data;
      }
    }.bind(this));
  }

// logout user
  this.logout = function() {
    localStorage.clear('token');
    location.reload();
  }
  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/',
  // }).then(response => console.log(response))
  //   .catch(err => console.log(err));

 // ==================== End User-related =======================

// ===================== Body-related ==========================

// get all bodies
this.getBodies = function() {
  $http({
    url: this.url + '/bodies',
    method: 'GET'
  }).then(function(response) {
    console.log(response.data);
    controller.body = response.data;
  })
}

this.getBodiesExercises = function(){
  $http({
    url: this.url + '/bodies/' + this.body.id + '/exercises',
    method: 'GET'
  }).then(function(response) {
    console.log(response.data);
    controller.muscle = response.data;
  })
}

// ===================== End Body-related ==========================

// ===================== Exercise-related ==========================

// get all bodies
this.getExercises = function() {
  $http({
    url: this.url + '/exercises',
    method: 'GET'
  }).then(function(response) {
    console.log(response.data);
    controller.exercise = response.data;
  })
}

// ===================== End Exercise-related ==========================

}]);
