// Initialize Firebase
var config = {
  apiKey: "AIzaSyCxJpuLHxiaeRQT0upbG7l7pde7qmF8z4c",
  authDomain: "phonegap-and-firebase-test.firebaseapp.com",
  databaseURL: "https://phonegap-and-firebase-test.firebaseio.com",
  projectId: "phonegap-and-firebase-test",
  storageBucket: "phonegap-and-firebase-test.appspot.com",
  messagingSenderId: "359250237994"
};
firebase.initializeApp(config);

// Get refs for database and storage bucket
var database = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();

function storeData(){
  var key = document.getElementById('key').value;
  var val = document.getElementById('value').value;
  database.ref(key).set({theVal : val}).then(function(){
    console.log("stored the data!");
  });
}

function loadData(){
  var key = document.getElementById('loadKey').value;
  database.ref(key).once('value').then(function(snapshot){
    var json = snapshot.val();
    var toBeDisplayed = "";
    if (json != null){
      toBeDisplayed = json.theVal;
    } else {
      toBeDisplayed = "Sorry, couldn't find that key :(";
    }
    document.getElementById('loadValue').innerHTML = toBeDisplayed;
  });
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var file = evt.target.files[0];
  var metadata = {
    'contentType': file.type
  };
  // how to get the filename, if you need it
  //var filename = file.name;
  var user = document.getElementById('username').value;
  // Push to child path.
  storageRef.child('images/' + user).put(file, metadata).then(function(snapshot) {
    var url = snapshot.downloadURL;
    console.log('File available at', url);
  }).catch(function(error) {
    console.error('Upload failed:', error);
  });
}

// NOTE: this will not work unless you configure CORS stuff
// need to download gsutil and make json file allowing cross domain access
// See instructions at https://firebase.google.com/docs/storage/web/download-files
function downloadFile(){
  var user = document.getElementById('loadUsername').value;
  storageRef.child('images/' + user).getDownloadURL().then(function(url) {
  // `url` is the download URL for 'images/cat.jpg'

  // This can be downloaded directly:
  /*var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();*/

  // Or inserted into an <img> element:
  var img = document.getElementById('myimg');
  img.src = url;
}).catch(function(error) {
  // Handle any errors
});
}

// Register event listener to file selector
window.onload = function() {
  document.getElementById('file').addEventListener('change', handleFileSelect, false);
}
