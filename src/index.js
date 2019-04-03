import decomp from 'poly-decomp'
require('pathseg');

window.decomp = decomp;

import Game from './game.js';

window.startGame = function() {
    document.getElementById("start-game").style.display = "none";
    Game.init();
}

