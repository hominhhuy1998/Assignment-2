/*
 CP1406/CP2010 JavaScript demonstrations using forms
 Lindsay Ward, 2007-2015, IT @ JCU
 Some code is not very meaningful (i.e. you would not want to do this from a usability point of view!),
 but you can see some interesting examples and capabilities...
 Note that much of this is more "hard-coded" than it should be. It's not "unobtrusive" JavaScript - too much JS in the HTML file, tightly-coupled.
 */

// check required fields have been set, return true/false depending on these
function checkForm() {
    var d = document.getElementById('mainForm'); // just a shortcut
    var errors = false;
    var errorMsg = "";
// basic check required fields
    if (d.name.value == "") {
        errorMsg += "Please enter your name.\n";
        errors = true;
    }
    // check if one of the radio buttons for site rating is selected
    var checkedSiteRating = false;
    for (var i = 0; i < 3; i++) {
        if (d.siterating[i].checked)
            checkedSiteRating = true;
    }
    if (!checkedSiteRating) {
        errorMsg += "Please select a site rating.\n";
        errors = true;
    }
    // if errors exist, popup error message
    if (errors)
        alert(errorMsg);
    // return true (submit form) or false (don't submit form) depending on errors
    return !errors;
}

// function for resetting the form (need to change the ticks and things back)
function resetForm() {
    var resetChoice = confirm('Reset all fields?');
    if (resetChoice) {
        console.log("Resetting form modifications.");
        // note: could do this with an array of required fields
        document.mainForm.nameTick.src = "cross.png";
        document.mainForm.nameTick.alt = "cross";
        document.mainForm.rateTick.src = 'cross.png';
        document.mainForm.rateTick.alt = 'cross';
        document.mainForm.areas.style.background = "#fff";
    }
    return resetChoice;
}


// these style-changing functions are called by the events in the input element (e.g. onFocus)
// you can change any CSS style like this
function changeStyle(element) {
    // element is the HTML element that was passed in as "this" when the function was called
    element.style.color = "#FF0000";
}

// in this example function, there are two parameters,
// the element to change and the color (a string) to change it to
function changeColor(element, color) {
    element.style.color = color;
}

// a more useful CSS changing - set field (e.g. phone number) colour to red if it's too short, green if length is OK
function setColourBasedOnLength(name, minValue) {
    var f = document.getElementById(name); // just a shortcut
    if (f.value.length >= minValue)
        f.style.color = "#0C0";
    else
        f.style.color = "#C00";

    // now just for fun - really, this is a bit stupid :)
    // set the size of the text box to the number of characters in the value
    f.size = f.value.length + 1;
    f.style.width = "auto";
}

// when name is entered, set tick image, say "hi" by writing to the page using innerHTML
// innerHTML can be useful for debugging messages, since it doesn't make a modal window like alert() does.

// this checks if one of the area check boxes is selected or not
// and updates the fieldset's background colour accordingly
function checkArea() {
    var areaBoxes = document.mainForm.areaVisited;
    var checked = false;
    for (var i = 0; i < areaBoxes.length; i++) {
        if (areaBoxes[i].checked)
            checked = true;
    }
    if (checked)
        document.mainForm.areas.style.background = "#ffd";
    else
        document.mainForm.areas.style.background = "#ffe";
}

// depending on first checkbox, either clear or set all check boxes
function clearArea() {
    var areaBoxes = document.mainForm.areaVisited;
    var changeTo = true;
    if (areaBoxes[0].checked)
        changeTo = false;
    for (var i = 0; i < areaBoxes.length; i++) {
        areaBoxes[i].checked = changeTo;
    }
    // call checkArea because the check boxes have changed - update the fieldset colour
    checkArea()
}

// set tick image if site rating is selected (no need to check since they can't click to deselect (see later)
function checkSiteRating() {
    document.mainForm.rateTick.src = 'tick.png';
    document.mainForm.rateTick.alt = 'tick';
}

// clear all radio buttons for rating, set cross image
function clearRating() {
    var ratingButtons = document.mainForm.siterating;
    for (var i = 0; i < ratingButtons.length; i++) {
        ratingButtons[i].checked = false;
    }
    document.mainForm.rateTick.src = 'cross.png';
    document.mainForm.rateTick.alt = 'cross';
}

