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
    })

    .when('/quests', {
        templateUrl: 'views/quests.html',
        controller: 'QuestsController'
    })

    .when('/quests/edit:questId', {
        title: 'Edit Quest',
        templateUrl: 'views/edit-quest.html',
        controller: 'EditQuestController',
        resolve:{
            questId: function($route){
                var questId = $route.current.params.questId.substr(1);//ToDo deal with the colon on the first position
                return questId;
            },
            questRequest: function(Quests, $route){
                var questId = $route.current.params.questId.substr(1);//ToDo deal with the colon on the first position
                var request = Quests.get(questId);
                return request;
            }
        }
    })

    .when('/quests/add', {
        title: 'Add Quest',
        templateUrl: 'views/edit-quest.html',
        controller: 'AddQuestController'
    });

$locationProvider.html5Mode(true);
}]);
