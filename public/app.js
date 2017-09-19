console.log('app.js is working');

const app = angular.module('workout_app', []);

app.controller('mainController', ['$http', function($http) {
  const controller = this;
  this.message = "controller works";

  // this.url = 'http://localhost:3000';

  this.url = 'https://workout-app-api.herokuapp.com';
  this.muscle = {};
  // this.body.exercise = {};
  this.currentBody = {};
  this.showDropdowns = false;
  this.muscleSection = true;
  this.exerciseSection = true;
  this.registerModal = false;
  this.loginModal = false;
  this.accountDetails = false;
  this.addNewMuscle = false;
  this.addNewExercise = false;
  this.hideMuscleList = false;
  this.showMuscleList = true;
  this.hideExerciseList = false;
  this.showExerciseList = true;
  this.loggedIn = false;
  this.showRegisterButton = true;
  this.showLoginButton = true;
  this.showGroupList = true;
  this.hideGroupList = false;
  this.showGroupDetails = false;
  this.adminLogin = false;
  this.muslesVisible = false;
  this.exercisesVisible = false;
  this.groupsVisible = false;
  this.muscleHeader = true;
  this.errorModal = false;


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
      controller.registerModal = ! controller.registerModal;
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
        this.loggedin = false;
        this.loginError();
      } else {
        this.loggedin = true;
        if (userPass.username === "waLogin"){
          console.log(userPass.username);
          this.adminLogin = true
        } else {
          this.adminLogin = false;
        }
      }
      console.log('logged in? ', this.loggedin);
      console.log('user?', this.user);
      console.log('username: ', userPass.username);
      console.log('password: ', userPass.password);
      controller.loginModal = ! controller.loginModal;
      controller.loggedIn = ! controller.loggedIn;
      controller.accountDetails = ! controller.accountDetails;
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

 // ==================== End User-related =======================

// ===================== Body-related ==========================

  this.body = {};
  this.bodies = [];
  this.editedBody = {};
  this.currentBody = {};

  // create body
  this.createBody = function(newBody) {
    $http({
      url: this.url + '/bodies',
      method: 'POST',
      data: { body: { musclename: newBody.musclename, img: newBody.img }}
    }).then(function(response) {
      console.log(response);
      this.body = response.data.body;
      controller.getBodies();
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
      controller.hideMuscleList = ! controller.hideMuscleList;
      controller.showMuscleList = ! controller.showMuscleList;
      controller.musclesVisible = ! controller.musclesVisible;
    })
  }

  // edit body
  this.editBody = function(id){
      $http({
        method: 'get',
        url: this.url + '/bodies/' + id
      }).then(function(response){
        controller.currentBody = response.data;
      }, function(error){
        console.log(error,'body error')
      })
    };

    this.pushBodyEdit = function(){
      $http({
        method: 'put',
        url: this.url + '/bodies/' + this.currentBody.id,
        data: this.currentBody
      }).then(function(response){
        console.log(response);
        controller.getBodies();
      }, function(error){
        console.log(error, 'error from body edit');
      })
    };

  // delete body
  this.deleteBody = function(id) {
    $http({
      method: 'DELETE',
      url: this.url + '/bodies/' + id
    }).then(function(response) {
      console.log(response);
      controller.getBodies();
    });
  }

// ===================== End Body-related ==========================

// ===================== Exercise-related ==========================

  this.exercise = {};
  this.currentExercise = {};

// create exercise
  this.createExercise = function(newExercise) {
    $http({
      url: this.url + '/exercises',
      method: 'POST',
      data: { exercise: { exercisename: newExercise.exercisename, img: newExercise.img, desc: newExercise.desc, duration: newExercise.duration }}
    }).then(function(response) {
      console.log(response);
      this.exercise = response.data.exercise;
      controller.getExercises();
    })
  }

  // get all exercises
  this.getExercises = function() {
    $http({
      url: this.url + '/exercises',
      method: 'GET'
    }).then(function(response) {
      console.log(response.data);
      controller.exercise = response.data;
      controller.hideExerciseList = ! controller.hideExerciseList;
      controller.showExerciseList = ! controller.showExerciseList;
      controller.exercisesVisible = ! controller.exercisesVisible;
    })
  }

  // edit exercise
  this.editExercise = function(id){
      $http({
        method: 'get',
        url: this.url + '/exercises/' + id
      }).then(function(response){
        controller.currentExercise = response.data;
      }, function(error){
        console.log(error,'exercise error')
      })
    };

    this.pushExerciseEdit = function(){
      $http({
        method: 'put',
        url: this.url + '/exercises/' + this.currentExercise.id,
        data: this.currentExercise
      }).then(function(response){
        console.log(response);
        controller.getExercises();
      }, function(error){
        console.log(error, 'error from exercise edit');
      })
    };


  // delete exercise
  this.deleteExercise = function(id) {
    $http({
      method: 'DELETE',
      url: this.url + '/exercises/' + id
    }).then(function(response) {
      console.log(response);
      controller.getExercises();
    });
  }

// ===================== End Exercise-related ==========================

// ===================== Group-related ==========================

  this.group = {};

// create group
  this.createGroup = function(newGroup) {
    console.log('this works');
    $http({
      url: this.url + '/groups',
      method: 'POST',
      data: { group: { groupname: newGroup.groupname, exercise_id: newGroup.exercise_id, body_id: newGroup.body_id }}
    }).then(function(response) {
      console.log(response);
      this.group = response.data.group;
      controller.getGroups();
    })
  }

  // get all groups
  this.getGroups = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET'
    }).then(function(response) {
      console.log(response.data);
      controller.group = response.data;
      controller.hideGroupList = ! controller.hideGroupList;
      controller.showGroupList = ! controller.showGroupList;
      controller.groupsVisible = ! controller.groupsVisible;
    })
  }

// ===================== End Group-related ==========================

  this.loginError = function(){
    this.errorModal = !this.errorModal;
    // this.closeErrorForm();
  }

  this.closeErrorForm = function(){
    this.errorModal = !this.errorModal;
  }

  this.reload = function() {
    location.reload();
    }
}]);