// count characters in textarea and update limit on page
// if more characters than limit (parameter passed in), set value to the first limit-many characters
function updateCharacters(limit) {
    var textArea = document.mainForm.comments;
    if (textArea.value.length > limit)
        textArea.value = textArea.value.substring(0, limit);
    remaining = limit - textArea.value.length;
    document.getElementById('characters').innerHTML = "(" + remaining + " characters remaining)";
    // debugging example - write content length to the message span at the bottom:
    // document.getElementById('message').innerHTML = textArea.value.length;
}


// XMLHTTPRequest (AJAX)

// simple example, just gets contents of a resource at a given URL
// Note that we can't just get data from a different domain for security reasons
function loadXHR() {
    var xhr;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate  (4 = DONE)
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("XHRoutput").innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", "data.txt", true);
    xhr.send();
}

// An XMLHTTPRequest example that uses the value in the form field
function loadState() {
    var state = document.getElementById("state").value;
    var xhr;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate  (4 = DONE)
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("stateOutput").innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", "states.php?state="+state, true);
    xhr.send();
}

// Attach event handler to state button
document.getElementById("setStateButton").addEventListener("click", loadState);
function nameEntered(name) {

    if (name.value != "") {
        document.mainForm.nameTick.src = "tick.png";
        document.mainForm.nameTick.alt = "tick";
    }
    else {
        document.mainForm.nameTick.src = "cross.png";
        document.mainForm.nameTick.alt = "cross";
    }
}

/*
 CP1406/CP2010 JavaScript demonstrations using forms
 Lindsay Ward, 2007-2015, IT @ JCU
 Some code is not very meaningful (i.e. you would not want to do this from a usability point of view!),
 but you can see some interesting examples and capabilities...
 Note that much of this is more "hard-coded" than it should be. It's not "unobtrusive" JavaScript - too much JS in the HTML file, tightly-coupled.
 */

// check required fields have been set, return true/false depending on these
function checkForm() {
    var d = document.getElementById('mainForm'); // just a shortcut
    var errors = false;
    var errorMsg = "";
// basic check required fields
    if (d.name.value == "") {
        errorMsg += "Please enter your name.\n";
        errors = true;
    }
    // check if one of the radio buttons for site rating is selected
    var checkedSiteRating = false;
    for (var i = 0; i < 3; i++) {
        if (d.siterating[i].checked)
            checkedSiteRating = true;
    }
    if (!checkedSiteRating) {
        errorMsg += "Please select a site rating.\n";
        errors = true;
    }
    // if errors exist, popup error message
    if (errors)
        alert(errorMsg);
    // return true (submit form) or false (don't submit form) depending on errors
    return !errors;
}

// function for resetting the form (need to change the ticks and things back)
function resetForm() {
    var resetChoice = confirm('Reset all fields?');
    if (resetChoice) {
        console.log("Resetting form modifications.");
        // note: could do this with an array of required fields
        document.mainForm.nameTick.src = "cross.png";
        document.mainForm.nameTick.alt = "cross";
        document.mainForm.rateTick.src = 'cross.png';
        document.mainForm.rateTick.alt = 'cross';
        document.mainForm.areas.style.background = "#fff";
    }
    return resetChoice;
}


// these style-changing functions are called by the events in the input element (e.g. onFocus)
// you can change any CSS style like this
function changeStyle(element) {
    // element is the HTML element that was passed in as "this" when the function was called
    element.style.color = "#FF0000";
}

// in this example function, there are two parameters,
// the element to change and the color (a string) to change it to
function changeColor(element, color) {
    element.style.color = color;
}

// a more useful CSS changing - set field (e.g. phone number) colour to red if it's too short, green if length is OK
function setColourBasedOnLength(name, minValue) {
    var f = document.getElementById(name); // just a shortcut
    if (f.value.length >= minValue)
        f.style.color = "#0C0";
    else
        f.style.color = "#C00";

    // now just for fun - really, this is a bit stupid :)
    // set the size of the text box to the number of characters in the value
    f.size = f.value.length + 1;
    f.style.width = "auto";
}

