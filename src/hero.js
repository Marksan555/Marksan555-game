import Matter from 'matter-js';
import $ from 'jquery';

let hero;
let gun;

let jump = false;
let right = false;
let left = false;
let shoot = false;

let angleUp = false;
let angleDown = false;

let canJump = false;

const init = (world) => {
    let bodyOptions = {
        frictionAir: 0,
        friction: 0.0001,
        restitution: 0.6
    };
    
    let body = Matter.Bodies.rectangle(400, 200, 15, 30, { inertia: Infinity, label: 'body', });
    gun = Matter.Bodies.rectangle(400, 200, 30, 5);
    
    hero = Matter.Body.create({
        parts: [body, gun]
    });

    
    
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

}

const add = (world) => {
    Matter.World.add(world, [hero]);
}

const onUpdate = (world) => {
        if (left) {
            Matter.Body.setVelocity( hero, {x: -3, y: hero.velocity.y});
        }
        if (right) {
            Matter.Body.setVelocity( hero, {x: 3, y: hero.velocity.y});
        }
        if (jump && canJump) {
            canJump = false;
            Matter.Body.setVelocity( hero, {x: hero.velocity.x, y: -7});
        }
        if (shoot) {
            shoot = false;
            var bullet = Matter.Bodies.circle(hero.position.x+5, hero.position.y, 3, {label: 'bullet'});
            Matter.World.add(world, [bullet]);
    
            Matter.Body.setVelocity( bullet, {x: Math.cos(gun.angle)*10, y: Math.sin(gun.angle)*10});
        }
        if (angleUp) {
            Matter.Body.setAngle( gun, gun.angle - 0.1);
        }
        if (angleDown) {
            Matter.Body.setAngle( gun, gun.angle + 0.1);
        }
}

const onCollisionStart = (event, world, collider) => {
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
            } else if (pair.bodyA.label === 'body' && pair.bodyB.label === 'map') {
                canJump = true;
            } else if (pair.bodyA.label === 'map' && pair.bodyB.label === 'body') {
                canJump = true;
            }
        }
}

export default {
    init,
    add,
    onUpdate,
    onCollisionStart
};