angular.module('EditPersonCtrl', []).controller('EditPersonController', function ($scope, $rootScope, $location, People, personId, personRequest) {
  //todo extract attempts control
  //People.getAll().then(function(data){
  //    $scope.people = data.data;
  //});
      $scope.attempts = [{id: 1, name: "jil", entered: new Date(), exited: new Date()},
                         {id: 3, name: "jude", entered: new Date(), exited: new Date()},
                         {id: 5, name: "jakie", entered: new Date(), exited: new Date()}];

      $rootScope.title = 'Edit Person';
      $scope.buttonText = 'Update Person' ;

      var original = personRequest.data.person;
      original._id = personId;
      $scope.person = angular.copy(original);
      $scope.person._id = personId;

      $scope.isClean = function() {
          return angular.equals(original, $scope.person);
      }

      $scope.enterQuest = function(person, questId) {
          console.log('I wanna play a game with you');
          console.log(person);
          console.log(`Quest id: ${questId}`);
      };

      $scope.exitQuest = function(person, questId) {
          console.log('Get the f out');
          console.log(person);
          console.log(`Quest id: ${questId}`);
      };

      $scope.delete = function(person) {
          $location.path('/');
          if(confirm(`Are you sure to delete person number: ${$scope.person._id}`)==true)
              People.delete(person._id);
      };

      $scope.save = function(person) {
          $location.path('/');
          People.update(personId, person);
      };
});
