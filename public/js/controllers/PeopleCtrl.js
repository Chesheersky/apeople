angular.module('PeopleCtrl', []).controller('PeopleController', function($scope, People) {
    People.get().then(function(data){
        $scope.people = data.data;
    });
});
