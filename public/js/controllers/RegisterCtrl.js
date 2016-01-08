angular.module('RegisterCtrl').controller('RegisterController',
    ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {

            console.log(Auth.getUserStatus());

            $scope.register = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call register from service
                Auth.register($scope.registerForm.username, $scope.registerForm.password)
                    // handle success
                    .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    });

            };

        }]);