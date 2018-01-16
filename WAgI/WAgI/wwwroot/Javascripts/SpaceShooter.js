var game = new Game();
var isEndGame = false;
var check = true;
var gamePaused = false;
var countWaves = 1;
var hits = 60;
var startGameCheck = false;

function startGame() {
    document.getElementById('playButton').onclick = function () {
        startGameCheck = true;
        init();
    }
}

function init() {
    if (game.init() && this.startGameCheck) {
        getDataFromStack();
        game.start();
        document.getElementById('startBoxId').outerHTML = "";
	}
}


var imageRepository = new function() {
	this.background = new Image();
	this.spaceship = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
    this.enemyBullet = new Image();
    this.firstBoss = new Image();

	var numImages = 6;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.spaceship.onload = function() {
		imageLoaded();
	}
	this.bullet.onload = function() {
		imageLoaded();
	}
	this.enemy.onload = function() {
		imageLoaded();
	}
	this.enemyBullet.onload = function() {
		imageLoaded();
    }
    this.firstBoss.onload = function () {
        imageLoaded();
    }

	this.background.src = "../../Images/gameBg.png";
	this.spaceship.src = "../../Images/ship.png";
	this.bullet.src = "../../Images/bullet.png";
	this.enemy.src = "../../Images/enemy.png";
    this.enemyBullet.src = "../../Images/bullet_enemy.png";
    this.firstBoss.src = "../../Images/boss1.png";
}

function Drawable() {
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";

	this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}

