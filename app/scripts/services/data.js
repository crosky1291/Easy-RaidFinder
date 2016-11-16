'use strict'

function DataService ($http) {
  var that = this;
  this.getCharacterData = function(callback) {
    var accessToken = localStorage.getItem("access_token"),
        charactersApi = 'https://us.api.battle.net/wow/user/characters';
    
    if (accessToken === null) $location.path('/');

    $http.get(charactersApi + "?access_token=" + accessToken)
    .then(function(response) {
      var realms = that.processCharacters(response.data.characters);
      callback(realms);
    });
  };

  //call this function to only get only the data wanted and return it.
  this.processCharacters = function(characters) {
    var realms = {};
    var classes = {
      0: 'none', 1: 'Warrior', 2: 'Paladin', 3: 'Hunter', 
      4: 'Rogue', 5: 'Priest', 6:'Death Knight', 7:'Shaman', 
      8:'Mage', 9:'Warlock', 10:'Monk', 11:'Druid', 12:'Demon Hunter'
    };

    var races = {
      1: 'Human', 2: 'Orc', 3: 'Dwarf', 4: 'Night Elf', 
      5: 'Undead', 6: 'Tauren', 7: 'Gnome', 8: 'Troll',
      9: 'Goblin', 10: 'Blood Elf', 11: 'Draenei', 
      22: 'Worgen', 24: 'Panda', 25: 'Panda', 26: 'Panda'
    };
    var genders = {
      0: 'Male',
      1: 'Female'
    };

    //go through each character and get the properties wanted.
    characters.forEach(function(char) {
      var charRealm = char.realm,
          classPath = classes[char.class].split(" ").join("").toLowerCase(),
          imgPath = '../images/class_photos/' + classPath + '.png',
          character = {
            name: char.name,
            level: char.level,
            class: classes[char.class],
            classImg: imgPath,
            race: races[char.race],
            gender: genders[char.gender]
          }

      //if the realms storage does not have the current realm make it an empty array;
      if (realms[charRealm] === undefined) realms[charRealm] = [];
      
      //add the character to the realm it belongs.
      realms[charRealm].push(character);
    })  

    //return the realms object with all the characters inside the realm they belong to.
    return realms;
  }
  
};

module.exports = DataService;