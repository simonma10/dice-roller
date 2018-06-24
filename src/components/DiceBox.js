import React, {Component} from 'react'

import * as CANNON from 'cannon'
import * as THREE from 'three'


class DiceBox extends Component {
  componentWillMount(){
    this.use_adapvite_timestep = true;
    this.animate_selector = true;

    this.dices = [];
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.renderer = window.WebGLRenderingContext
      ? new THREE.WebGLRenderer({ antialias: true })
      : new THREE.CanvasRenderer({ antialias: true });
    //container.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.renderer.setClearColor(0xffffff, 1);

    //this.reinit(container, dimentions);

    this.world.gravity.set(0, 0, -9.8 * 800);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 16;

    //const ambientLight = new THREE.AmbientLight(that.ambient_light_color);
    //this.scene.add(ambientLight);

    this.dice_body_material = new CANNON.Material();
    const desk_body_material = new CANNON.Material();
    const barrier_body_material = new CANNON.Material();
    //this.world.addContactMaterial(new CANNON.ContactMaterial(desk_body_material, this.dice_body_material, 0.01, 0.5));
    this.world.addContactMaterial(new CANNON.ContactMaterial(desk_body_material, this.dice_body_material, {friction: 0.01, restitution: 0.5}));
    this.world.addContactMaterial(new CANNON.ContactMaterial(barrier_body_material, this.dice_body_material, 0, 1.0));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.dice_body_material, this.dice_body_material, 0, 0.5));

    this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), desk_body_material));
    //let x = new CANNON.Body(mass, type, position, quaternion)
    let barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    barrier.position.set(0, this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    barrier.position.set(0, -this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    barrier.position.set(this.w * 0.93, 0, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    barrier.position.set(-this.w * 0.93, 0, 0);
    this.world.add(barrier);

    this.last_time = 0;
    this.running = false;

    this.renderer.render(this.scene, this.camera);


  }

  render() {
    return (
      <div>DiceBox</div>
    )
  }


  reinit(container, dimentions){
    this.cw = container.clientWidth / 2;
    this.ch = container.clientHeight / 2;
    if (dimentions) {
      this.w = dimentions.w;
      this.h = dimentions.h;
    }
    else {
      this.w = this.cw;
      this.h = this.ch;
    }
    this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
    //that.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

    this.renderer.setSize(this.cw * 2, this.ch * 2);

    this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);
    if (this.camera) this.scene.remove(this.camera);
    this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
    this.camera.position.z = this.wh;

    const mw = Math.max(this.w, this.h);
    if (this.light) this.scene.remove(this.light);
    //this.light = new THREE.SpotLight(that.spot_light_color, 2.0);
    this.light.position.set(-mw / 2, mw / 2, mw * 2);
    this.light.target.position.set(0, 0, 0);
    this.light.distance = mw * 5;
    this.light.castShadow = true;
    this.light.shadowCameraNear = mw / 10;
    this.light.shadowCameraFar = mw * 5;
    this.light.shadowCameraFov = 50;
    this.light.shadowBias = 0.001;
    this.light.shadowDarkness = 1.1;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.scene.add(this.light);

    if (this.desk) this.scene.remove(this.desk);
    //this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1), new THREE.MeshPhongMaterial({ color: that.desk_color }));
    //this.desk.receiveShadow = that.use_shadows;
    this.scene.add(this.desk);

    this.renderer.render(this.scene, this.camera);
  }

}

export default DiceBox;

