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
    this.uniforms.pshot2 = { type: '2f', value: {x: xval, y: yval} }

    this.uniforms.eshot0 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot1 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot2 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot3 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot4 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot5 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot6 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.eshot7 = { type: '2f', value: {x: xval, y: yval} }

    this.uniforms.fshot0 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot1 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot2 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot3 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot4 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot5 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot6 = { type: '2f', value: {x: xval, y: yval} }
    this.uniforms.fshot7 = { type: '2f', value: {x: xval, y: yval} }

    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",

        "uniform vec2 pshot0;",
        "uniform vec2 pshot1;",
        "uniform vec2 pshot2;",

        "uniform vec2 eshot0;",
        "uniform vec2 eshot1;",
        "uniform vec2 eshot2;",
        "uniform vec2 eshot3;",
        "uniform vec2 eshot4;",
        "uniform vec2 eshot5;",
        "uniform vec2 eshot6;",
        "uniform vec2 eshot7;",

        "uniform vec2 fshot0;",
        "uniform vec2 fshot1;",
        "uniform vec2 fshot2;",
        "uniform vec2 fshot3;",
        "uniform vec2 fshot4;",
        "uniform vec2 fshot5;",
        "uniform vec2 fshot6;",
        "uniform vec2 fshot7;",

        "uniform float     time;",
        "uniform float     alpha;",
        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",
        "const int ecount = 2;",
        "vec2 eshots[ecount];",
       "struct Light {",
            "vec2 pos;     // Light position",
            "float spread;    // Light spread",
            "float size;   // Light bulb size",
        "};",
        "Light lights[8];",

        "void main(void) {",
        /*
        "eshots[0] = eshot0;",
        "eshots[1] = eshot1;",
        "float radius = 1000.0;",
        "vec3 totalLighting = vec3(0.0, 0.0, 0.0);",
        "for(int i=1; i<ecount; i++) {",
        //"vec2 uPos = gl_FragCoord.xy / resolution.xy;",
            "vec2 lightPosition = eshots[i];",
            "float distance  = length( lightPosition - gl_FragCoord.xy );",
            "float maxDistance = pow( radius, 0.20);",
            "float quadDistance = pow( distance, 0.23);",
            "float quadIntensity = 1.0 - min( quadDistance, maxDistance )/maxDistance;",
            //"vec4 color = vec4(red, green, blue, alpha);",
            "totalLighting += quadDistance;",
        "}",
        //"gl_FragColor = uPos * quadIntensity;",
        //"vec4 color = vec4(red, green, blue, alpha);",
        "gl_FragColor = vec4(totalLighting, 1.0);",
        */
        "Light e0;",
        "e0.pos = eshot0;",
        "e0.spread = 100.0;",
        "e0.size = 70.0;",

        "Light e1;",
        "e1.pos = eshot1;",
        "e1.spread = 50.0;",
        "e1.size = 20.0;",

        "Light e2;",
        "e2.pos = eshot2;",
        "e2.spread = 100.0;",
        "e2.size = 70.0;",

        "Light e3;",
        "e3.pos = eshot3;",
        "e3.spread = 50.0;",
        "e3.size = 20.0;",

        "Light e4;",
        "e4.pos = eshot4;",
        "e4.spread = 100.0;",
        "e4.size = 70.0;",

        "Light e5;",
        "e5.pos = eshot5;",
        "e5.spread = 50.0;",
        "e5.size = 20.0;",

        "Light e6;",
        "e6.pos = eshot6;",
        "e6.spread = 100.0;",
        "e6.size = 70.0;",

        "Light e7;",
        "e7.pos = eshot7;",
        "e7.spread = 50.0;",
        "e7.size = 20.0;",

        "float intensity = 0.0;",
        "lights[0] = e0;",
        "lights[1] = e1;",
        "lights[2] = e2;",
        "lights[3] = e3;",
        "lights[4] = e4;",
        "lights[5] = e5;",
        "lights[6] = e6;",
        "lights[7] = e7;",

        "for(int i = 0; i < 8; i++){",

            "float x_dis = lights[i].pos.x - gl_FragCoord.x;",
            "float y_dis = lights[i].pos.y - gl_FragCoord.y;",
            "float distance = sqrt(pow(x_dis, 2.0) + pow(y_dis, 2.0));",
            "float sub_ints = 1.0 - distance / 50.0;",
            "if(sub_ints < 0.0)",
                "sub_ints = 0.0;",

            "intensity += sub_ints;}",

        "gl_FragColor = vec4(intensity, 0.0, 0.0, 1.0-intensity);",


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

Object.defineProperty(Phaser.Filter.Light.prototype, 'pshot2', {
    get: function() {
        return this.uniforms.pshot2.value;},
    set: function(value) {
        this.uniforms.pshot2.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot0', {
    get: function() {
        return this.uniforms.fshot0.value;},
    set: function(value) {
        this.uniforms.pshot0.value = value;}
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

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot4', {
    get: function() {
        return this.uniforms.fshot4.value;},
    set: function(value) {
        this.uniforms.fshot4.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot5', {
    get: function() {
        return this.uniforms.fshot5.value;},
    set: function(value) {
        this.uniforms.fshot5.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot6', {
    get: function() {
        return this.uniforms.fshot6.value;},
    set: function(value) {
        this.uniforms.fshot6.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'fshot7', {
    get: function() {
        return this.uniforms.fshot7.value;},
    set: function(value) {
        this.uniforms.fshot7.value = value;}
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

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot4', {
    get: function() {
        return this.uniforms.eshot4.value;},
    set: function(value) {
        this.uniforms.eshot4.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot5', {
    get: function() {
        return this.uniforms.eshot5.value;},
    set: function(value) {
        this.uniforms.eshot5.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot6', {
    get: function() {
        return this.uniforms.eshot6.value;},
    set: function(value) {
        this.uniforms.eshot6.value = value;}
});

Object.defineProperty(Phaser.Filter.Light.prototype, 'eshot7', {
    get: function() {
        return this.uniforms.eshot7.value;},
    set: function(value) {
        this.uniforms.eshot7.value = value;}
});

