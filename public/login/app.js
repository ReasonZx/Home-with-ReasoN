/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

/**
 * @return {!Object} The FirebaseUI config.
 */


var res = null;


function getUiConfig() {
    return {
      'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccessWithAuthResult': function(authResult, redirectUrl) {

          if (authResult.user) {
            handleSignedInUser(authResult.user);
          }
          if (authResult.additionalUserInfo) {
            document.getElementById('is-new-user').textContent =
                authResult.additionalUserInfo.isNewUser ?
                'New User' : 'Existing User';
          }
          if(res[1] != null){
            console.log(res[1]);
            window.location.replace(decodeURIComponent(res[1]));
          }
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'redirect',
      'signInOptions': [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          clientId: '569340367330-96sstq7p4mdl2jlfoebpn334c1de3dj4.apps.googleusercontent.com'
        },
        {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes :[
            'public_profile',
            'email',
            'user_likes',
            'user_friends'
          ]
        },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // Whether the display name should be displayed in Sign Up page.
          requireDisplayName: true,
          signInMethod: getEmailSignInMethod()
        },
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            size: getRecaptchaMode()
          },
        },
      ],
      // Terms of service url. //TODO 
      'tosUrl': 'https://www.google.com/search?q=tos&oq=tos&aqs=chrome..69i57j0i457j46i199i291j0j46j0i395l2j46i395.2104j1j9&sourceid=chrome&ie=UTF-8',
      // Privacy policy url. //TODO
      'privacyPolicyUrl': 'https://www.google.com/search?sxsrf=ALeKk01WSkWm_Bnew0eD9DZ9KHnMVCwdow%3A1610829504448&ei=wE4DYJbmGvOAhbIP2p-MOA&q=privacy+policy&oq=priva&gs_lcp=CgZwc3ktYWIQARgAMgQIIxAnMgQIIxAnMgUIABCRAjICCAAyAggAMgIIADICCAAyAggAMgIIADICCC46BAgAEEc6CAgAEMkDEJECOggILhDHARCjAjoECAAQQzoICC4QxwEQrwE6BQgAEMkDUJv0AVjb_gFglYoCaAFwA3gAgAGLAYgBvwWSAQMwLjaYAQCgAQGqAQdnd3Mtd2l6yAEIwAEB&sclient=psy-ab',
      'credentialHelper': CLIENT_ID && CLIENT_ID != '569340367330-96sstq7p4mdl2jlfoebpn334c1de3dj4.apps.googleusercontent.com' ?
          firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
          firebaseui.auth.CredentialHelper.NONE
    };
  }
  
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // Disable auto-sign in.
  ui.disableAutoSignIn();
  
  /**
   * @return {string} The URL of the FirebaseUI standalone widget.
   */
  function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' + getEmailSignInMethod();
  }
  
  
  /**
   * Redirects to the FirebaseUI widget.
   */
  var signInWithRedirect = function() {
    window.location.assign(getWidgetUrl());
  };
  
  
  /**
   * Open a popup with the FirebaseUI widget.
   */
  var signInWithPopup = function() {
    window.open(getWidgetUrl(), 'Sign In', 'width=985,height=735');
  };
  
  
  /**
   * Displays the UI for a signed in user.
   * @param {!firebase.User} user
   */
  var handleSignedInUser = function(user) {
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phoneNumber;
    if (user.photoURL) {
      var photoURL = user.photoURL;
      // Append size to the photo URL for Google hosted images to avoid requesting
      // the image with its original resolution (using more bandwidth than needed)
      // when it is going to be presented in smaller size.
      if ((photoURL.indexOf('googleusercontent.com') != -1) ||
          (photoURL.indexOf('ggpht.com') != -1)) {
        photoURL = photoURL + '?sz=' +
            document.getElementById('photo').clientHeight;
      }
      document.getElementById('photo').src = photoURL;
      document.getElementById('photo').style.display = 'block';
    } else {
      document.getElementById('photo').style.display = 'none';
    }
  };
  
  
  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });
  
  /**
   * Deletes the user's account.
   */
  var deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  };
  
  /**
   * Initializes the app.
   */
  var initApp = function() {
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
    document.getElementById('delete-account').addEventListener(
        'click', function() {
          deleteAccount();
        });
    var CurrentPage = window.location.href;
    console.log("Current page is:", CurrentPage);

    res = CurrentPage.split("responseurl=");

    console.log("Response url:",res[1]);
  };


  window.addEventListener('load', initApp);
  