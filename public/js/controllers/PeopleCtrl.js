angular.module('PeopleCtrl', []).controller('PeopleController', function($scope, People) {
    People.getAll().then(function(data){
        $scope.people = data.data;
    });
});
