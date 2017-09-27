var templates = {

repo : Handlebars.compile( document.querySelector("template#repo").innerHTML ),
searchItem : Handlebars.compile( document.querySelector("template#searchItem").innerHTML )

}

const searches = {

  load(callback) {

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/api/searches'
    }).done(function(response) {

      if (callback) {
        callback(response);
      } else {

        console.error("searches.load was not provided a callback.")

      }

    });

  },
  add(data, callback) {

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/searches',
      data: {
        term: data.term,
        createdAt: new Date()
      },
      /*    contentType: "application/json; charset=utf-8",
          dataType: "json"*/
    }).done(function() {
      if (callback) {
        callback();
      }
    });

  }

}

function getRepos(username, callback) {

  var url = `https://api.github.com/users/${username}/repos`;

  $.ajax({
    type: 'GET',
    url: url
  }).done(function(response) {

    if (callback) {
      callback(response);
    } else {

      console.error("getRepos was not provided a callback.");

    }

  }).catch(function(error){

    if (error.status == 404){

      alert("User doesn't exist");

    }

  });

}

function loadRepos(selector, list){

var element = document.querySelector(selector);

var listHTML = [];

list.map((element, index) => {

listHTML.push(
templates.repo({
name: element.name,
url: element.html_url
})
);

});

element.innerHTML = listHTML.join("");

}

function loadSearches(selector, list){

var element = document.querySelector(selector);

var listHTML = [];

list.map((element, index) => {

listHTML.push(
templates.searchItem({
term: element.term,
time: element.createdAt
})
);

});

element.innerHTML = listHTML.join("");

}


function submitSearch(selector) {

  var searchValue = document.getElementById(selector).value;

  getRepos(searchValue, (repos) => {

    loadRepos("#repoList", repos);

    searches.add({
      term: searchValue
    });
    searches.load(
      function(searches) {

        loadSearches("#searchList", searches);

      });
  });



}

searches.load(
  (searches) => {
    loadSearches("#searchList", searches);
  });
