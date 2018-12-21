
import Matter from 'matter-js';
import $ from 'jquery';
import Hero from './hero.js';
import Map from './map.js';
import View from './view.js';

const init = () => {
    var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Query = Matter.Query,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies,
    Bounds = Matter.Bounds,
    Body = Matter.Body,
    Vector = Matter.Vector;
    
    // create engine
    var engine = Engine.create(),
    world = engine.world;
    
    // create renderer
    var render = Render.create({
    element: document.getElementById('container'),
    engine: engine,
    options: {
        width: 1280,
        height: 720,
        pixelRatio: 3,
        wireframeBackground: '#FFFFF',
    }
    });
    
    Render.run(render);
    
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    
    
    Map.init(world);
    Hero.init();
    Hero.add(world);
    
       
    var collider = Matter.Bodies.circle(650, 430, 30);
    Matter.World.add(world, [collider]);

    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        Hero.onUpdate(world);
        View.setCameraView(render, world, Hero.getBody());
    });

    Matter.Events.on(engine, 'collisionStart', function(event) {
        Hero.onCollisionStart(event, world, collider)
    });
    
    
    
    Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 1280, y: 720 }
    });
    
}

export default {
    init
}