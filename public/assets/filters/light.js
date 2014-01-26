/**
* Original shader from http://glsl.heroku.com/e#4122.10
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/

var fshots;

Phaser.Filter.Light = function (game, xval, yval) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 }
    this.uniforms.red = { type: '1f', value: 1.0 }
    this.uniforms.green = { type: '1f', value: 1.0 }
    this.uniforms.blue = { type: '1f', value: 2.0 }
    this.uniforms.pshot0 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.pshot1 = { type: '2f', value: {x: xval, y: yval} }

    this.uniforms.eshot0 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot1 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot2 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot3 = { type: '2f', value: {x: xval, y: yval} }

    this.uniforms.fshot0 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot1 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot2 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot3 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.diameter = { type: '1f', value: 100.0 };

    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",

        "uniform vec2 pshot0;",
        "uniform vec2 pshot1;",

        "uniform vec2 eshot0;",
        "uniform vec2 eshot1;",
        "uniform vec2 eshot2;",
        "uniform vec2 eshot3;",

        "uniform vec2 fshot0;",
        "uniform vec2 fshot1;",
        "uniform vec2 fshot2;",
        "uniform vec2 fshot3;",

        "uniform float     time;",
        "uniform float     alpha;",
        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",
        "uniform float     diameter;",

       "struct Light {",
            "vec2 pos;     // Light position",
            "float spread;    // Light spread",
            "float size;   // Light bulb size",
        "};",
        "Light lights[10];",

        "void main(void) {",

        "Light p0;",
        "p0.pos = pshot0;",

        "Light p1;",
        "p1.pos = pshot1;",

        "Light e0;",
        "e0.pos = eshot0;",

        "Light e1;",
        "e1.pos = eshot1;",

        "Light e2;",
        "e2.pos = eshot2;",

        "Light e3;",
        "e3.pos = eshot3;",

        "Light f0;",
        "f0.pos = fshot0;",

        "Light f1;",
        "f1.pos = fshot1;",

        "Light f2;",
        "f2.pos = fshot2;",

        "Light f3;",
        "f3.pos = fshot3;",


        "float intensity = 0.0;",
        "lights[0] = e0;",
        "lights[1] = e1;",
        "lights[2] = e2;",
        "lights[3] = e3;",
        "lights[4] = p0;",
        "lights[5] = p1;",
        "lights[6] = f0;",
        "lights[7] = f1;",
        "lights[8] = f2;",
        "lights[9] = f3;",

        "for(int i = 0; i < 10; i++){",

            "float x_dis = lights[i].pos.x - gl_FragCoord.x;",
            "float y_dis = lights[i].pos.y - gl_FragCoord.y;",
            "float distance = sqrt(pow(x_dis, 2.0) + pow(y_dis, 2.0));",
            "float sub_ints = 1.0 - distance / diameter;",
            "if(sub_ints < 0.0)",
                "sub_ints = 0.0;",

            "intensity += sub_ints;}",

        "gl_FragColor = vec4(0.2 * intensity, 0.2 * intensity, 0.4 * intensity, 1.0-intensity);",


        "}"
    ];  

};

Phaser.Filter.Light.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Light.prototype.constructor = Phaser.Filter.LightBeam;

Phaser.Filter.Light.prototype.init = function (width, height) {

    this.setResolution(width, height);

}

/*
Phaser.Filter.Light.prototype.update = function (xval, yval) {

    this.uniforms.xpos = { type: '1f', value: xval }
    this.uniforms.ypos = { type: '1f', value: yval }

}
*/

Object.defineProperty(Phaser.Filter.Light.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'diameter', {

    get: function() {
        return this.uniforms.diameter.value;
    },

    set: function(value) {
        this.uniforms.diameter.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'red', {

    get: function() {
        return this.uniforms.red.value;
    },

    set: function(value) {
        this.uniforms.red.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'green', {

    get: function() {
        return this.uniforms.green.value;
    },

    set: function(value) {
        this.uniforms.green.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'blue', {

    get: function() {
        return this.uniforms.blue.value;
    },

    set: function(value) {
        this.uniforms.blue.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'thickness', {

    get: function() {
        return this.uniforms.thickness.value;
    },

    set: function(value) {
        this.uniforms.thickness.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'speed', {

    get: function() {
        return this.uniforms.speed.value;
    },

    set: function(value) {
        this.uniforms.speed.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'pshot0', {
    get: function() {
        return this.uniforms.pshot0.value;},
    set: function(value) {
        this.uniforms.pshot0.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'pshot1', {
    get: function() {
        return this.uniforms.pshot1.value;},
    set: function(value) {
        this.uniforms.pshot1.value = value;}
});


Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot0', {
    get: function() {
        return this.uniforms.fshot0.value;},
    set: function(value) {
        this.uniforms.fshot0.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot1', {
    get: function() {
        return this.uniforms.fshot1.value;},
    set: function(value) {
        this.uniforms.fshot1.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot2', {
    get: function() {
        return this.uniforms.fshot2.value;},
    set: function(value) {
        this.uniforms.fshot2.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot3', {
    get: function() {
        return this.uniforms.fshot3.value;},
    set: function(value) {
        this.uniforms.fshot3.value = value;}
});


Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot0', {
    get: function() {
        return this.uniforms.eshot0.value;},
    set: function(value) {
        this.uniforms.eshot0.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot1', {
    get: function() {
        return this.uniforms.eshot1.value;},
    set: function(value) {
        this.uniforms.eshot1.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot2', {
    get: function() {
        return this.uniforms.eshot2.value;},
    set: function(value) {
        this.uniforms.eshot2.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot3', {
    get: function() {
        return this.uniforms.eshot3.value;},
    set: function(value) {
        this.uniforms.eshot3.value = value;}
});

