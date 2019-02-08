import Matter from 'matter-js';
import Hero from './hero.js';
import Map from './map.js';
import View from './view.js';
import Bot from './bot.js';


const init = () => {
    const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner;


    // create engine
    var engine = Engine.create(),
    world = engine.world;

    var render = Render.create({
        element: document.getElementById('container'),
        engine: engine,
        options: {
            width: 1280,
            height: 720,
            // pixelRatio: 3,              // setting a resolution for a game
            wireframeBackground: '#FFFFF',
            // hasBounds: true,
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);



    setInterval(() => {
        Bot.add(world);     // setting an inteval for adding the bot to the world(1sec)
    }, 1000);


    Map.initLevel(1, world);
    Hero.init(1);
    Hero.add(world);


    // var collider = Matter.Bodies.circle(650, 430, 30);
    // Matter.World.add(world, [collider]);

    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        Hero.onUpdate(world);
        View.setCameraView(render, world, Hero.getBody()); // when hero is added, set cameraview on him
    });

    Matter.Events.on(engine, 'collisionStart', function(event) {
        Hero.onCollisionStart(event, world);
    });

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 700, y: 600 }
    });

};

export default {
    init
};
