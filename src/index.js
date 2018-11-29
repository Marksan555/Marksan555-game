import Matter from 'matter-js';
import $ from 'jquery';
global.decomp = require('poly-decomp');
require('pathseg');


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Query = Matter.Query,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

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

// add bodies
var terrain;

$.get('https://raw.githubusercontent.com/liabru/matter-js/master/demo/svg/terrain.svg').done(function(data) {
    var vertexSets = [];

    $(data).find('path').each(function(i, path) {
        console.log(path);
        vertexSets.push(Svg.pathToVertices(path, 30));
    });

    terrain = Bodies.fromVertices(400, 350, vertexSets, {
        isStatic: true,
        render: {
            fillStyle: '#fff',
            strokeStyle: '#fff',
            lineWidth: 1
        }
    }, true);

    World.add(world, terrain);

    var bodyOptions = {
        frictionAir: 0,
        friction: 0.0001,
        restitution: 0.6
    };

    const hero = Bodies.rectangle(400, 200, 10, 20, { inertia: Infinity });
    World.add(world, hero);

    let jump = false;
    let right = false;
    let left = false;


    // HERO LEFT and RIGHT
    $('body').on('keydown', function(e) {
        if (e.which === 37) { // left arrow key
            // Body.setVelocity( hero, {x: -3, y: hero.force.y});
            left = true;
        } else if (e.which === 39) { // right arrow key
            // Body.setVelocity( hero, {x: 3, y: hero.force.y});
            right = true;
        } else if (e.which === 38) {
            jump = true;
        }
    });

    // HERO JUMP
    $('body').on('keyup', function(e) {
        if (e.which === 38) { // left arrow key
            jump = false;
        } else if (e.which === 37) { // left arrow key
            left = false;
        } else if (e.which === 39) { // right arrow key
            // Body.setVelocity( hero, {x: 3, y: hero.force.y});
            right = false;
        }
    });

    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        if (left) {
            Body.setVelocity( hero, {x: -3, y: hero.velocity.y});
        }
        if (right) {
            Body.setVelocity( hero, {x: 3, y: hero.velocity.y});
        }
        if (jump) {
            Body.setVelocity( hero, {x: hero.velocity.x, y: -7});
        }
    });



});


// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

