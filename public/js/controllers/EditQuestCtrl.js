angular.module('EditQuestCtrl', []).controller('EditQuestController', function ($scope, $rootScope, $location, Quests, questId, questRequest) {

      $rootScope.title = 'Edit Quest';
      $scope.buttonText = 'Update Quest' ;

      var original = questRequest.data.quest;
      original._id = questId;
      $scope.quest = angular.copy(original);
      $scope.quest._id = questId;

      $scope.isClean = function() {
          return angular.equals(original, $scope.quest);
      }

      $scope.delete = function(quest) {
          $location.path('/');
          if(confirm("Are you sure to delete quest number: "+$scope.quest._id)==true)
              Quests.delete(quest._id);
      };

      $scope.save = function(quest) {
          $location.path('/');
          Quests.update(questId, quest);
      };
});
