
(function (window) {
  'use strict';

  var Flake, Snowfall;

  Snowfall = function (max) {
    if (typeof max === "undefined") {
      max = 300;
    }

    if (!window.HTMLCanvasElement) {
      console.warn('Snowfall.js is aborting due to the browser not supporting <canvas>');
      return;
    }

    this.max    = max;
    this.flakes = [];

    this.createCanvas();
    this.generateFlakes();
    this.registerAnimation();
    this.bindDOMEvents();
  };

  Snowfall.prototype.createCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');

    this.canvas.setAttribute('style', 'position: absolute; top: 0; left: 0; z-index: 99999; pointer-events: none');
    document.body.appendChild(this.canvas);
  };

  Snowfall.prototype.bindDOMEvents = function () {
    var throttle, that;

    that = this;

    window.addEventListener('resize', function () {
      if (typeof throttle === "undefined") {
        throttle = window.setTimeout(function () {
          throttle = undefined;
          that.canvas.width  = window.innerWidth;
          that.canvas.height = window.innerHeight;
        }, 100);
      }
    }, false);
  };

  Snowfall.prototype.generateFlakes = function () {
    var i;

    for (i = 0; i < this.max; i += 1) {
      this.flakes.push(new Flake(Math.floor(Math.random() * this.canvas.width), Math.floor(Math.random() * this.canvas.height)));
    }
  };

  Snowfall.prototype.updateFlakes = function (delta) {
    var i, len;

    for (i = 0, len = this.flakes.length; i < len; i += 1) {
      this.flakes[i].move(delta);

      if (!this.flakes[i].isVisible(this.canvas.width, this.canvas.height)) {
        this.flakes[i].reset(Math.floor(Math.random() * this.canvas.width), 0);
      }
    }
  };

  Snowfall.prototype.drawFrame = function () {
    var i, len, flake;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#fff';

    for (i = 0, len = this.flakes.length; i < len; i += 1) {
      flake = this.flakes[i];

      this.context.fillRect(flake.x, flake.y, flake.size, flake.size);
    }
  };

  Snowfall.prototype.registerAnimation = function () {
    var last_run, frame, that;

    if (typeof window.requestAnimationFrame === "undefined") {
      var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

      if (typeof requestAnimationFrame === "undefined") {
        console.warn("Snowfall.js is falling back to 100ms animation intervals");

        requestAnimationFrame = function (callback) {
          return window.setTimeout(callback, 100);
        };
      }

      window.requestAnimationFrame = requestAnimationFrame;
    }

    that     = this;

    frame = function (now) {
      if (typeof last_run === 'undefined') {
        last_run = now;
      }

      that.updateFlakes(now - last_run);
      that.drawFrame();

      last_run = now;
      that.animation = window.requestAnimationFrame(frame);
    };

    this.animation = window.requestAnimationFrame(frame);
  };

  Snowfall.prototype.removeAnimation = function () {
    if (typeof this.animation === "undefined") {
      return;
    }

    window.cancelAnimationFrame(this.animation);
  };

  Flake = function (x, y) {
    this.reset(x, y);
  };

  Flake.prototype.setSpeed = function () {
    this.speed = Math.max(0.1, Math.random() * 0.5);
  };

  Flake.prototype.setSize = function () {
    this.size = Math.max(1, Math.floor(Math.random() * 4));
  };

  Flake.prototype.move = function (delta) {
    this.y += delta * this.speed;
  };

  Flake.prototype.isVisible = function (bx, by) {
    return (this.x > 0 && this.y > 0 && this.x < bx && this.y < by);
  };

  Flake.prototype.reset = function (x, y) {
    this.x = x;
    this.y = y;
    this.setSpeed();
    this.setSize();
  };

  window.Snowfall = new Snowfall(300);
} (window));