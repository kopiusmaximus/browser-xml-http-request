'use strict';

const getFormFields = require('../../lib/get-form-fields');

$(() => {
  // // console methods require `this` to be `console`
  // // promise function are called with `this === undefined`
  // let clog = console.log.bind(console);
  // let elog = console.error.bind(console);

  const baseUrl = 'http://localhost:3000';

  const onError = (error) => {
    console.error(error);
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

  // note the lack of brace on the following line, so the new Promise is
  // implicitly returned
  const signUpOrIn = (credentials, path) =>
    new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // instead of attaching handlers, we use resolve and reject here
          // the Promise will handle the callback chain
          // resolve replaces our success handler
          resolve(xhr.response);
        } else {
          // reject replaces our error handler
          // usually we would want to handle errors first; however, there are
          // only a few ways we can get errors, and we're already handling one
          // with the next event listener.
          reject(xhr);
        }
      });
      xhr.addEventListener('error', () => reject(xhr));
      xhr.open('POST', baseUrl + path);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(credentials));
    });

  // Look at how much the Promise has allowed us
  // to clean up these next two function definitions!

  const signIn = (credentials) => signUpOrIn(credentials, '/sign-in');

  const signUp = (credentials) => signUpOrIn(credentials, '/sign-up');

  const submitHandler = function (event) {
    event.preventDefault;

    let data = getFormFields(event.target);

    signUp(formData)
    .then(onSignUp)
    .then(() => signIn(data)) // LOOK here - the `() =>` makes it a function
                              // definition instead of an invocation
    .then(onSignIn)
    .catch(onError);
  };

  $('#sign-up-promise').on('submit', submitHandler);
});
