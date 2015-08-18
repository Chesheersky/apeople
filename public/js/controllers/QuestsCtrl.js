angular.module('QuestsCtrl', []).controller('QuestsController', function($scope, Quests) {
    Quests.getAll().then(function(data){
        $scope.quests = data.data;
    });
});
