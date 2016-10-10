'use strict';

const getFormFields = require('../../lib/get-form-fields');

// jquery shorthand for $(document).ready
$(() => {
  const baseUrl = 'http://localhost:3000';

  // function name, by convention, suggests that this is a handler
  // this is an error handler to be passed as a callback
  const onError = (error) => {
    console.error(error);
  };

  // note that in an app, a lot more logic will live in these callbacks
  // for now, we are mostly console-logging to study behavior
  // this handler is for signup success
  const onSignUp = (response) => {
    // this is where your signUp-related logic would usually go
    console.log(response);
    console.log('Signed up');
  };

  // another handler, this time for signIn success
  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  /* signUpOrIn will do either a signUp or signIn,
  since the two requests differ only by the path.

  (and by the password confirmation, but for some reason that is OK)

  Arguments:
  -credentials: an object, possibly created by getFormFields, used for data
  -path: the part of the URL after the '/', which determines which auth action to take
  -onFulfilled: the passed-in success handler
  -onRejected: the passed-in error handler
  */
  const signUpOrIn = (credentials, path, onFulfilled, onRejected) => {
    // credentials = { credentials: credentials.credentials };

    // XMLHttpRequest is a constructor function; we are creating a new instance
    // of a request object and saving a reference to it.
    // Note that creating the request object does not send a request.
    // We have not given it a path, or data, or anything else.
    let xhr = new XMLHttpRequest();
    // the argument 'load', below, is the thing that happens after the ready
    // state change. We are telling the request to listen for a state change,
    // i.e. the server telling it that it has responded
    xhr.addEventListener('load', () => {
      // look at the status code, and if it is successful...
      // ...(i.e. between 200 and 299)...
      if (xhr.status >= 200 && xhr.status < 300) {
        // fire the handler we passed in for success, and pass it the data!
        // you may want to parse it, if it's JSON; you can do that here,
        // or in your handler - wherever it makes sense.
        onFulfilled(xhr.response);
      } else {
        // if the status code is NOT in the desired range, fire the handler for
        // failure, and pass it the entire request object.
        // We give it the entire request object so we can dispatch different
        // actions based on the status of the request object
        onRejected(xhr);
      }
    });
    // This looks like English.
    //
    // some error-handling happened above, but that was
    // specific to the case in which a request is successfully fired. Now we
    // have to handle errors for the case in which the request never even left
    // the station
    xhr.addEventListener('error', () => onRejected(xhr));

    // start the request!
    xhr.open('POST', baseUrl + path);

    xhr.setRequestHeader('Content-Type', 'application/json');

    // oh wait, don't forget to actually DO the request, and send the data
    xhr.send(JSON.stringify(credentials));
  };

  // Now that we have defined a general function, we are going to define
  // functions that pass static data to the general function.

  // This practice may be related to terms like "method dispatch", "delegation",
  // and "partial application".

  // We are creating good 'surface area' - two separate functions, but with the
  // main body of the function written once

  // calls signUpOrIn with the appropriate path for sign-in
  const signIn = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulfilled, onRejected);

  // calls signUpOrIn with the appropriate path for sign-up
  const signUp = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulfilled, onRejected);

    const submitHandler = function (event) {
      event.preventDefault();
      let data = getFormFields(event.target);

      const onSignUpSuccess = function (response) {
        // the original success handler we defined at the top of the file
        onSignUp(response);
        // but we don't just want to console.log the success, we also want to
        // trigger another event. Look ma, a callback chain!
        signIn(data, onSignIn, onError);
      };

      // note where we defined signUp above, and note the order of its paramters
      // see how the arguments we're passing here line up with credentials,
      // or success handler, and our failure handler
      signUp(data, onSignUpSuccess, onError);
    };

  // attach a handler to the `#sign-up` form
  $('#sign-up').on('submit', submitHandler);
});
