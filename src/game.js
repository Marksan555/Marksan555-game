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
            // wireframeBackground: ('#FFFFF'),
            // hasBounds: true,
            wireframes: false,
            showAngleIndicator: false,
            background: '#FFF'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    let level = 1;

    Map.initLevel(level, world);
    Hero.init(level);
    Hero.add(world);
    Bot.init(level, world);

    const onRedBoxKill = () => {
        const allBodies = Matter.Composite.allBodies(world);
        let canShowFinish = true;
        allBodies.forEach(element => {
            if (element.label === "redbox") {
                canShowFinish = false;
            }
        });
        if (canShowFinish) {
            showFinish();
        }
    
       
    }

    const showFinish = () => {
        Map.initFinish(level, world);
    }


    const onFinish = () => {
    //  render.canvas.remove();
    //  render.canvas = null;
    //  render.context = null;
    //  render.textures = {};
        level = level + 1;
        if (level == 4) {
            document.getElementById("game-over").style.display = "block";
        }
        else {
            Matter.World.clear(engine.world);
            Engine.clear(engine);
        

            Map.initLevel(level, world);
            Hero.init(level);
            Hero.add(world);
            Bot.init(level, world);
        
    }};

    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        Hero.onUpdate(world);
        View.setCameraView(render, world, Hero.getBody()); // when hero is added, set cameraview on him
    });

    Matter.Events.on(engine, 'collisionStart', function(event) {
        Hero.onCollisionStart(event, world, Bot.onKillBot, onFinish, onRedBoxKill);
    });

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 700, y: 600 }
    });

};

export default {
    init,
};
