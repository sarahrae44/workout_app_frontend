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
  this.addNewMuscle = false;
  this.hideMuscleList = false;
  this.showMuscles = false;
  this.showMuscleList = true;
  this.musclesVisible = false;
  this.exerciseSection = true;
  this.addNewExercise = false;
  this.hideExerciseList = false;
  this.showExerciseList = true;
  this.exercisesVisible = false;
  this.registerModal = false;
  this.loginModal = false;
  this.loggedIn = false;
  this.showRegisterButton = true;
  this.showLoginButton = true;
  this.adminLogin = false;
  this.errorModal = false;
  this.accountDetails = false;
  this.showGroupList = true;
  this.hideGroupList = false;
  this.showGroupDetails = false;
  this.groupsVisible = false;
  this.muscleHeader = true;
  this.addNewMuscleGroup = false;
  this.muscleGroupSection = true;
  this.showMuscleGroupList = true;
  this.hideMuscleGroupList = false;
  this.muscleGroupsVisible = false;
  this.searchListVisible = false;
  this.showSearchList = true;
  this.hideSearchList = false;
  this.showArmsResults = false;
  this.showShouldersResults = false;
  this.showChestResults = false;
  this.showBackResults = false;
  this.showLegsResults = false;
  this.showButtocksResults = false;
  this.showAbdomenResults = false;
  this.addToProfileForm = false;
  this.showUsersaves = false;
  this.viewUserExes = false;
  this.index = true;
  this.account = false;
  this.muscles = true;
  this.exercises = true;
  this.groups = true;
  this.exByGroup = true;
  this.exerciseButton = false;
  this.backToAccountButton = false;
  this.accountViewOn = false;
  this.showHomeButton = false;
  this.user_exes = false;
  this.editUserDets = false;
  this.getUserExButton = false;
  this.editUserButton = false;
  this.hideUserExes = false;
  this.arms = true;
  this.shoulders = true;
  this.chest = true;
  this.back = true;
  this.legs = true;
  this.buttocks = true;
  this.abdomen = true;
  this.user_exDetails = false;


// ===================== User-related =========================
  this.user = {};
  this.users = [];
  this.userPass = {};
  this.newUserSafe = {};

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
        this.loggedIn = true;
        this.accountViewOn = true;
        this.showHomeButton = true;
        // this.accountDetails = true;
        // this.muscles = false;
        // this.exercises = false;
        // this.groups = false;

        this.exerciseButton = true;
        // controller.loggedIn = ! controller.loggedIn;
        controller.showLoginButton = ! controller.showLoginButton;
        controller.showRegisterButton = ! controller.showRegisterButton;
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
      // controller.index = false;
      // controller.loggedIn = ! controller.loggedIn;
      // controller.accountDetails = ! controller.accountDetails;
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
  this.groups = [];
  this.groupname = [];
  this.newGroupSearch = {};
  this.groupSearch = {};

// create group
  this.createGroup = function(newGroup) {
    console.log('this works');
    $http({
      url: this.url + '/groups',
      method: 'POST',
      data: { group: { groupname: newGroup.groupname, exercise_id: newGroup.exercise_id, body_id: newGroup.body_id
        // , muscle_group_id: newGroup.muscle_group_id
       }}
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
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.group = response.data;
      controller.hideGroupList = ! controller.hideGroupList;
      controller.showGroupList = ! controller.showGroupList;
      controller.groupsVisible = ! controller.groupsVisible;
    })
  }

  this.searchArms = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.armsGroup = controller.groupname.filter(function(arms){
        return arms.groupname == "Arms";
      });
      console.log(controller.armsGroup);
    })
  }

  this.searchShoulders = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.shouldersGroup = controller.groupname.filter(function(shoulders){
        return shoulders.groupname == "Shoulders";
      });
      console.log(controller.shouldersGroup);
    })
  }

  this.searchChest = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.chestGroup = controller.groupname.filter(function(chest){
        return chest.groupname == "Chest";
      });
      console.log(controller.chestGroup);
    })
  }

  this.searchBack = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.backGroup = controller.groupname.filter(function(back){
        return back.groupname == "Back";
      });
      console.log(controller.backGroup);
    })
  }

  this.searchLegs = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.legsGroup = controller.groupname.filter(function(legs){
        return legs.groupname == "Legs";
      });
      console.log(controller.legsGroup);
    })
  }

  this.searchButtocks = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.buttocksGroup = controller.groupname.filter(function(buttocks){
        return buttocks.groupname == "Buttocks";
      });
      console.log(controller.buttocksGroup);
    })
  }

  this.searchAbdomen = function() {
    $http({
      url: this.url + '/groups',
      method: 'GET',
    }).then(function(response) {
      console.log(response.data);
      controller.groupname = response.data;
      console.log(controller.groupname);
      controller.abdomenGroup = controller.groupname.filter(function(abdomen){
        return abdomen.groupname == "Abdomen";
      });
      console.log(controller.abdomenGroup);
    })
  }

  // this.searchArms = function(newGroupSearch) {
  //   $http({
  //     url: this.url + '/groups',
  //     method: 'GET',
  //     data: { groupSearch: { groupname: newGroupSearch.groupname }}
  //   }).then(function(response) {
  //     console.log(response.data);
  //     this.groupSearch = response.data.groupSearch;
  //     // controller.groupname = response.data;
  //     // console.log(controller.groupname);
  //     //
  //     controller.searchGroup = controller.groupname.filter(function(search){
  //       return search.groupname == controller.groupSearch.groupname;
  //     });
  //     console.log(controller.searchGroup);


      // .filter(function(armsGroup){
      //   return armsGroup = "arms";
      // });
      // console.log(arms);
      // controller.group = response.data;
  //   })
  // }

  // delete group
  this.deleteGroup = function(id) {
    $http({
      method: 'DELETE',
      url: this.url + '/groups/' + id
    }).then(function(response) {
      console.log(response);
      controller.getGroups();
    });
  }

  //search group
  // this.searchArms = function() {
  //   console.log(controller.groups);
  // }


