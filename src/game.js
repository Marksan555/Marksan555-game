
import Matter from 'matter-js';
import $ from 'jquery';
import Hero from './hero.js';
import Map from './map.js';


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
    Body = Matter.Body,
    Vector = Matter.Vector;
    
    // create engine
    var engine = Engine.create(),
    world = engine.world;
    
    // create renderer
    var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600
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
        Hero.onUpdate(world)
    });

    Matter.Events.on(engine, 'collisionStart', function(event) {
        Hero.onCollisionStart(event, world, collider)
    });
    
    
    
    Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
    });
    
}

export default {
    init
}