// when name is entered, set tick image, say "hi" by writing to the page using innerHTML
// innerHTML can be useful for debugging messages, since it doesn't make a modal window like alert() does.

// this checks if one of the area check boxes is selected or not
// and updates the fieldset's background colour accordingly
function checkArea() {
    var areaBoxes = document.mainForm.areaVisited;
    var checked = false;
    for (var i = 0; i < areaBoxes.length; i++) {
        if (areaBoxes[i].checked)
            checked = true;
    }
    if (checked)
        document.mainForm.areas.style.background = "#ffd";
    else
        document.mainForm.areas.style.background = "#ffe";
}

// depending on first checkbox, either clear or set all check boxes
function clearArea() {
    var areaBoxes = document.mainForm.areaVisited;
    var changeTo = true;
    if (areaBoxes[0].checked)
        changeTo = false;
    for (var i = 0; i < areaBoxes.length; i++) {
        areaBoxes[i].checked = changeTo;
    }
    // call checkArea because the check boxes have changed - update the fieldset colour
    checkArea()
}

// set tick image if site rating is selected (no need to check since they can't click to deselect (see later)
function checkSiteRating() {
    document.mainForm.rateTick.src = 'tick.png';
    document.mainForm.rateTick.alt = 'tick';
}

// clear all radio buttons for rating, set cross image
function clearRating() {
    var ratingButtons = document.mainForm.siterating;
    for (var i = 0; i < ratingButtons.length; i++) {
        ratingButtons[i].checked = false;
    }
    document.mainForm.rateTick.src = 'cross.png';
    document.mainForm.rateTick.alt = 'cross';
}

// count characters in textarea and update limit on page
// if more characters than limit (parameter passed in), set value to the first limit-many characters
function updateCharacters(limit) {
    var textArea = document.mainForm.comments;
    if (textArea.value.length > limit)
        textArea.value = textArea.value.substring(0, limit);
    remaining = limit - textArea.value.length;
    document.getElementById('characters').innerHTML = "(" + remaining + " characters remaining)";
    // debugging example - write content length to the message span at the bottom:
    // document.getElementById('message').innerHTML = textArea.value.length;
}


// XMLHTTPRequest (AJAX)

// simple example, just gets contents of a resource at a given URL
// Note that we can't just get data from a different domain for security reasons
function loadXHR() {
    var xhr;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate  (4 = DONE)
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("XHRoutput").innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", "data.txt", true);
    xhr.send();
}

// An XMLHTTPRequest example that uses the value in the form field
function loadState() {
    var state = document.getElementById("state").value;
    var xhr;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate  (4 = DONE)
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("stateOutput").innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", "states.php?state="+state, true);
    xhr.send();
}

