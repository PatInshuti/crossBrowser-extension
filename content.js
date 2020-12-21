var addWebsiteAddress;
console.log('started');

document.addEventListener('DOMContentLoaded', function(){
  console.log('added');
  addWebsiteAddress = document.forms["addWebsiteAddress"];
  addWebsiteAddress.addEventListener('submit', addWebsite);
})