/*

this.dice_box = function(container, dimentions) {




}

this.dice_box.prototype.reinit = function(container, dimentions) {

}

function make_random_vector(vector) {
  var random_angle = rnd() * Math.PI / 5 - Math.PI / 5 / 2;
  var vec = {
    x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
    y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
  };
  if (vec.x == 0) vec.x = 0.01;
  if (vec.y == 0) vec.y = 0.01;
  return vec;
}

this.dice_box.prototype.generate_vectors = function(notation, vector, boost) {
  var vectors = [];
  for (var i in notation.set) {
    var vec = make_random_vector(vector);
    var pos = {
      x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
      y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
      z: rnd() * 200 + 200
    };
    var projector = Math.abs(vec.x / vec.y);
    if (projector > 1.0) pos.y /= projector; else pos.x *= projector;
    var velvec = make_random_vector(vector);
    var velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
    var inertia = that.dice_inertia[notation.set[i]];
    var angle = {
      x: -(rnd() * vec.y * 5 + inertia * vec.y),
      y: rnd() * vec.x * 5 + inertia * vec.x,
      z: 0
    };
    var axis = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };
    vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
  }
  return vectors;
}

this.dice_box.prototype.create_dice = function(type, pos, velocity, angle, axis) {
  var dice = that['create_' + type]();
  dice.castShadow = true;
  dice.dice_type = type;
  dice.body = new CANNON.RigidBody(that.dice_mass[type],
    dice.geometry.cannon_shape, this.dice_body_material);
  dice.body.position.set(pos.x, pos.y, pos.z);
  dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
  dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
  dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
  dice.body.linearDamping = 0.1;
  dice.body.angularDamping = 0.1;
  this.scene.add(dice);
  this.dices.push(dice);
  this.world.add(dice.body);
}

this.dice_box.prototype.check_if_throw_finished = function() {
  var res = true;
  var e = 6;
  if (this.iteration < 10 / that.frame_rate) {
    for (var i = 0; i < this.dices.length; ++i) {
      var dice = this.dices[i];
      if (dice.dice_stopped === true) continue;
      var a = dice.body.angularVelocity, v = dice.body.velocity;
      if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
        Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
        if (dice.dice_stopped) {
          if (this.iteration - dice.dice_stopped > 3) {
            dice.dice_stopped = true;
            continue;
          }
        }
        else dice.dice_stopped = this.iteration;
        res = false;
      }
      else {
        dice.dice_stopped = undefined;
        res = false;
      }
    }
  }
  return res;
}

this.dice_box.prototype.emulate_throw = function() {
  while (!this.check_if_throw_finished()) {
    ++this.iteration;
    this.world.step(that.frame_rate);
  }
  return get_dice_values(this.dices);
}

this.dice_box.prototype.__animate = function(threadid) {
  var time = (new Date()).getTime();
  var time_diff = (time - this.last_time) / 1000;
  if (time_diff > 3) time_diff = that.frame_rate;
  ++this.iteration;
  if (this.use_adapvite_timestep) {
    while (time_diff > that.frame_rate * 1.1) {
      this.world.step(that.frame_rate);
      time_diff -= that.frame_rate;
    }
    this.world.step(time_diff);
  }
  else {
    this.world.step(that.frame_rate);
  }
  for (var i in this.scene.children) {
    var interact = this.scene.children[i];
    if (interact.body != undefined) {
      interact.position.copy(interact.body.position);
      interact.quaternion.copy(interact.body.quaternion);
    }
  }
  this.renderer.render(this.scene, this.camera);
  this.last_time = this.last_time ? time : (new Date()).getTime();
  if (this.running == threadid && this.check_if_throw_finished()) {
    this.running = false;
    if (this.callback) this.callback.call(this, get_dice_values(this.dices));
  }
  if (this.running == threadid) {
    (function(t, tid, uat) {
      if (!uat && time_diff < that.frame_rate) {
        setTimeout(function() { requestAnimationFrame(function() { t.__animate(tid); }); },
          (that.frame_rate - time_diff) * 1000);
      }
      else requestAnimationFrame(function() { t.__animate(tid); });
    })(this, threadid, this.use_adapvite_timestep);
  }
}

this.dice_box.prototype.clear = function() {
  this.running = false;
  var dice;
  while (dice = this.dices.pop()) {
    this.scene.remove(dice);
    if (dice.body) this.world.remove(dice.body);
  }
  if (this.pane) this.scene.remove(this.pane);
  this.renderer.render(this.scene, this.camera);
  var box = this;
  setTimeout(function() { box.renderer.render(box.scene, box.camera); }, 100);
}

this.dice_box.prototype.prepare_dices_for_roll = function(vectors) {
  this.clear();
  this.iteration = 0;
  for (var i in vectors) {
    this.create_dice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
      vectors[i].angle, vectors[i].axis);
  }
}

this.dice_box.prototype.roll = function(vectors, values, callback) {
  this.prepare_dices_for_roll(vectors);
  if (values != undefined && values.length) {
    this.use_adapvite_timestep = false;
    var res = this.emulate_throw();
    this.prepare_dices_for_roll(vectors);
    for (var i in res)
      shift_dice_faces(this.dices[i], values[i], res[i]);
  }
  this.callback = callback;
  this.running = (new Date()).getTime();
  this.last_time = 0;
  this.__animate(this.running);
}

this.dice_box.prototype.__selector_animate = function(threadid) {
  var time = (new Date()).getTime();
  var time_diff = (time - this.last_time) / 1000;
  if (time_diff > 3) time_diff = that.frame_rate;
  var angle_change = 0.3 * time_diff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
  if (angle_change < 0) this.running = false;
  for (var i in this.dices) {
    this.dices[i].rotation.y += angle_change;
    this.dices[i].rotation.x += angle_change / 4;
    this.dices[i].rotation.z += angle_change / 10;
  }
  this.last_time = time;
  this.renderer.render(this.scene, this.camera);
  if (this.running == threadid) {
    (function(t, tid) {
      requestAnimationFrame(function() { t.__selector_animate(tid); });
    })(this, threadid);
  }
}

this.dice_box.prototype.search_dice_by_mouse = function(ev) {
  var m = $t.get_mouse_coords(ev);
  var intersects = (new THREE.Raycaster(this.camera.position,
    (new THREE.Vector3((m.x - this.cw) / this.aspect,
      1 - (m.y - this.ch) / this.aspect, this.w / 9))
      .sub(this.camera.position).normalize())).intersectObjects(this.dices);
  if (intersects.length) return intersects[0].object.userData;
}

this.dice_box.prototype.draw_selector = function() {
  this.clear();
  var step = this.w / 4.5;
  this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 6, this.h * 6, 1, 1),
    new THREE.MeshPhongMaterial(that.selector_back_colors));
  this.pane.receiveShadow = true;
  this.pane.position.set(0, 0, 1);
  this.scene.add(this.pane);

  var mouse_captured = false;

  for (var i = 0, pos = -3; i < that.known_types.length; ++i, ++pos) {
    var dice = $t.dice['create_' + that.known_types[i]]();
    dice.position.set(pos * step, 0, step * 0.5);
    dice.castShadow = true;
    dice.userData = that.known_types[i];
    this.dices.push(dice); this.scene.add(dice);
  }

  this.running = (new Date()).getTime();
  this.last_time = 0;
  if (this.animate_selector) this.__selector_animate(this.running);
  else this.renderer.render(this.scene, this.camera);
}

this.dice_box.prototype.bind_mouse = function(container, notation_getter, before_roll, after_roll) {
  var box = this;
  $t.bind(container, ['mousedown', 'touchstart'], function(ev) {
    ev.preventDefault();
    box.mouse_time = (new Date()).getTime();
    box.mouse_start = $t.get_mouse_coords(ev);
  });
  $t.bind(container, ['mouseup', 'touchend'], function(ev) {
    if (box.rolling) return;
    if (box.mouse_start == undefined) return;
    ev.stopPropagation();
    var m = $t.get_mouse_coords(ev);
    var vector = { x: m.x - box.mouse_start.x, y: -(m.y - box.mouse_start.y) };
    box.mouse_start = undefined;
    var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
    var time_int = (new Date()).getTime() - box.mouse_time;
    if (time_int > 2000) time_int = 2000;
    var boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
    prepare_rnd(function() {
      throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
    });
  });
}

this.dice_box.prototype.bind_throw = function(button, notation_getter, before_roll, after_roll) {
  var box = this;
  $t.bind(button, ['mouseup', 'touchend'], function(ev) {
    ev.stopPropagation();
    box.start_throw(notation_getter, before_roll, after_roll);
  });
}

this.dice_box.prototype.start_throw = function(notation_getter, before_roll, after_roll) {
  var box = this;
  if (box.rolling) return;
  prepare_rnd(function() {
    var vector = { x: (rnd() * 2 - 1) * box.w, y: -(rnd() * 2 - 1) * box.h };
    var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    var boost = (rnd() + 3) * dist;
    throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
  });
}*/
