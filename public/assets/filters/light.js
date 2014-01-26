/**
* Original shader from http://glsl.heroku.com/e#4122.10
* Tweaked, uniforms added and converted to Phaser/PIXI by Richard Davey
*/
Phaser.Filter.Light = function (game, xval, yval) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 }
    this.uniforms.red = { type: '1f', value: 1.0 }
    this.uniforms.green = { type: '1f', value: 1.0 }
    this.uniforms.blue = { type: '1f', value: 2.0 }
    this.uniforms.xpos = { type: '1f', value: xval }
    this.uniforms.ypos = { type: '1f', value: yval }
        
    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float xpos;",
        "uniform float ypos;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",
        "uniform float 	   radius;",

        "void main(void) {",
        "vec2 lightPosition = vec2(xpos, ypos);",
        "float radius = 1000.0;",
        "float distance  = length( lightPosition - gl_FragCoord.xy );",
        "float maxDistance = pow( radius, 0.20);",
        "float quadDistance = pow( distance, 0.23);",
        "float quadIntensity = 1.0 - min( quadDistance, maxDistance )/maxDistance;",
        "vec4 color = vec4(red, green, blue, alpha);",
        //"vec2 uPos = gl_FragCoord.xy / resolution.xy;",
        "gl_FragColor = color * vec4(quadIntensity, quadIntensity, quadIntensity, 1.0 - quadIntensity);",
        //"gl_FragColor = uPos * quadIntensity;",

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

Object.defineProperty(Phaser.Filter.Light.prototype, 'xpos', {

    get: function() {
        return this.uniforms.xpos.value;
    },

    set: function(value) {
        this.uniforms.xpos.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Light.prototype, 'ypos', {

    get: function() {
        return this.uniforms.ypos.value;
    },

    set: function(value) {
        this.uniforms.ypos.value = value;
    }

});
