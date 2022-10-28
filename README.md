# wrun

Dynamically run a function inside a Web Worker on the client side, without the needing of a dedicated file. This means that you can execute a JS function as a subprocess, avoiding the slow down, break or freeze of the main thread. This lib is also minimal: 811 bytes.

## Reason

To create a Web Worker you commonly need a new `.js` file and a URL that points to this file, then you load this file as a worker: `const worker = new Worker('http://site.com/your-file.js');`. 

With `wrun` you can dinamically run a function inside a dinamic `Worker` directly from the current runtime, without the needing of a thirty part file: `wrun(function() {});`. This is way easier to handle dinamic subprocess.

## Getting started

Download, or install `wrun`:

```sh
npm install wrun
```

Then import, require or directly add it:

CommonJS

```js
const wrun = require('wrun');
```

ES6 Modules

```js
import wrun from 'wrun';
```

Browser

```html
<script src="/path/wrun.js" type="application/javascript"></script>
``` 

## Usage

To run a function inside a new Worker, just do:

```js
const { worker, error } = wrun(function() {
  /** Your code **/
});
```

On the code above, the const `worker` will be your created Worker that will be running your function, and `error` will be `false` or - in case of error - an object `{ code: number, message: string }`. A variation of this code would be:

```js
function myFunction() {
  /** Your code **/
}

const $w = wrun(myFunction);
```

In the case above, the variable `$w` will be an object containing `{ worker, error }` and you can access your worker on the property `$w.worker` and the error on the property `$w.error`. 

## Handling the Worker

The `wrun` always return an object:

```js
{
  worker: WebWorker | null,
  error: boolean | { code: number, message: string }
}
```

You must use the `worker` property returned by the `wrun` to manage your Worker:

```js
/** Create a worker **/
const { worker, error } = wrun(function() {
  self.addEventListener('message', console.log);
});

/** Send a message to our worker **/
worker.postMessage('Hello!');
```

The Worker will listen to the message and print the `MessageEvent` on the console. Your function can also access any Object or API restricted to Workers, as `self` and `caches` for example. You must also keep in mind that your function must communicate to your runtime using `Worker Messages` and vice versa, exactly as a normal `Worker`.

## Handling Errors

When something goes wrong, `wrun` will return an object with an `error` property, this property haves the following structure:

```js
{ code: number, message: string }
```

For example:

```js
/** Try to create a worker with an invalid parameter **/
const { worker, error } = wrun(1);

if (error) {
  console.log('Error code: ', error.code, '. Message: ', error.message);
}
```

Since `1` is not a function, `wrun` will return a null worker, and a `error` property with `{code: 4, message: 'The wrun argument must be a function'}`. The console.log above will output:

```
Error code: 4. Message: The wrun argument must be a function
```

The `wrun` can return different kind of errors, but always using this pattern.

## Use cases

The use cases are the same of any Web Worker. Since Workers run on their own thread, they wont harm the main thread performance. That is good for highly intensive processing tasks, to load scripts on background, parallelize subtasks without compromise the runtime, etc. You can also use it to have access to Worker-Only APIs like caches of global fetch events, for example.

# Example