app.controller('EditPersonCtrl', function ($scope, $rootScope, $location, $routeParams, People, person) {
    var personID = ($routeParams.personID) ? parseInt($routeParams.personID) : 0;

    $rootScope.title = (personID > 0) ? 'Edit Person' : 'Add Person';
    $scope.buttonText = (perssonID > 0) ? 'Update Person' : 'Add New Person';

    var original = person.data;
    original._id = personID;
    $scope.person = angular.copy(original);
    $scope.person._id = personID;

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
          if (personID <= 0) {
              People.create(person);
          }
          else {
              People.update(personID, person);
          }
    };
});
