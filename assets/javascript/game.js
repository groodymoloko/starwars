// this is the jquery scripting for Star Wars RPG

// load document before starting javascript
$(document).ready(function(){

    // initialize the game
    function initializeGame() {
        characters = characterObjects();
        gameState = {
            yourCharacter: "",
            yourOpponent: "",
            enemiesLeft: 0,
            numAttacks: 0
            }
        showCharacters();
    }

    var saberSounds = ["assets/images/saber1.mp3", "assets/images/saber1.mp3", "assets/images/saber3.mp3"];

    // set object parameters for each character
    function characterObjects() {
        return {
        "jarJar": {
            name: "Jar Jar",
            healthPoints: 120,
            attackPower: 8,
            counterAttack: 15,
            image: "assets/images/jarjar.jpg"
        },
        "bobaFett": {
            name: "Boba Fett",
            healthPoints: 100,
            attackPower: 14,
            counterAttack: 5,
            image: "assets/images/boba.jpg"
        },
        "darthVader": {
            name: "Darth",
            healthPoints: 150,
            attackPower: 8,
            counterAttack: 20,
            image: "assets/images/darth.jpg"
        },
        "porg": {
            name: "The Porg",
            healthPoints: 180,
            attackPower: 7,
            counterAttack: 25,
            image: "assets/images/porg.jpg"
        }
      }
    }

    //builds the html objects
    function createCharactersDiv (character, key) {
        var charDiv = $("<div class='character' data-name='" + key + "'>");
        var charName = $("<div class='characterName'>").text(character.name);
        var charImage = $("<img alt='image' class='characterImage'>").attr('src', character.image);
        var charHealth = $("<div class='characterHealthPoints'>").text(character.healthPoints);
        charDiv.append(charName).append(charImage).append(charHealth);
        return charDiv;
    }
    
    // shows all characters to choose from by populating html with created characters
    function showCharacters() { 
        var characterArray = Object.keys(characters);
        for (var i = 0; i < characterArray.length; i++) {
        var characterIndex = characterArray[i];
        var character = characters[characterIndex];
        var charDiv = createCharactersDiv(character, characterIndex);
        $('#charactersDiv').append(charDiv);
        }
    }
    
    // shows the remaining opponents
    function showOpponents (yourCharacterKey) {
        var characterKeys = Object.keys(characters);
        for (var i = 0; i < characterKeys.length; i++) {
            if (characterKeys[i] !== yourCharacterKey) {
                var enemyKey = characterKeys[i];
                var enemy = characters[enemyKey];
                var enemyDiv = createCharactersDiv(enemy, enemyKey);
                $(enemyDiv).addClass('enemy');
                $('#pickAnEnemyDiv').append(enemyDiv);
            }
        }
    }
    
    function enableEnemySelection() {
        $('.enemy').on('click.enemySelect', function () {
        var opponentKey = $(this).attr('data-name');
        gameState.yourOpponent = characters[opponentKey];

        $('#opponentDiv').append(this);
        console.log(this);
        $(this).animate({left: '41%'});
        $('#attackButton').show();
        $('.enemy').off('click.enemySelect');
        });
    }

    $('#charactersDiv').on('click', '.character', function () {
        var selectedKey = $(this).attr('data-name');
        gameState.yourCharacter = characters[selectedKey];
        $('#yourCharacterDiv').append(this);
        console.log(this);
        $(this).animate({left: '41%'});

        showOpponents(selectedKey);

        $('#charactersParentDiv').hide();

        gameState.enemiesLeft = Object.keys(characters).length - 1;
        enableEnemySelection();
        });

        function attack (numAttacks) {
        gameState.yourOpponent.healthPoints -= gameState.yourCharacter.attackPower * numAttacks;
    }
    
    $('#attackButton').on('click.attack', function () {
        
        i = (Math.floor((Math.random()) * saberSounds.length));
        audio = new Audio(saberSounds[i]);
        audio.play();

        gameState.numAttacks++;

        attack(gameState.numAttacks);

        gameState.yourCharacter.healthPoints -= gameState.yourOpponent.counterAttack;

        $('#yourCharacterDiv .characterHealthPoints').text(gameState.yourCharacter.healthPoints);
        $('#opponentDiv .characterHealthPoints').text(gameState.yourOpponent.healthPoints);

        if (gameState.yourCharacter.healthPoints <= 0) {
            alert('You were vanquished by ' + gameState.yourOpponent.name + '. Click RESET to play again.');
            $('#yourCharacterDiv').empty();
            $('#reset-button').show();

            return true 
        } else if (gameState.yourOpponent.healthPoints <=0) {

            gameState.enemiesLeft--
            $('#opponentDiv').empty();

            if (gameState.enemiesLeft == 0) {

            alert('You defeated all your enemies! Click RESET to play again');
            $('#reset-button').show();
            } 
            else 
            {

            alert('You defeated ' + gameState.yourOpponent.name + '! Select a new enemy.');
            enableEnemySelection();
            }
        }
    });
    
    $('#reset-button').on('click.reset', function () {

        $("#yourCharacterDiv").empty();
        $("#opponentDiv").empty();
        $("#pickAnEnemyDiv .enemy").empty();
        $("#charactersDiv").empty();
        $("#charactersParentDiv").show();
        $(this).hide();
        $("#attackButton").hide();
        initializeGame();
        

    });

    initializeGame();

});