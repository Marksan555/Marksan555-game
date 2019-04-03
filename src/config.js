import level_1 from './../config/levels/level_1.json';
import level_2 from './../config/levels/level_2.json';
import level_3 from './../config/levels/level_3.json';

const levels = [
    level_1,
    level_2,
    level_3,
];

const getLevelConfig = (level) => {
    return levels[level-1];
};

const getHeroConfig = (level) => {
    return levels[level-1].hero;
};

const getBotsConfig = (level) => {
    return levels[level-1].bots ? levels[level-1].bots : [];
};

const getFinishConfig = (level) => {
    return levels[level-1].finish ? levels[level-1].finish : {};
};

export default {
    getLevelConfig,
    getHeroConfig,
    getBotsConfig,
    getFinishConfig
};
