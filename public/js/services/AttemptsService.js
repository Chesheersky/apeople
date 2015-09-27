angular.module('AttemptsService', []).factory('Attempts', ['$http', function($http) {
    return {
        getAll : function() {
            return $http.get('/api/attempts');
        },

        get : function(id) {
            return $http.get('/api/attempts/' + id);
        },

        create : function(attempt) {
            return $http.post('/api/attempts', attempt);
        },

        update : function(attemptId, attempt) {
            return $http.put('/api/attempts/' + attemptId, attempt);
        },

        delete : function(id) {
            return $http.delete('/api/attempts/' + id);
        }
    }
}]);
