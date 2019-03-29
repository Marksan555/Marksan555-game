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
        label: 'map',
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

    var body = Bodies.rectangle(400, 200, 15, 30, { inertia: Infinity });
    var gun = Bodies.rectangle(400, 200, 30, 5);

    var hero = Body.create({
        parts: [body, gun]
    });

    var collider = Bodies.circle(650, 430, 30);
    
    World.add(world, [hero, collider]);

    let jump = false;
    let right = false;
    let left = false;
    let shoot = false;

    let angleUp = false;
    let angleDown = false;


    // HERO LEFT and RIGHT
    $('body').on('keydown', function(e) {
        if (e.which === 65) { // left arrow key
            left = true;
        } else if (e.which === 68) { // right arrow key
           
            right = true;
        } else if (e.which === 87) {
            jump = true;
        } else if (e.which === 38) {
            angleUp = true;
        } else if (e.which === 40) {
            angleDown = true;
        } 
    });

    // HERO JUMP
    $('body').on('keyup', function(e) {
        if (e.which === 87) { // left arrow key
            jump = false;
        } else if (e.which === 65) { // left arrow key
            left = false;
        } else if (e.which === 68) { // right arrow key         
            right = false;
        } else if (e.which === 32) {
            shoot = true;
        } else if (e.which === 38) {
            angleUp = false;
        } else if (e.which === 40) {
            angleDown = false;
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
        if (shoot) {
            shoot = false;
            var bullet = Bodies.circle(hero.position.x+5, hero.position.y, 3, {label: 'bullet'});
            World.add(world, [bullet]);

            Body.setVelocity( bullet, {x: Math.cos(gun.angle)*10, y: Math.sin(gun.angle)*10});
        }
        if (angleUp) {
            Body.setAngle( gun, gun.angle - 0.1);
        }
        if (angleDown) {
            Body.setAngle( gun, gun.angle + 0.1);
        }
    });
    Matter.Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            if (pair.bodyA === collider && pair.bodyB.label === 'bullet' ) {
                Matter.Composite.remove(world, collider);
            } else if (pair.bodyB === collider && pair.bodyA.label === 'bullet') {
                Matter.Composite.remove(world, collider);
            } else if (pair.bodyA.label === 'map' && pair.bodyB.label === 'bullet' ) {
                Matter.Composite.remove(world, pair.bodyB);
            } else if (pair.bodyB.label === 'map' && pair.bodyA.label === 'bullet' ) {
                Matter.Composite.remove(world, pair.bodyA);
            }
        }
    });



});


// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

