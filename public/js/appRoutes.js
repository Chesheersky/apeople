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

    .when('/people/edit:id', {
        title: 'Edit Customers',
        templateUrl: 'views/edit-person.html',
        controller: 'EditPersonController',
        resolve: {
            person: function(People, $route){
                var personId = $route.current.params.id;
                return People.get(personId);
            }
        }
    });

$locationProvider.html5Mode(true);

}]);