// ===================== End Group-related ==========================

// ===================== Muscle Group-related ==========================

// this.musclegroup = {};

// create muscle group
// this.createMuscleGroup = function(newMuscleGroup) {
//   $http({
//     url: this.url + '/muscle_groups',
//     method: 'POST',
//     data: { muscle_group: { muscleGroupName: newMuscleGroup.muscleGroupName }}
//   }).then(function(response) {
//     console.log(response);
//     this.musclegroup = response.data.musclegroup;
//     // controller.getBodies();
//   })
// }
//
// // get all muscle groups
// this.getMuscleGroups = function() {
//   $http({
//     url: this.url + '/muscle_groups',
//     method: 'GET'
//   }).then(function(response) {
//     console.log(response.data);
//     controller.musclegroup = response.data;
//     controller.hideMuscleGroupList = ! controller.hideMuscleGroupList;
//     controller.showMuscleGroupList = ! controller.showMuscleGroupList;
//     controller.muscleGroupsVisible = ! controller.muscleGroupsVisible;
//   })
// }

// ===================== End Muscle Group-related ==========================

// ===================== Body part search ==================================

this.usersafe = {};

// add user exercises
  // this.createUsersafe = function(group_id, user_id) {
  //   console.log(group_id, user_id);
  //   $http({
  //     url: this.url + '/usersaves',
  //     method: 'POST',
  //     data: { usersafe: { group_id: group_id, user_id: user_id }},
  //   }).then(function(response) {
  //     console.log(response);
  //     this.usersafe = response.data.usersafe;
  //   });
  // }

// Testing

  this.createUsersafe = function(exercise_id, user_id) {
    console.log(exercise_id);
    $http({
      url: this.url + '/user_exes',
      method: 'POST',
      data: { user_ex: { exercise_id: exercise_id, user_id: user_id }},
    }).then(function(response) {
      console.log(response);
      // this.usersafe = response.data.usersafe;
    });
  }

// End testing

  this.getUserExercises = function() {
    $http({
      url: this.url + '/user_exes',
      method: 'GET',
    }).then(function(response) {
      this.index = false;
      this.user_exes = true;
      this.editUserButton = true;
      this.hideUserExes = true;
      controller.backToAccountButton = true;
      controller.user_exDetails = true;
      // this.backToAccountButton = true;
      // this.exerciseButton = false;
      // this.viewUserExes = true;
      console.log(response.data);
      controller.searchreturn = response.data;
      // console.log(controller.searchreturn);
      controller.returnedGroup = controller.searchreturn.filter(function(saved){
        return saved.user_id == controller.user.id;
      });
      console.log(controller.returnedGroup);
    })
  }


// ===================== End body part search ==============================


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

  this.backToAccount = function() {
    this.accountDetails = true;
    this.account = true;
  }

  this.hideUserExButton = function() {
    this.exerciseButton = false;
  }

  this.backToHome = function() {
    this.index = true;
    this.accountViewOn = false;
    this.accountDetails = false;
    this.user_exes = false;
  }

  this.showUserAccount = function(){
    // this.accountDetails = true;
    this.index = false;
    this.accountViewOn = true;
    this.showHomeButton = true;
  }

  this.accountButtonClicked = function() {
    this.accountDetails = true;
    this.getUserExButton = true;
    this.editUserButton = true;
    this.index = false;
    this.backToAccountButton = false;
  }

  this.backToAccountButtonClicked = function() {
    this.accountDetails = true;
    this.getUserExButton = true;
    this.editUserButton = true;
    this.index = false;
    this.backToAccountButton = false;
    this.user_exDetails = false;
  }

}]);
