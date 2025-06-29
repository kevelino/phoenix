(function () {
  "use strict";
 
  let form = document.querySelector('#contact-form');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    let thisForm = this;

    let action = "/contact/ajax/"
    let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
    
    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    let formData = new FormData( thisForm );

    if ( recaptcha ) {
      if(typeof grecaptcha !== "undefined" ) {
        grecaptcha.ready(function() {
          try {
            grecaptcha.execute(recaptcha, {action: 'contact_form_submit'})
            .then(token => {
              formData.set('recaptcha-response', token);
              contact_form_submit(thisForm, action, formData);
            })
          } catch(error) {
            displayError(thisForm, error);
          }
        });
      } else {
        displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
      }
    } else {
      contact_form_submit(thisForm, action, formData);
    }
  });

  
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Match : "csrftoken=value"
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function contact_form_submit(thisForm, action, formData) {
    const csrfToken = getCookie('csrftoken');

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    fetch(action, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      
      body: JSON.stringify(formObject)
    })
    .then(response => {
      if( response.ok ) {
        return response.json();
      } else {
        throw new Error(`Error ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.success) {
        console.log(data);
        thisForm.querySelector('.sent-message').innerHTML == data.message;
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data.message || 'Form submission failed and no error message returned from.'); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }
 
  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
