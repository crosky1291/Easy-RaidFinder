angular
    .module('Codesmith.HomeController', ['ngRoute'])
    .controller('HomeController', HomeController);


function HomeController($scope, $http, $window) {


    $scope.login = function() {
        var client_id = "gvyz3zhzr9u6ck4fejksf8wbrtt84jzh";
        var redirect_uri = "http://localhost:3000/profile";
        var response_type = "code";
        var url = "https://us.battle.net/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type;
        window.location.replace(url);
    };

    // $scope.login = function() {
    //   var id = "gvyz3zhzr9u6ck4fejksf8wbrtt84jzh";
    //   var token = "r3m9uckzqc49mukjsqeutcz9";
    //   var url = "https://us.api.battle.net/wow/user/characters/"
    //   var authorizeUri = "https://us.battle.net/oauth/authorize"

    //   $http.get(url + '?access_token=' + token).then(function(response) {
    //     //$window.location.href = './partials/user1.html'
    //     var characters = [];
    //     var realms = [];
    //     response.data.characters.forEach(function(char) {
    //       var character = {};
    //       character.name = char.name;
    //       character.realm = char.realm;
    //       character.image = "http://g03.a.alicdn.com/kf/HTB1q7ooJXXXXXa2XVXXq6xXFXXXI/DC-Unlimited-Series-1-Wow-Action-Figure-7-75-inch-Orc-Shaman-Rehgar-Earthfury-WOW-Character.jpg";
    //       character.level = char.level;
    //       characters.push(character);

    //       if (realms.indexOf(char.realm) === -1) {
    //         realms.push(char.realm);
    //       }
    //     });
    //     console.log(characters);
    //     console.log(realms);
    //     var obj = JSON.stringify({
    //       user: $scope.count,
    //       characters: characters,
    //       realms: realms
    //     });

    //     $http.post('/', obj);
    //     $scope.characters = characters;
    //     $scope.realms = realms;
    //   });
    // }

// $scope.search = function() {
//   $http.get('/profile').then(function(response) {
//     console.log(response);
//     $scope.name = response.data[1].characters[0];
//   });
// }
}



