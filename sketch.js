var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObject;

function preload(){
  sadDog = loadImage("Images/Dog.png");

  happyDog = loadImage("Images/happy dog.png");

}

function setup() {
  database = firebase.database();

  createCanvas(1000, 400);

  foodObject = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);

  foodObject.display();

  fedTime = database.ref('FeedTime');

  fedTime.on("value", function(data){
    lastFed = data.val();

  });
 
  fill(255, 255, 254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : "+ lastFed%12 + " PM ", 350, 30);

   } else if(lastFed == 0){
     text("Last Feed : 12 AM ", 350, 30);

     } else{
     text("Last Feed : "+ lastFed + " AM ", 350, 30);

       }

  drawSprites();

}

function readStock(data){
  foodS = data.val();

  foodObject.updateFoodStock(foodS);

}

function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObject.getFoodStock()<= 0){
    foodObject.updateFoodStock(foodObject.getFoodStock() * 0);

  } else{
    foodObject.updateFoodStock(foodObject.getFoodStock() - 1);

  }
  
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    FeedTime: hour()

  })

}

function addFoods(){
  foodS++;

  database.ref('/').update({
    Food: foodS
    
  })

}