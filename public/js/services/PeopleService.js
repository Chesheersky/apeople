angular.module('PeopleService', []).factory('People', ['$http', function($http) {

    return {
        get : function() {
            return $http.get('/api/people');
        },

        create : function(person) {
            return $http.post('/api/people', person);
        },

        delete : function(id) {
            return $http.delete('/api/people/' + id);
        }
    }

}]);
