angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
$routeProvider

    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })

    .when('/people', {
        templateUrl: 'views/people.html',
        controller: 'PeopleController'
    })

    .when('/people/edit:personId', {
        title: 'Edit Person',
        templateUrl: 'views/edit-person.html',
        controller: 'EditPersonController',
        resolve:{
            personId: function($route){
                var personId = $route.current.params.personId.substr(1);//ToDo deal with the colon on the first position
                return personId;
            },
            personRequest: function(People, $route){
                var personId = $route.current.params.personId.substr(1);//ToDo deal with the colon on the first position
                var request = People.get(personId);
                return request;
            }
        }
    })

    .when('/people/add', {
        title: 'Add Person',
        templateUrl: 'views/edit-person.html',
        controller: 'AddPersonController'
    });

$locationProvider.html5Mode(true);

}]);
