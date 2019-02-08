import Matter from 'matter-js';




const add = (world) => {        
    var collider = Matter.Bodies.circle(450, 0, 15, {label: 'ball'});
    Matter.World.add(world, collider);
    setInterval(()=> {
        const min = -10;
        const max = 10;
        Matter.Body.setVelocity( 
            collider, 
            {    
                x: Math.random() * (max - min) + min,
                y: Math.random() * (max - min) + min // setiing to force circles to randomly directions
            }
        );
    }, 1000) // creating a circle spawner with an interval(1sec)
}

export default {
    add
};