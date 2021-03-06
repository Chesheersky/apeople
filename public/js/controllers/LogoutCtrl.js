angular.module('AddPersonCtrl', []).controller('AddPersonController', function ($scope, $rootScope, $location, People) {

      $rootScope.title = 'Add Person';
      $scope.buttonText = 'Add New Person';

      $scope.isClean = function() {
          return false;
      }

      $scope.delete = function(person) {
      };

      $scope.save = function(person) {
          $location.path('/');
          People.create(person);
      };
});
angular.module('LogoutCtrl').controller('LogoutController',
    ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {

            $scope.logout = function () {

                console.log(Auth.getUserStatus());

                // call logout from service
                Auth.logout()
                    .then(function () {
                        $location.path('/login');
                    });

            };

        }]);