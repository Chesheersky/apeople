angular.module('PeopleService', []).factory('People', ['$http', function($http) {

    return {
        getAll : function() {
            return $http.get('/api/people');
        },

        get : function(id) {
            return $http.get('/api/people/' + id);
        },

        create : function(person) {
            return $http.post('/api/people', person);
        },

        update : function(person) {
            return $http.update('/api/people/' + id, person);
        },

        delete : function(id) {
            return $http.delete('/api/people/' + id);
        }
    }

}]);
