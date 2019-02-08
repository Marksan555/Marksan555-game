import Matter from 'matter-js';
import Config from './config';


let bots = [];
let world;

const createFromConfig = (x, y, type) => {


    switch (type) {
        case 'ball': return createBall(x, y); break;
        // case 'box': createBox(x, y); break;
    }

};

const createBall = (x, y) => {
    const box = Matter.Bodies.rectangle(x, y+20, 40, 40, {label: 'ball'} );
    const collider = Matter.Bodies.circle(x, y, 15, {label: 'ball', isStatic: true});

    const bot = Matter.Body.create({
        parts: [collider, box],          // composing 2 parts into 1
        isStatic: true
    });

    return bot;
};

const createBox = (x, y) => {
    const box = Matter.Bodies.rectangle(x, y, 40, 40, {label: 'map'} );
    Matter.World.add(world, box);
};

const init = (level, w) => {
    const config = Config.getBotsConfig(level);
    world = w;
    config.map((c) => {
        const bot = createFromConfig(c.x, c.y, c.type);
        Matter.World.add(world, bot);
        bots.push(bot);
    });
};

const onKillBot = (bot) => {
    Matter.World.remove(world, bot);
    createBox(bot.position.x, bot.position.x)
};

export default {
    init,
    onKillBot
};
