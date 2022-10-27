const wrun = require('./wrun.min.js');

if (typeof wrun !== 'function') {
  throw 'wrun must export a function by default';
}

// ---------------------------------------------------------------

const $w1 = wrun(function(){});

if ($w1.worker) {
  throw 'A worker must not be created without a window object available on the scope';
}

if (!$w1.error) {
  throw 'An { error } must be returned when there is no window available on the scope';
}

if ($w1.error.code !== 1) {
  throw `When there is no window on the scope, the returned error must have { code: 1 }, given { code: ${$w1.error.code} }`;
}

// ---------------------------------------------------------------

global.window = {};

// ---------------------------------------------------------------

const $w2 = wrun(function(){});

if ($w2.error.code !== 2) {
  throw `Call wrun without Blob or URL in window must return an error { code: 2 }, given ${JSON.stringify($w2.error)}`;
}

// ---------------------------------------------------------------

window.Blob = class Blob {
  constructor() {
    return "Blob-Mock";
  }
}

window.URL = {
  createObjectURL() {
    return "URL-Mock" 
  }
};

const $w3 = wrun(function(){});

if ($w3.error.code !== 3) {
  throw `Trying to create a Worker type that is not in window must return error { code: 3 }, given ${JSON.stringify($w3.error)}`;
}

// ---------------------------------------------------------------

window.Blob = class Blob {
  constructor(content, btype) {
    if (!Array.isArray(content)) {
      throw 'Wrong blob content is being passed';
    }

    if (JSON.stringify(btype) !== '{"type":"application/javascript"}') {
      throw `The blob type must be: { type: 'application/javascript' }. Given: ${JSON.stringify(btype)}`;
    }

    if (content[0] !== '(function(){})()') {
      throw 'The blob function must create an IIFE that wraps the wrun argument function';
    }
  }

  check() {
    return "Blob-Mock";
  }
}

window.URL = {
  createObjectURL(obj) {
    if (!obj || !obj.check) {
      throw 'The blob payload is not being created to the createObjectURL function';
    }

    return obj.check() + " URL-Mock";
  }
};

window.Worker = class {
  constructor(content) {
    if (content !== 'Blob-Mock URL-Mock') {
      throw 'A Blob must be created and passed to a dynamic Object URL that will be used to create the Worker';
    }
  }
};

// ---------------------------------------------------------------

const $w4 = wrun(function(){});

if ($w4.error && $w4.error.code === 3) {
  throw `The default created worker must be type "Worker"`;
}

// ---------------------------------------------------------------

const $w5 = wrun(1);

if ($w5.error && $w5.error.code !== 4) {
  throw `The wrun must accept only functions as parameters`;
}

// ---------------------------------------------------------------

const fn = function() {};
fn.toString = null;
const $w6 = wrun(fn);

if ($w6.error && $w6.error.code !== 0) {
  throw `Deformed parameters or uncaught behavior must generate an error { code: 0 }`;
}

// ---------------------------------------------------------------

console.log(`
********************************
*                              * 
*    DONE, ALL TESTS PASSED!   *
*                              * 
********************************
`);