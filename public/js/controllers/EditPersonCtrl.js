angular.module('EditPersonCtrl', []).controller('EditPersonController', function ($scope, $rootScope, $location, People, personId, personRequest) {
//todo extract a separate controller for attempts
    $rootScope.title = 'Edit Person';
    $scope.buttonText = 'Update Person';

    var original = personRequest.data.person;
    original._id = personId;
    $scope.person = angular.copy(original);
    $scope.person._id = personId;

    $scope.isClean = function () {
        return angular.equals(original, $scope.person);
    };

    //$scope.enterQuest = function(person, attempt) {
    //    attempt.entered = Date.now();
    //    People.update(personId, person);
    //};

    //$scope.exitQuest = function(person, attempt) {
    //    attempt.exited = Date.now();
    //    People.update(personId, person);
    //};

    $scope.delete = function (person) {
        $location.path('/');
        if (confirm(`Are you sure to delete person number: ${$scope.person._id}`) == true)
            People.delete(person._id);
    };

    $scope.save = function (person) {
        $location.path('/');
        People.update(personId, person);
    };
});
