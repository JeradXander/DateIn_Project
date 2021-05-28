var urlString = window.location.href;
var currentUID = urlString.slice(34);
// document.getElementById("a_tag").innerHTML = currentUID;
fetch("/dbData")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById(
      "welcomeMessage"
    ).innerText = `Welcome ${data.firstName}!`;
    document.getElementById("a_tag").href = `${data.imageURL}`;
    document.getElementById("profile_pic").src = `${data.imageURL}`;
    document.getElementById("profile_pic").href = `${data.imageURL}`;
    console.log(
      "This is the current user from the db data fetch " + data.currentUser
    );
  });

fetch("/dbDataCandidates")
  .then((res) => res.json())
  .then((data) => {
    for (let index = 0; index < data.candidateArray.length; index++) {
      //const element = data[index];
      console.log(data.candidateArray[index]);
    }
  });

// console.log(data.email);
// console.log(data.password);
// console.log(data.firstName);
// console.log(data.lastName);
// console.log(data.identity);
// console.log(data.lookingFor);
// console.log(data.contactNumber);
// console.log(data.linkedIn);
// console.log(data.age);
// console.log(data.occupation);
// console.log(data.aboutMe);
// console.log(data.appsRecieved);
// console.log(data.candidatesAccepted);
// console.log(data.imageURL);

// console.log(
//   "This is the current user from the db data fetch []" + data["currentUser"]
// );
// console.log(
//   "This is the current user from the db data fetch using 0" +
//     data[0]["currentUser"]
// );

// for (let index = 0; index < data.length; index++) {
//   const element = data[index];
//   console.log(data[index]);
// }
