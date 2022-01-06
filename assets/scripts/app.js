const ATTACK_VALUE = 10; //this syntax shows that we have hardcoded a global value
const STRONG_ATTACK_VALUE = 18;
const MONSTER_ATTACK_VALUE = 14; //monster attacks harder, giving him an edge
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //hard coded static global values to pass in as parameters
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt('Maximum health for you and the monster.', '100') //100 is the initial value

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife; //initalize it with amount that user decides
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry;
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            target: 'Monster',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            target: 'Monster',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: event,
            value: value,
            target: 'Player',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    } else if (event === LOG_EVENT_PLAYER_HEAL)
    {
        logEntry = {
            event: event,
            value: value,
            target: 'Player',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    } else if (event === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
    }
    battleLog.push(logEntry);
}

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife); //resets the game and players health to the chosen value
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth)

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth; //we don't let the monster damage, rather restore our health to before the attack
        alert('You would be dead but the bonus life saved you!');
        setPlayerHealth(initialPlayerHealth);
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
        writeToLog(
            LOG_EVENT_GAME_OVER, 'Player Won', currentMonsterHealth, currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You Lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER, 'Monster Won', currentMonsterHealth, currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('Draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER, 'A Draw', currentMonsterHealth, currentPlayerHealth
        );
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        //any of the losing/winning scenarios
        reset();
    }
}

function attackMonster(attackMode) {
    //figure out why the ternary causes an error           //TODO
    // const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    // const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    if (attackMode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK
    } else {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent, damage, 
        currentMonsterHealth, currentPlayerHealth
    );
    endRound();
}

function attackHandler() { //handler describes that the function is attached to an eventhandler
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
   attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler () {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) { //he will heal above 100
        alert("You can't heal more than initial health")
        healValue = chosenMaxLife - currentPlayerHealth;
    } else { //he won't heal above 100 we give him the full heal amount
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth
    );
    endRound();
}

function printLogHandler() {
    console.log(battleLog)
}


attackBtn.addEventListener('click', attackHandler) //need to add function that happens when button is clicked
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);