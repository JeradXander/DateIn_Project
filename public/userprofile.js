//variables to getcurrentid 
var urlString = window.location.href;
var currentUID = urlString.slice(34);

//card container
var cardContainer = document.getElementById('cardBox');

//fetching data from server side
fetch("/dbData")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById(
      "welcomeMessage"
    ).innerText = `Welcome ${data.firstName}!`;
    //setting html values to data passed from server user info
    document.getElementById("a_tag").href = `${data.imageURL}`;
    document.getElementById("profile_pic").src = `${data.imageURL}`;
    document.getElementById("profile_pic").href = `${data.imageURL}`;
    console.log(
      "This is the current user from the db data fetch " + data.currentUser
    );
  });

//fetch to get top 10 
fetch("/dbDataCandidates")
  .then((res) => res.json())
  .then((data) => {

    //canadated array
    var canArray = data.candidateArray

    //looping through each top 10 canadate and creating a card
    for (let index = 0; index < canArray.length; index++) {

      //creating card 
      let card = document.createElement('div');
      card.className = 'card';
      card.style = "height:30%; width:40%; margin:5px"

      //card body
      let cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      //getting image from canadate
      let img = document.createElement('img');
      img.src = canArray[index]["imageURL"];
      img.className = 'card-img-top';

      //card first name 
      let title = document.createElement('h3');
      title.innerText = canArray[index]["firstName"];
      title.className = 'card-title';

      //card last name
      let locationText = document.createElement('p');
      locationText.innerText = canArray[index]["lastName"];
      locationText.className = 'card-subtitle mb-2 text-muted';
      locationText.style = 'margin-top: 5px'

      //card age
      let descText = document.createElement('p');
      descText.innerText = "Age: " + canArray[index]["age"];
      descText.className = 'card-text';

      //view button div
      let buttonDiv = document.createElement('div');
      buttonDiv.style = "width: 100%; display: flex; justify-content: space-evenly";


      //view button
      let editButton = document.createElement('button');
      editButton.className = "btn btn-warning";
      editButton.innerText = 'View';
      editButton.setAttribute('btn_type', 'edit_btn');


      buttonDiv.appendChild(editButton);
      // buttonDiv.appendChild(deleteButton);

      //appending card with children
      cardBody.appendChild(img);
      cardBody.appendChild(title);
      cardBody.appendChild(locationText);
      cardBody.appendChild(descText);
      cardBody.appendChild(buttonDiv);

      //adding car to body
      card.appendChild(cardBody);

      //adding complete card to container
      cardContainer.appendChild(card);

      //card event listener
      card.addEventListener('click', e => {

        //calling function and sending user data
        handleCardButtonClick(e, canArray[index]);
      });
    }
  });

//setting resume container
var resumeContainer = document.getElementById('resumeCardBox');

//this function does basically the same as the small cards but creates a resume card with more info
function handleCardButtonClick(e, canSelected) {
  var elt = e.target;

  if (elt.getAttribute("btn_type") === 'delete_btn') {
    // elt.parentElement.parentElement.parentElement.remove();

  } else if (elt.getAttribute("btn_type") === 'edit_btn') {
    console.log("edit clicked")
    console.log(canSelected);


    //creating card
    let card = document.createElement('div');
    card.className = 'card';
    card.style = "height:90%; width:90%; margin:5px; "

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.style = "align-items: center; text-align: center; overflow-y: scroll;"

    let img = document.createElement('img');
    img.src = canSelected["imageURL"];
    img.className = 'card-img-top';
    img.style = "height: 60%; width: 80%; "

    let firstName = document.createElement('h2');
    firstName.innerText = canSelected["firstName"];
    firstName.className = 'card-title';

    let lastName = document.createElement('h3');
    lastName.innerText = canSelected["lastName"];
    lastName.className = 'card-subtitle mb-2 text-muted';
    lastName.style = 'margin-top: 5px'

    let age = document.createElement('h3');
    age.innerText = "Age: " + canSelected["age"];
    age.className = 'card-text';


    let email = document.createElement('a');
    email.href = `mailto:${canSelected["email"]}`;
    email.innerText = "Email Me\n\n";

    let linkedIn = document.createElement('a');
    linkedIn.href = canSelected["linkedIn"];
    linkedIn.innerText = "LinkedIn\n\n";


    let occupation = document.createElement('p');
    occupation.innerText = canSelected["occupation"];
    occupation.className = 'card-text';

    let aboutMe = document.createElement('p');
    aboutMe.innerText = canSelected["aboutMe"];
    aboutMe.className = 'card-text';

    let lookingFor = document.createElement('p');
    lookingFor.innerText = "Looking For: " + canSelected["lookingFor"];
    lookingFor.className = 'card-text';

    //appending resume 
    cardBody.appendChild(img);
    cardBody.appendChild(firstName);
    cardBody.appendChild(lastName);
    cardBody.appendChild(age);
    cardBody.appendChild(email);
    cardBody.appendChild(linkedIn);
    cardBody.appendChild(occupation);
    cardBody.appendChild(aboutMe);
    cardBody.appendChild(lookingFor);


    card.appendChild(cardBody);
    resumeContainer.innerHTML = "";
    resumeContainer.appendChild(card);

  }
}