// Attach event handler to state button
document.getElementById("setStateButton").addEventListener("click", loadState);
function nameEntered(name) {

    if (name.value != "") {
        document.mainForm.nameTick.src = "tick.png";
        document.mainForm.nameTick.alt = "tick";
    }
    else {
        document.mainForm.nameTick.src = "cross.png";
        document.mainForm.nameTick.alt = "cross";
    }
}
// JavaScript Documentfunction checkfishtankSelect() {
	function checkfishbankSelect() {
switch(document.getElementById("fishtankSelect").value)
	{
		case "Great Choice® Drum Fish Bowl":
        	document.getElementById("fishtankPrice").innerHTML = 4.99;
			document.getElementById("fishtankImage").src="fish tank/ima.png";
			document.getElementById("fishtankLink").href ="fishtank.html";
			document.getElementById("fishtankLink").title = "Great Choice® Drum Fish Bowl";
        	break;
    	case "Top Fin® 3.5 Gallon Enchant Aquarium":
        	document.getElementById("fishtankPrice").innerHTML = 19.9;
			document.getElementById("fishtankImage").src ="fish tank/ima1.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Top Fin® 3.5 Gallon Enchant Aquarium";			
        	break;
    	case "Top Fin® Aquarium Starter Kit":
        	document.getElementById("fishtankPrice").innerHTML = 139.9;
			document.getElementById("fishtankImage").src = "fish tank/ima2.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Top Fin® Aquarium Starter Kit";
         	break;
    	case "Top Fin® Aquarium Starter Kit":
        	document.getElementById("fishtankPrice").innerHTML = 224.99;
			document.getElementById("fishtankImage").src = "fish tank/ima3.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Top Fin® Aquarium Starter Kit";
        	break;
    	case "Marineland® 60 Gallon Heartland LED Aquarium with Stand":
        	document.getElementById("fishtankPrice").innerHTML = 369.9;
			document.getElementById("fishtankImage").src = "fish tank/ima4.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Marineland® 60 Gallon Heartland LED Aquarium with Stand";
        	break;
    	case "Clear-For-Life 300 Gallon Rectangle Aquarium":
        	document.getElementById("fishtankPrice").innerHTML = 3519.9;
			document.getElementById("fishtankImage").src = "fish tank/ima5.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Clear-For-Life 300 Gallon Rectangle Aquarium";
        	break;
			case "Clear-For-Life 180 Gallon Rectangle Aquarium":
        	document.getElementById("fishtankPrice").innerHTML = 2039.9;
			document.getElementById("fishtankImage").src = "fish tank/ima6.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Clear-For-Life 180 Gallon Rectangle Aquarium";
        	break;
			case "Clear-For-Life 100 Gallon Pentagon UniQuarium":
        	document.getElementById("fishtankPrice").innerHTML = 1699.9;
			document.getElementById("fishtankImage").src = "fish tank/ima7.png";
			document.getElementById("fishtankLink").href = "fishtank.html";
			document.getElementById("fishtankLink").title = "Clear-For-Life 100 Gallon Pentagon UniQuarium";
        	break;    	
	}
	}


   function checkfreshfishSelect() {
	switch(document.getElementById("freshfishSelect").value)
	{
		case "Bronze corydoras":
        	document.getElementById("freshfishPrice").innerHTML = 0.5;
			document.getElementById("freshfishImage").src = "our fish/165px-Corydoras_aeneus_2.jpg";
			document.getElementById("freshfishLink").href = "fresh_water_fish.html";
			document.getElementById("freshfishLink").title = "Bronze corydoras";
        	break;
    	case "Gray bichir, Senegal bichir, or dinosaur bichir":
        	document.getElementById("freshfishPrice").innerHTML = 0.5;
			document.getElementById("freshfishImage").src = "our fish/165px-Polypterus_senegalus_senegalus_headstand.jpg";
			document.getElementById("freshfishLink").href = "fresh_water_fish.html";
			document.getElementById("freshfishLink").title = "Gray bichir, Senegal bichir, or dinosaur bichir";
        	break;
    	case "Salmon-red rainbowfish":
        	document.getElementById("freshfishPrice").innerHTML = 0.5;
			document.getElementById("freshfishImage").src = "our fish/165px-GlossolepisIncisus.jpg";
			document.getElementById("freshfishLink").href = "fresh_water_fish.html";
			document.getElementById("freshfishLink").title = "Salmon-red rainbowfish";
         	break;
    	case "Black phantom tetra":
        	document.getElementById("freshfishPrice").innerHTML = 0.5;
			document.getElementById("freshfishImage").src = "our fish/Black_phantom_tetra_(Hyphessobrycon_megalopterus).jpg";
			document.getElementById("freshfishLink").href = "fresh_water_fish.html";
			document.getElementById("freshfishLink").title = "Black phantom tetra";
        	break;
    	case "Black tetra, Skirt tetra":
        	document.getElementById("freshfishPrice").innerHTML = 0.5;
			document.getElementById("freshfishImage").src = "our fish/165px-BlackTetras.jpg";
			document.getElementById("freshfishLink").href = "fresh_water_fish.html";
			document.getElementById("freshfishLink").title = "Black tetra, Skirt tetra";
        	break;
    	
	}
    }
	 function checkfishfoodSelect() {
	switch(document.getElementById("fishfoodSelect").value)
	{
		case "Aqueon® Betta Pellets Fish Food":
        	document.getElementById("fishfoodPrice").innerHTML = 3.29;
			document.getElementById("fishfoodImage").src = "fish food/ima6.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Aqueon® Betta Pellets Fish Food";
        	break;
		case "Top Fin® Aquarium Starter Kit 1":
        	document.getElementById("fishfoodPrice").innerHTML = 12.79;
			document.getElementById("fishfoodImage").src = "fish food/ima1.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Top Fin® Aquarium Starter Kit";
        	break;
		case "Top Fin® Aquarium Starter Kit 2":
        	document.getElementById("fishfoodPrice").innerHTML = 16.99;
			document.getElementById("fishfoodImage").src = "fish food/ima2.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Top Fin® Aquarium Starter Kit";
        	break;
		case "Aqueon® Cichlid Pellets Fish Food 1":
        	document.getElementById("fishfoodPrice").innerHTML =18.49;
			document.getElementById("fishfoodImage").src = "fish food/ima3.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Aqueon® Cichlid Pellets Fish Food";
        	break;
		case "Aqueon® Cichlid Pellets Fish Food 2":
        	document.getElementById("fishfoodPrice").innerHTML = 18.99;
			document.getElementById("fishfoodImage").src = "fish food/ima5.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Aqueon® Cichlid Pellets Fish Food";
        	break;
		case "Aqueon® Cichlid Pellets Fish Food 3":
        	document.getElementById("fishfoodPrice").innerHTML = 69.99;
			document.getElementById("fishfoodImage").src = "fish food/ima4.png";
			document.getElementById("fishfoodLink").href = "fishfood.html";
			document.getElementById("fishfoodLink").title = "Aqueon® Cichlid Pellets Fish Food";
        	break;
	}
	 }
	  function checksaltfishSelect() {
	switch(document.getElementById("saltfishSelect").value)
	{
		case "Bellus angelfish":
        	document.getElementById("saltfishPrice").innerHTML = 149.99;
			document.getElementById("saltfishImage").src = "our fish/180px-Genicanthus_bellus.jpg";
			document.getElementById("saltfishLink").href = "salt_water_fish.html";
			document.getElementById("saltfishLink").title = "Bellus angelfish";
        	break;
			case "Emperor angelfish":
        	document.getElementById("saltfishPrice").innerHTML = 139.99;
			document.getElementById("saltfishImage").src = "our fish/180px-Pomacanthus_imperator_crop.jpg";
			document.getElementById("saltfishLink").href = "salt_water_fish.html";
			document.getElementById("saltfishLink").title = "Emperor angelfish";
        	break;
			
		case "Majestic angelfish":
        	document.getElementById("saltfishPrice").innerHTML = 305.99;
			document.getElementById("saltfishImage").src = "our fish/180px-Holacanthus_passer_1.jpg";
			document.getElementById("saltfishLink").href = "salt_water_fish.html";
			document.getElementById("saltfishLink").title = "Majestic angelfish";
        	break;
		case "Cherubfish or Pygmy angelfish":
        	document.getElementById("saltfishPrice").innerHTML = 50.99;
			document.getElementById("saltfishImage").src = "our fish/180px-Cherub_fish_Centropyge_argi.jpg";
			document.getElementById("saltfishLink").href = "salt_water_fish.html";
			document.getElementById("saltfishLink").title = "Cherubfish or Pygmy angelfish";
        	break;
		case "Lemonpeel angelfish":
        	document.getElementById("saltfishPrice").innerHTML = 61.99;
			document.getElementById("saltfishImage").src = "our fish/180px-Centropyge_flavissima.jpg";
			document.getElementById("saltfishLink").href = "salt_water_fish.html";
			document.getElementById("saltfishLink").title = "Lemonpeel angelfish";
        	break;
	}
	  }
	 function checkmedicationSelect() {
	switch(document.getElementById("medicationSelect").value)
	{
		case "API® Aquarium Salt":
        	document.getElementById("medicationPrice").innerHTML = 3.49;
			document.getElementById("medicationImage").src = "medication/ima.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "API® Aquarium Salt";
        	break;
		case "Instant Ocean® Sea Salt":
        	document.getElementById("medicationPrice").innerHTML = 26.99;
			document.getElementById("medicationImage").src = "medication/ima2.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "Instant Ocean® Sea Salt";
        	break;
		case "Instant Ocean® Reef Crystals Aquarium Reef Salt":
        	document.getElementById("medicationPrice").innerHTML = 64.99;
			document.getElementById("medicationImage").src = "medication/ima3.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "Instant Ocean® Reef Crystals Aquarium Reef Salt";
        	break;
		case "Tetra® Pond Replacement Pre-Filter Foam":
        	document.getElementById("medicationPrice").innerHTML = 3.19;
			document.getElementById("medicationImage").src = "pond care/ima2.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "Tetra® Pond Replacement Pre-Filter Foam";
        	break;
		case "Tetra® Pond Submersible Flat Box Filter":
        	document.getElementById("medicationPrice").innerHTML = 32.99;
			document.getElementById("medicationImage").src = "pond care/ima1.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "Tetra® Pond Submersible Flat Box Filter";
        	break;
		case "API® CO2 Booster Freshwater Aquarium Plant Supplement":
        	document.getElementById("medicationPrice").innerHTML = 16.49;
			document.getElementById("medicationImage").src = "plant care/ima.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "API® CO2 Booster Freshwater Aquarium Plant Supplement";
        	break;
		case "Flourite® Premium Aquarium Plant Substrate":
        	document.getElementById("medicationPrice").innerHTML = 17.19;
			document.getElementById("medicationImage").src = "plant care/ima1.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "Flourite® Premium Aquarium Plant Substrate";
        	break;
		case "API® Guide Fish Problem Solving General Cure":
        	document.getElementById("medicationPrice").innerHTML = 16.99;
			document.getElementById("medicationImage").src = "ds/ima1.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "API® Guide Fish Problem Solving General Cure";
        	break;
		case "API® Pimafix Fish Fungal Infection Treatment":
        	document.getElementById("medicationPrice").innerHTML = 11.39;
			document.getElementById("medicationImage").src = "ds/ima.png";
			document.getElementById("medicationLink").href = "medication.html";
			document.getElementById("medicationLink").title = "API® Pimafix Fish Fungal Infection Treatment";
        	break;
	}
	 }
	  function checkdecorationSelect() {
	switch(document.getElementById("decorationSelect").value)
	{
		case "Top Fin® Artificial Aquarium Plant Variety Pack":
        	document.getElementById("decorationPrice").innerHTML = 9.99;
			document.getElementById("decorationImage").src = "decoration/ima.png";
			document.getElementById("decorationLink").href = "decoration.html";
			document.getElementById("decorationLink").title = "Top Fin® Artificial Aquarium Plant Variety Pack";
        	break;
		case "Top Fin® Premium Quality Aquarium Gravel1":
        	document.getElementById("decorationPrice").innerHTML = 8.99;
			document.getElementById("decorationImage").src = "decoration/ima2.png";
			document.getElementById("decorationLink").href = "decoration.html";
			document.getElementById("decorationLink").title = "Top Fin® Premium Quality Aquarium Gravel1";
        	break;
		case "Top Fin® Premium Quality Aquarium Gravel2":
        	document.getElementById("decorationPrice").innerHTML = 64.99;
			document.getElementById("decorationImage").src = "decoration/ima3.png";
			document.getElementById("decorationLink").href = "decoration.html";
			document.getElementById("decorationLink").title = "Top Fin® Premium Quality Aquarium Gravel2";
        	break;
		case "Top Fin® Premium Aquarium Gravel":
        	document.getElementById("decorationPrice").innerHTML = 5.49;
			document.getElementById("decorationImage").src = "decoration/ima4.png";
			document.getElementById("decorationLink").href = "decoration.html";
			document.getElementById("decorationLink").title = "Top Fin® Premium Aquarium Gravel";
        	break;
	}
	  }

function total() {
	document.getElementById("toalPrice").innerHTML = document.getElementById("fishtankPrice").innerHTML * document.getElementById("fishtankQty").value + document.getElementById("freshfishPrice").innerHTML * document.getElementById("freshfishQty").value + document.getElementById("fishfoodPrice").innerHTML * 
	document.getElementById("fishfoodQty").value + document.getElementById("saltfishPrice").innerHTML * 
	document.getElementById("saltfishQty").value + document.getElementById("medicationPrice").innerHTML * 
	document.getElementById("medicationQty").value + document.getElementById("decorationPrice").innerHTML *
	document.getElementById("decorationQty").value;
}