function Background() {
	this.speed = 1;

	this.draw = function() {
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);

		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
Background.prototype = new Drawable();


function Bullet(object) {
	this.alive = false;
	var self = object;

	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	this.draw = function() {
		this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
		this.y -= this.speed;

		if (this.isColliding) {
			return true;
		}
		else if (self === "bullet" && this.y <= 0 - this.height) {
			return true;
		}
		else if (self === "enemyBullet" && this.y >= this.canvasHeight) {
			return true;
		}
		else {
			if (self === "bullet") {
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if (self === "enemyBullet") {
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}

			return false;
		}
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Bullet.prototype = new Drawable();

function QuadTree(boundBox, lvl) {
	var maxObjects = 10;
	this.bounds = boundBox || {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var objects = [];
	this.nodes = [];
	var level = lvl || 0;
	var maxLevels = 5;

	this.clear = function() {
		objects = [];

		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}

		this.nodes = [];
	};

	this.getAllObjects = function(returnedObjects) {
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].getAllObjects(returnedObjects);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	this.findObjects = function(returnedObjects, obj) {
		if (typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT");
			return;
		}

		var index = this.getIndex(obj);
		if (index != -1 && this.nodes.length) {
			this.nodes[index].findObjects(returnedObjects, obj);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	this.insert = function(obj) {
		if (typeof obj === "undefined") {
			return;
		}

		if (obj instanceof Array) {
			for (var i = 0, len = obj.length; i < len; i++) {
				this.insert(obj[i]);
			}

			return;
		}

		if (this.nodes.length) {
			var index = this.getIndex(obj);

			if (index != -1) {
				this.nodes[index].insert(obj);

				return;
			}
		}

		objects.push(obj);

		if (objects.length > maxObjects && level < maxLevels) {
			if (this.nodes[0] == null) {
				this.split();
			}

			var i = 0;
			while (i < objects.length) {

				var index = this.getIndex(objects[i]);
				if (index != -1) {
					this.nodes[index].insert((objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};

	this.getIndex = function(obj) {

		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

		var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
		var bottomQuadrant = (obj.y > horizontalMidpoint);

		if (obj.x < verticalMidpoint &&
				obj.x + obj.width < verticalMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		else if (obj.x > verticalMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}

		return index;
	};

	this.split = function() {
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;

		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
	};
}


function Pool(maxSize) {
	var size = maxSize; 
	var pool = [];

	this.getPool = function() {
		var obj = [];
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	}

	this.init = function(object) {
		if (object == "bullet") {
			for (var i = 0; i < size; i++) {
				// Initalize the object
				var bullet = new Bullet("bullet");
				bullet.init(0,0, imageRepository.bullet.width,
										imageRepository.bullet.height);
				bullet.collidableWith = "enemy";
				bullet.type = "bullet";
				pool[i] = bullet;
			}
		}
		else if (object == "enemy") {
			for (var i = 0; i < size; i++) {
				var enemy = new Enemy();
				enemy.init(0,0, imageRepository.enemy.width,
									 imageRepository.enemy.height);
				pool[i] = enemy;
			}
        }
		else if (object == "firstBoss") {
		    for (var i = 0; i < size; i++) {
		        var boss1 = new FirstBoss();
		        boss1.init(0, 0, imageRepository.firstBoss.width,
		            imageRepository.firstBoss.height);
		        pool[i] = boss1;
		    }
		}
		else if (object == "enemyBullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("enemyBullet");
				bullet.init(0,0, imageRepository.enemyBullet.width,
										imageRepository.enemyBullet.height);
				bullet.collidableWith = "ship";
				bullet.type = "enemyBullet";
				pool[i] = bullet;
			}
		}
	};

	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};

	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
	};

	this.animate = function() {
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
        if (game.enemyPool.getPool().length === 0) {
            if (!gamePaused) {
                countWaves += 1;
                if (countWaves % 2 === 0) {
                    game.redirectToFirstBoss();
                } else {
                    game.redirectToWave();
                } 
            }
            


            /*gamePaused = true;
            var element = document.getElementById("Context");
            element.style.visibility = 'visible';

          	if (!gamePaused) {
			     game.spawnWave();
			}*/
        }
	};
}


function unPauseGame() {
    
    if (gamePaused) {
        gamePaused = false;
        console.log("Val la game paused: " + gamePaused);
        var element = document.getElementById("Context");
        element.style.visibility = 'hidden';
    }
}

function Ship() {
	this.colided=false;
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("bullet");
	var fireRate = 7;
	var counter = 0;
	this.collidableWith = "enemyBullet";
	this.type = "ship";

	this.draw = function() {
		this.context.drawImage(imageRepository.spaceship, this.x, this.y);
	};
	this.move = function() {
		counter++;
		if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up) {

			this.context.clearRect(this.x, this.y, this.width, this.height);

			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Kep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}

			if (!this.isColliding) {
				this.draw();
			}
			else{
				if(this.colided==false){
					isEndGame = true;
				}
				this.colided=true;
			}
		}
		if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
			this.fire();
			counter = 0;
		}
	};

	this.fire = function() {
		this.bulletPool.getTwo(this.x+0, this.y, 30,
		                       this.x+30, this.y, 30);
	};
}
Ship.prototype = new Drawable();

function FirstBoss() {
    
    var percentFire = .01;
    this.alive = false;
    this.collidableWith = "bullet";
    this.type = "firstBoss";

    this.spawn = function (x, y, speed) {
        this.x = x - 80;
        this.y = y - 70;
        this.speed = speed;
        this.speedX = 0;
        this.speedY = speed;
        this.alive = true;
        this.leftEdge = this.x - 200;
        this.rightEdge = this.x - 20;
        this.bottomEdge = this.y + 140;
    };


    this.draw = function () {
        if (!check) {
            return;
        }
        if (!isEndGame) {
            this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height);
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x <= this.leftEdge) {
                this.speedX = this.speed;
            }
            else if (this.x >= this.rightEdge + this.width) {
                this.speedX = -this.speed;
            }
            else if (this.y >= this.bottomEdge) {
                this.speed = 1.5;
                this.speedY = 0;
                this.y -= 5;
                this.speedX = -this.speed;
            }

            if (!this.isColliding) {
               
                this.context.drawImage(imageRepository.firstBoss, this.x, this.y);

                chance = Math.floor(Math.random() * 101);
                if (chance / 100 < percentFire) {
                    this.fire();
                }

                return false;
            }
            else {
                console.log("Boss Lovit");
                this.isColliding = !this.isColliding;
                hits -= 1;
                if (hits === 0) {
                    hits = 60;
                    var element = document.getElementById("Context");
                    element.style.visibility = 'visible';
                    gamePaused = true;
                    return true;
                }
                return false; 
            }
        }
        else {
            alert("Game Over!");
            check = false;
        }

    };

    this.fire = function () {
        game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
    };

    this.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
FirstBoss.prototype = new Drawable();

function Enemy() {
	var percentFire = .0001 ;
	this.alive = false;
	this.collidableWith = "bullet";
	this.type = "enemy";

	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.alive = true;
		this.leftEdge = this.x - 90;
		this.rightEdge = this.x + 90;
		this.bottomEdge = this.y + 140;
	};

	
	this.draw = function() {
		if(!check) {
			return;
		}
		if(!isEndGame){
			this.context.clearRect(this.x-1, this.y, this.width+1, this.height);
			this.x += this.speedX ;
			this.y += this.speedY;
			if (this.x <= this.leftEdge) {
				this.speedX = this.speed;
			}
			else if (this.x >= this.rightEdge + this.width) {
				this.speedX = -this.speed;
			}
			else if (this.y >= this.bottomEdge) {
				this.speed = 1.5;
				this.speedY = 0;
				this.y -= 5;
				this.speedX = -this.speed;
			}
	
			if (!this.isColliding) {
				this.context.drawImage(imageRepository.enemy, this.x, this.y);
	
				chance = Math.floor(Math.random()*101);
				if (chance/100 < percentFire) {
					this.fire();
				}
	
				return false;
			}
			else {
				return true;
			}
		}
		else {
			alert("Game Over!");
			check = false;
		}
		
	};

	this.fire = function() {
		game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -2.5);
	};

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Enemy.prototype = new Drawable();


function Game() {
    this.init = function () {
        this.bgCanvas = document.getElementById('background');
        this.shipCanvas = document.getElementById('ship');
        this.mainCanvas = document.getElementById('main');

        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.shipContext = this.shipCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');

            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Ship.prototype.context = this.shipContext;
            Ship.prototype.canvasWidth = this.shipCanvas.width;
            Ship.prototype.canvasHeight = this.shipCanvas.height;

            Bullet.prototype.context = this.mainContext;
            Bullet.prototype.canvasWidth = this.mainCanvas.width;
            Bullet.prototype.canvasHeight = this.mainCanvas.height;

            Enemy.prototype.context = this.mainContext;
            Enemy.prototype.canvasWidth = this.mainCanvas.width;
            Enemy.prototype.canvasHeight = this.mainCanvas.height;

            FirstBoss.prototype.context = this.mainContext;
            FirstBoss.prototype.canvasWidth = this.mainCanvas.width;
            FirstBoss.prototype.canvasHeight = this.mainCanvas.height;

            this.background = new Background();
            this.background.init(0, 0);

            this.ship = new Ship();
            var shipStartX = this.shipCanvas.width / 2 - imageRepository.spaceship.width;
            var shipStartY = this.shipCanvas.height / 1.5 + imageRepository.spaceship.height * 2;
            this.ship.init(shipStartX, shipStartY,
                imageRepository.spaceship.width,
                imageRepository.spaceship.height);

            this.enemyPool = new Pool(30);

            this.enemyPool.init("enemy");
            this.spawnWave();

            this.enemyBulletPool = new Pool(30);
            this.enemyBulletPool.init("enemyBullet");

            this.quadTree = new QuadTree({ x: 0, y: 0, width: this.mainCanvas.width, height: this.mainCanvas.height });

            return true;
        } else {
            return false;
        }
    };

    this.redirectToWave = function () {
        this.enemyPool.init("enemy");
        this.spawnWave();
    }

    this.redirectToFirstBoss = function () {
        this.enemyPool.init("firstBoss");
        this.spawnFirstBoss();
    }

    this.spawnFirstBoss = function () {
        var height = imageRepository.firstBoss.height;
        var width = imageRepository.firstBoss.width;
        var x = 320;
        var y = -height + 200;
        this.enemyPool.get(x, y, 2);
        x += width + 300;
    };

    this.spawnWave = function () {
        var height = imageRepository.enemy.height;
        var width = imageRepository.enemy.width;
        var x = 100;
        var y = -height;
        var spacer = y * 1.5;
        for (var i = 1; i <= 18; i++) {
            this.enemyPool.get(x, y, 2);
            x += width + 25;
            if (i % 6 == 0) {
                x = 100;
                y += spacer;
            }
        }
    };

    this.start = function () {
        this.ship.draw();
        animate();
    };
}


function animate() {
    game.quadTree.clear();
    game.quadTree.insert(game.ship);
    game.quadTree.insert(game.ship.bulletPool.getPool());
    game.quadTree.insert(game.enemyPool.getPool());
    game.quadTree.insert(game.enemyBulletPool.getPool());

    detectCollision();

    requestAnimFrame(animate);
    game.background.draw();
    game.ship.move();
    game.ship.bulletPool.animate();
    game.enemyPool.animate();
    game.enemyBulletPool.animate();
}

function detectCollision() {
    var objects = [];
    game.quadTree.getAllObjects(objects);

    for (var x = 0, len = objects.length; x < len; x++) {
        game.quadTree.findObjects(obj = [], objects[x]);

        for (y = 0, length = obj.length; y < length; y++) {

            // DETECT COLLISION ALGORITHM
            if (objects[x].collidableWith === obj[y].type &&
                (objects[x].x < obj[y].x + obj[y].width &&
                    objects[x].x + objects[x].width > obj[y].x &&
                    objects[x].y < obj[y].y + obj[y].height &&
                    objects[x].y + objects[x].height > obj[y].y)) {
                objects[x].isColliding = true;
                obj[y].isColliding = true;
            }
        }
    }
};


KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

KEY_STATUS = {};
for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}
document.onkeydown = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
}

document.onkeyup = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();