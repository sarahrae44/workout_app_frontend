console.log('app.js is working');

const app = angular.module('workout_app', []);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  this.message = "controller works";
  this.url = 'http://localhost:3000';
  this.muscle = {};
  this.body = {};
  this.body.exercise = {};
  this.currentBody = {};

// ===================== User-related =========================
  this.user = {};
  this.users = [];
  this.userPass = {};

// register new user
  this.createUser = function(userPass) {
    $http({
      url: this.url + '/users',
      method: 'POST',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
    })
  }

// user login
  this.login = function(userPass) {
    this.userPass = userPass;
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }},
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      if (this.user === undefined){
        this.loggedin = false
      } else {
        this.loggedin = true;
      }
      console.log('logged in? ', this.loggedin);
      console.log('user?', this.user);
      console.log('username: ', userPass.username);
      console.log('password: ', userPass.password);
    }.bind(this));
  }

// get user
  this.getUsers = function() {
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response.data);
      if (response.data.status === 401) {
        this.error = "Unauthorized";
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

  // edit user

  this.updatedUser = function(username, password) {
    $http({
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      url: this.url + '/users/' + this.user.id,
      data: { user: { username: username, password: password }}
    }).then(function(response) {
      console.log(response);
      console.log(response.data);
      this.user = response.data;
    }.bind(this));
  }

  // delete user
  this.deleteUser = function(userPass) {
    $http({
      method: 'DELETE',
      url: this.url + '/users/' + this.user.id
    }).then(function(response) {
      this.logout();
    }.bind(this));
  }

  // $http({
  //   method: 'GET',
  //   url: 'http://localhost:3000/',
  // }).then(response => console.log(response))
  //   .catch(err => console.log(err));



 // ==================== End User-related =======================

// ===================== Body-related ==========================

// create body
this.createBody = function(newBody) {
  $http({
    url: this.url + '/bodies',
    method: 'POST',
    data: { body: { name: newBody.name, img: newBody.img }}
  }).then(function(response) {
    console.log(response);
    this.body = response.data.body;
  })
}

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

// edit body - NOT WORKING

this.editBody = function(body) {
  $http({
    method: 'PUT',
    url: this.url + '/bodies/' + body._id,
    data: { name: this.updatedName, img: this.updatedImg }
  }).then(function(response) {
    controller.name = ''
    controller.image = ''
    // controller.currentBody = response.data;
  }, function(error){
    console.log(error, 'body error');
  })
}

// ===================== End Body-related ==========================

// ===================== Exercise-related ==========================

// get all exercises
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
