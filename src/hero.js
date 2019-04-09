import Matter from 'matter-js';
import $ from 'jquery';
import Config from './config';
import sprite from '../assets/sprites/hero5.png';

let hero;
let gun;
let body;

let jump = false;
let right = false;
let left = false;
let shoot = false;

let angleUp = false;
let angleDown = false;

let canJump = false;

const init = (level) => {

    const config = Config.getHeroConfig(level);

    hero = Matter.Bodies.rectangle(config.x, config.y, 15, 30, { 
        collisionFilter: {category: 1},
        inertia: Infinity, 
        label: 'body',
        render: {
            // options: {
            //     heigth: 20,
            //     width: 20,
            // },
            sprite: {
                texture: 'https://www.clipartmax.com/png/small/415-4151823_black-widow-sprite-16-bit-mega-man.png',
                xScale: 0.06,
                yScale: 0.1,
            }
        }
    });
    gun = Matter.Bodies.rectangle(config.x, config.y, 20, 4, { collisionFilter: {mask: 2}});
    // gun.position.x = gun.bounds.min.x+2;
    // gun.position.y = gun.bounds.min.y;
    // gun.positionPrev.x = gun.bounds.min.x+2;
    // gun.positionPrev.y = gun.bounds.min.y;


    body = Matter.Constraint.create({
        bodyA: hero,
        bodyB: gun,
        render: {
            // options: {
                // heigth: 20,
                // width: 20,
            // },
            sprite: {
                texture: 'https://unixtitan.net/images/vector-sprites-sonic-classic-hero-2.png',
                // xScale: 0.05,
                // yScale: 0.1,
            }
        
        // length: 0
        }});

    // hero = Matter.Body.create({
    //     parts: [body, gun],          // composing 2 parts into 1
    // });

    // HERO LEFT and RIGHT
    $('body').on('keydown', function(e) {
        if (e.which === 65) { // left arrow key
            left = true;
        } else if (e.which === 68) { // right arrow key

            right = true;
        } else if (e.which === 87) { // "W" key
            jump = true;
        } else if (e.which === 38) { // up arrow key
            angleUp = true;
        } else if (e.which === 40) { // down arrow key
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
        } else if (e.which === 32) { // SPACE key
            shoot = true;
        } else if (e.which === 38) { // up arrow key
            angleUp = false;
        } else if (e.which === 40) { // down arrow key
            angleDown = false;
        }
    });

};

const add = (world) => {
    Matter.World.add(world, [body, gun, hero]);
};

const onUpdate = (world) => {
        if (left) {
            Matter.Body.setVelocity( hero, {x: -3, y: hero.velocity.y}); // if the player presses <, game will force the hero to the left
        }
        if (right) {
            Matter.Body.setVelocity( hero, {x: 3, y: hero.velocity.y});  // if the player presses >, game will force the hero to the right
        }
        if (jump && canJump) {
            canJump = false;
            Matter.Body.setVelocity( hero, {x: hero.velocity.x, y: -7}); // if the player presses SPACE, game will force the hero to jump
        }
        if (shoot) {
            shoot = false;
            var bullet = Matter.Bodies.circle(hero.position.x+5, hero.position.y, 3, {label: 'bullet'}); //creating a body("bullet") and putting a label on it
            Matter.World.add(world, [bullet]);      // adding "bullet" to the world

            Matter.Body.setVelocity( bullet, {x: Math.cos(gun.angle)*10, y: Math.sin(gun.angle)*10}); // Sets the linear velocity of the body instantly.
        }
        if (angleUp) {
            Matter.Body.setAngle( gun, gun.angle - 0.1); // if the player presses "up arrow key", the gun will move counterclockwise
        }
        if (angleDown) {
            Matter.Body.setAngle( gun, gun.angle + 0.1); // if the player presses "down arrow key", the gun will move clockwise
        }
}
var defaultCategory = 0x0001;
var blueColor = '#4ECDC4';
const makeFire = (x, y, world) => {
    x = x + parseInt(Math.random()*20 - 10);
    y = y + parseInt(Math.random()*20 - 10); // letting the gun to shoot
    let i = 0;
    setInterval(()=> {
        i = i + 1;
        if (i < 10) {
            const el = Matter.Bodies.circle(
                x, y, 15,  {
                    collisionFilter: {
                    mask: defaultCategory},
                    render: {
                        fillStyle: blueColor}
                    });
            Matter.World.add(world, el);
        }
    }, 10);
};

const onCollisionStart = (event, world, onKillBot, onFinish, onRedBoxKill) => {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];
        if (pair.bodyA.label === 'ball' && pair.bodyB.label === 'bullet') {
            // Matter.World.remove(world, pair.bodyA.parent.parts[0]);
            onKillBot(pair.bodyA.parent);
            // makeFire(pair.bodyA.position.x, pair.bodyA.position.y, world);             // if the bullet hits the ball, the ball will be removed from the world
        } else if (pair.bodyB.label === 'ball' && pair.bodyA.label === 'bullet') {
            Matter.World.remove(world, pair.bodyB);
            // makeFire(pair.bodyA.position.x, pair.bodyA.position.y, world);
        } else if (pair.bodyA.label === 'map' && pair.bodyB.label === 'bullet') {     // if the bullet hits the map, the bullet will dissappear
            Matter.Composite.remove(world, pair.bodyB);
        } else if (pair.bodyB.label === 'map' && pair.bodyA.label === 'bullet') {
            Matter.Composite.remove(world, pair.bodyA);
        } else if (pair.bodyA.label === 'body' && pair.bodyB.label === 'map') {         // prevent the hero jumping endlessly
            canJump = true;
        } else if (pair.bodyA.label === 'map' && pair.bodyB.label === 'body') {
            canJump = true;
        } else if (pair.bodyA.label === 'body' && pair.bodyB.label === 'finish') {         // prevent the hero jumping endlessly
            onFinish();
        } else if (pair.bodyA.label === 'finish' && pair.bodyB.label === 'body') {
            onFinish();
        } else if (pair.bodyA.label === 'redbox' && pair.bodyB.label === 'bullet') {    
            Matter.Composite.remove(world, [pair.bodyA, pair.bodyB]);
            onRedBoxKill();
        } else if (pair.bodyA.label === 'bullet' && pair.bodyB.label === 'redbox') {     
            Matter.Composite.remove(world, [pair.bodyA, pair.bodyB]);
            onRedBoxKill();
        }
    }
};

const getBody = () => {
    return hero;
};

export default {
    init,
    add,
    onUpdate,
    onCollisionStart,
    getBody
};
