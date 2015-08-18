angular.module('QuestsService', []).factory('Quests', ['$http', function($http) {
    return {
        getAll : function() {
            return $http.get('/api/quests');
        },

        get : function(id) {
            return $http.get('/api/quests/' + id);
        },

        create : function(person) {
            return $http.post('/api/quests', person);
        },

        update : function(personId, person) {
            return $http.put('/api/quests/' + personId, person);
        },

        delete : function(id) {
            return $http.delete('/api/quests/' + id);
        }
    }
}]);
