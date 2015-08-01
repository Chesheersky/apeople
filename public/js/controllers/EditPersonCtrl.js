angular.module('EditPersonCtrl', []).controller('EditPersonController', function ($scope, $rootScope, $location, People, personId, person) {

    $rootScope.title = (personId > 0) ? 'Edit Person' : 'Add Person';
    $scope.buttonText = (personId > 0) ? 'Update Person' : 'Add New Person';

    var original = person.data;
    original._id = personId;
    $scope.person = angular.copy(original);
    $scope.person._id = personId;

    console.log(original);

    $scope.isClean = function() {
        return angular.equals(original, $scope.person);
    }

    $scope.delete = function(person) {
        $location.path('/');
        if(confirm("Are you sure to delete person number: "+$scope.person._id)==true)
            People.delete(person.id);
    };

    $scope.save = function(person) {
        $location.path('/');
          if (personId <= 0) {
              People.create(person);
          }
          else {
              People.update(personId, person);
          }
    };
});
