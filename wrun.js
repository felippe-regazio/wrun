function wrun(fn, wtype = 'Worker') {
  var result = (worker, error) => ({ worker, error });  

  if (typeof window === 'undefined') {
    return result(null, {
      code: 1,
      message: 'The current scope has no "window" object available.' 
    });
  }

  if (!hasOwnProperty.call(window, 'Blob') || !hasOwnProperty.call(window, 'URL')) {
    return result(null, {
      code: 2, 
      message: 'The current application is not compatible with "wrun".' 
    });
  }

  if (!hasOwnProperty.call(window, wtype)) {
    return result(null, { 
      code: 3, 
      message: `The worker type "${wtype}" does not exists on the current scope`
    });
  }

  if (typeof fn !== 'function') {
    return result(null, { 
      code: 4, 
      message: `The wrun argument must be a function`
    });    
  }  

  try {
    var blob = new window.Blob([ `(${fn.toString()})()` ], { type: 'application/javascript' });
    var swObjectURL = window.URL.createObjectURL(blob);
    var worker = new window[wtype](swObjectURL);

    return result(worker, false);
  } catch(error) {
    return result(null, { code: 0, error: error.message });
  }
}

if (typeof module !== 'undefined') {
  module.exports = wrun;
}