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
    const box = Matter.Bodies.rectangle(x, y+20, 40, 40, {
        label: 'ball',
        render: {
            sprite: {
                texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sprite_logo.jpg/900px-Sprite_logo.jpg',
                xScale: 0.05,
                yScale: 0.05,
            }
        }
    } );
    const collider = Matter.Bodies.circle(x, y, 15, {label: 'ball', isStatic: true,
    render: {
        sprite: {
            texture: 'http://bucharestgamingweek.ro/wp-content/uploads/2018/11/kisspng-sprite-logo-coca-cola-fanta-brand-5b76a9d68aab95.686730951534503382568.jpg',
            xScale: 0.05,
            yScale: 0.05,
        }
    }});

    const bot = Matter.Body.create({
        parts: [collider, box],          // composing 2 parts into 1
        isStatic: true
    });

    return bot;
};

const createBox = (x, y) => {
    const box = Matter.Bodies.rectangle(x, y, 60, 60, {
        label: 'map',
        render: {
            sprite: {
                texture: 'https://cdn0.iconfinder.com/data/icons/sports-colored-icons-3/48/112-512.png',
                xScale: 0.12,
                yScale: 0.12,
        }
    }} );
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
