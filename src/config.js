import level_1 from './../config/levels/level_1.json';
import level_2 from './../config/levels/level_2.json';

const levels = [
    level_1,
    level_2,
];

const getLevelConfig = (level) => {
    return levels[level-1];
};

const getHeroConfig = (level) => {
    return levels[level-1].hero;
};

export default {
    getLevelConfig,
    getHeroConfig,
};
