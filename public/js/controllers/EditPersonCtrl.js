var app = angular.module('EditPersonCtrl', []);
app.controller('EditPersonController', function ($scope, $rootScope, $location, People, personId, personRequest) {
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

    $scope.updateAttempt = function (time) {
        alert(time);
    };

    $scope.cancelAttempt = function (time) {
        alert(time);
    };

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

app.directive('onEsc', function () {
    return function (scope, elm, attr) {
        elm.bind('keydown', function (e) {
            if (e.keyCode === 27) {
                scope.$apply(attr.onEsc);
            }
        });
    };
});

app.directive('onEnter', function () {
    return function (scope, elm, attr) {
        elm.bind('keypress', function (e) {
            if (e.keyCode === 13) {
                scope.$apply(attr.onEnter);
            }
        });
    };
});

app.directive('inlineEdit', function ($timeout) {
    return {
        scope: {
            model1: '=inlineEdit',
            handleSave: '&onSave',
            handleCancel: '&onCancel'
        },
        link: function (scope, elm, attr) {
            var previousValue;

            scope.edit = function () {
                scope.editMode = true;
                previousValue = scope.model1;

                $timeout(function () {
                    elm.find('input')[0].focus();
                }, 0, false);
            };
            scope.save = function () {
                scope.editMode = false;
                scope.handleSave({value: scope.model1});
            };
            scope.cancel = function () {
                scope.editMode = false;
                scope.model1 = previousValue;
                scope.handleCancel({value: scope.model1});
            };
        }
    };
});