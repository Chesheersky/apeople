angular.module('AddQuestCtrl', []).controller('AddQuestController', function ($scope, $rootScope, $location, Quests) {

      $rootScope.title = 'Add Quest';
      $scope.buttonText = 'Add New Quest';

      $scope.isClean = function() {
          return false;
      }

      $scope.delete = function(quest) {
      };

      $scope.save = function(quest) {
          $location.path('/');
          Quests.create(quest);
      };
});
