//carousel code
$(document).ready(function () {
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true
    });
    getRandomSearchResults();


    //
    //    -- -- -- -- -- -- -- -- -- -- -
    //    $('input[class="submit_shelter#"]').on('click', function () {
    //
    //        if (this !== "") {
    //            event.preventDefault();
    //
    //            var input = this;
    //
    //            $('html, body').animate({
    //                scrollTop: $(input).offset().top
    //            }, 800, function () {
    //
    //                window.location.this = input;
    //            });
    //        }
    //    }); <
    //    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -


    $("#dynamic-droppdown-trigger").change(drop_down_list);

    $(".adoption_search_form").submit(function (event) {
        //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
        event.preventDefault();
        //get the value from the input box
        var userLocation = $("input[name='location']").val();
        var userAnimal = $("select[name='animal']").val();
        var userBreed = $("select[name='breed']").val();
        var userSex = $("select[name='sex']").val();
        var userSize = $("select[name='size']").val();
        getSpecificSearchResults(userLocation, userAnimal, userBreed, userSex, userSize);
    });

    $(".shelter_form").submit(function (event) {
        //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
        event.preventDefault();
        //get the value from the input box
        var userLocation = $("input[name='location']").val();

        console.log(userLocation);
        getShelterSearchResults(userLocation);
    });
});



const STATE = {
    query: {
        key: '3b8476a6e7f18bdc3bf46ddc98e13f7a',
        animal: 'dog',
        output: 'full',
        format: 'json',
    }
};


//<
//-- -- -- -- -- -- -- -- --
//function handleFindShelterSubmit() {
//
//    $('.shelter_form').submit(event => {
//        event.preventDefault();
//
//        STATE.method = 'shelter.find';
//        STATE.shelterParams.location = $('#shelter_input').val();
//        getShelterListFromAPI(STATE.method, displayShelterList);
//        $('#shelter_input').val('');
//        history.pushState({}, 'shelter-list', 'shelter-list');
//        handleQueryShelterReset();
//        $($('html, body')).animate({
//            scrollTop: $('#snap-to-results').offset().top - 30
//        }, 'slow');
//    });
//};
//
//
//function getShelterListFromAPI(method, callback) {
//    let apiURL = STATE.petfinder_search_url + method + "?callback=?";
//    $.getJSON(apiURL, STATE.queryShelter, callback);
//};
//
//<
//-- -- -- -- -- -- -- -- -- -- -- --



//-----------------------------------------------------------------------------------
//breeds dynamic droppdown

function drop_down_list() {
    var animal = $('#dynamic-droppdown-trigger').val();

    console.log(animal);

    if (animal == "") {
        alert("Please select an animal");
    }

    var params = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: animal,
        format: 'json'
    };
    var result = $.ajax({
            /* update API end point */
            url: 'https://api.petfinder.com/breed.list',
            data: params,
            dataType: "jsonp",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */

            console.log(result);

            var buildTheHtmlOutput = "";

            $.each(result.petfinder.breeds.breed, function (resultsArrayKey, resultsArrayValue) {
                buildTheHtmlOutput += '<option value="' + resultsArrayValue.$t + '">' + resultsArrayValue.$t + '</option>';
            });
            //use the HTML output to show it in the index.html
            $("#dynamic-droppdown-populate").html(buildTheHtmlOutput);

        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
//---------------------------------------------------------------------------------------

function renderShelterList(result) {

    let phoneNumber = null;
    let email = null;

    if (!('$t' in result.phone)) {
        return phoneNumber = 'Phone Number Not Available';
    } else {
        phoneNumber = result.phone.$t;
    };
    if (!('$t' in result.email)) {
        email = 'Email Not Available';
    } else {
        email = '<a href="mailto:${result.email.$t}" target="blank"> ${result.email.$t}</a>';
    };

};





function getRandomSearchResults() {
    var params = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        //    animal: 'dog',
        output: 'full',
        format: 'json',
        location: '76021',
        sex: null,
        size: null,
        age: null,
        breed: [null, null]
    };
    var result = $.ajax({
            /* update API end point */
            url: 'https://api.petfinder.com/pet.getRandom',
            data: params,
            dataType: "jsonp",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */

            displayRandomSearchResults(result.petfinder.pet);

        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayRandomSearchResults(resultsArray) {

    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    buildTheHtmlOutput += '<div class="adoption_results">';

    buildTheHtmlOutput += '<section class="name_container">';
    buildTheHtmlOutput += '<h1 class="dog_name">' + checkText(resultsArray.name.$t) + '</h1>';
    if (resultsArray.breeds.breed.length > 1) {
        buildTheHtmlOutput += '<h2 class="dog_type">' + checkText(resultsArray.breeds.breed[0].$t) + ' ' + checkText(resultsArray.animal.$t) + '</h2>';
    } else {
        buildTheHtmlOutput += '<h2 class="dog_type">' + checkText(resultsArray.breeds.breed.$t) + ' ' + checkText(resultsArray.animal.$t) + '</h2>';
    }
    buildTheHtmlOutput += '</section>';

    buildTheHtmlOutput += '<section class="image_container">';
    if (resultsArray.media.length != 0) {
        buildTheHtmlOutput += '<img src="' + resultsArray.media.photos.photo[2].$t + '" alt="big_dog_pic" class="dog_image">';
    } else {
        buildTheHtmlOutput += '<img src="images/no-image-vector-file.png" alt="big_dog_pic" class="dog_image">';
    }
    buildTheHtmlOutput += '</section>';

    buildTheHtmlOutput += '<section class="contact_container">';
    buildTheHtmlOutput += '<h3 class="dog_location"><i class="fa fa-map-marker" aria-hidden="true"></i> ' + checkText(resultsArray.contact.address1.$t) + ' ' + checkText(resultsArray.contact.city.$t) + ' ' + checkText(resultsArray.contact.state.$t) + ' ' + checkText(resultsArray.contact.zip.$t) + '</h3>';
    buildTheHtmlOutput += '<div class="dog_contact">';
    buildTheHtmlOutput += '<ul class="adopt_ul">';
    buildTheHtmlOutput += '<li class="adopt_li"><i class="fa fa-phone" aria-hidden="true"></i> ' + checkText(resultsArray.contact.phone.$t) + '</li>';
    buildTheHtmlOutput += '<li class="adopt_li"><a href="" class="contact_a"><i class="fa fa-envelope" aria-hidden="true"></i> ' + checkText(resultsArray.contact.email.$t) + '</a></li>';
    buildTheHtmlOutput += '</ul>';
    buildTheHtmlOutput += '</div>';
    buildTheHtmlOutput += '</section>';

    buildTheHtmlOutput += '<a href="https://www.petfinder.com/petdetail/' + checkText(resultsArray.id.$t) + '"  class="petfinder_button" target="_blank">View My Petfinder Page</a>';
    buildTheHtmlOutput += '</div>';


    //use the HTML output to show it in the index.html
    $(".random_pet_results_container").html(buildTheHtmlOutput);
};


function getSpecificSearchResults(userLocation, userAnimal, userBreed, userSex, userSize) {
    var params = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: userAnimal,
        output: 'full',
        format: 'json',
        location: userLocation,
        sex: userSex,
        size: userSize,
        count: 10,
        breed: userBreed
    };
    var result = $.ajax({
            /* update API end point */
            url: 'https://api.petfinder.com/pet.find',
            data: params,
            dataType: "jsonp",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */
            console.log(result);
            console.log(result.petfinder.pets.pet);
            displaySpecificSearchResults(result.petfinder.pets.pet);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function checkText(inputText) {
    let outtext = "";
    if (inputText != undefined) {
        outtext = inputText;
    }
    return outtext;
}

function displaySpecificSearchResults(resultsArray) {
    console.log(resultsArray);
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    $.each(resultsArray, function (resultsArrayKey, resultsArrayValue) {

        buildTheHtmlOutput += '<div class="adoption_results">';

        buildTheHtmlOutput += '<section class="name_container">';
        buildTheHtmlOutput += '<h1 class="dog_name">' + checkText(resultsArrayValue.name.$t) + '</h1>';
        if (resultsArrayValue.breeds.breed.length > 1) {
            buildTheHtmlOutput += '<h2 class="dog_type">' + checkText(resultsArrayValue.breeds.breed[0].$t) + ' ' + checkText(resultsArrayValue.animal.$t) + '</h2>';
        } else {
            buildTheHtmlOutput += '<h2 class="dog_type">' + checkText(resultsArrayValue.breeds.breed.$t) + ' ' + checkText(resultsArrayValue.animal.$t) + '</h2>';
        }
        buildTheHtmlOutput += '</section';

        buildTheHtmlOutput += '<section class="image_container">';
        if (resultsArrayValue.media.length != 0) {
            buildTheHtmlOutput += '<img src="' + resultsArrayValue.media.photos.photo[2].$t + '" alt="big_dog_pic" class="dog_image">';
        } else {
            buildTheHtmlOutput += '<img src="images/no-image-vector-file.png" alt="big_dog_pic" class="dog_image">';
        }
        buildTheHtmlOutput += '</section>';

        buildTheHtmlOutput += '<section class="contact_container">';
        buildTheHtmlOutput += '<h3 class="dog_location"><i class="fa fa-map-marker" aria-hidden="true"></i> ' + checkText(resultsArrayValue.contact.address1.$t) + ' ' + checkText(resultsArrayValue.contact.city.$t) + ' ' + checkText(resultsArrayValue.contact.state.$t) + ' ' + checkText(resultsArrayValue.contact.zip.$t) + '</h3>';
        buildTheHtmlOutput += '<div class="dog_contact">';
        buildTheHtmlOutput += '<ul class="adopt_ul">';
        buildTheHtmlOutput += '<li class="adopt_li"><i class="fa fa-phone" aria-hidden="true"></i> ' + checkText(resultsArrayValue.contact.phone.$t) + '</li>';
        buildTheHtmlOutput += '<li class="adopt_li"><a href="" class="contact_a"><i class="fa fa-envelope" aria-hidden="true"></i> ' + checkText(resultsArrayValue.contact.email.$t) + '</a></li>';
        buildTheHtmlOutput += '</ul>';
        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</section>';

        buildTheHtmlOutput += '<a href="https://www.petfinder.com/petdetail/' + resultsArrayValue.id.$t + '"  class="petfinder_button" target="_blank">View My Petfinder Page</a>';
        buildTheHtmlOutput += '</div>';

    });
    //use the HTML output to show it in the index.html
    $(".results_container").html(buildTheHtmlOutput);
};



function getShelterSearchResults(userLocation) {
    var params = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        format: 'json',
        location: userLocation,
        count: 10
    };
    var result = $.ajax({
            /* update API end point */
            url: 'https://api.petfinder.com/shelter.find',
            data: params,
            dataType: "jsonp",
            /*set the call type GET / POST*/
            type: "GET"
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */
            console.log(result);
            /*   console.log(result.petfinder.pets.pet); */

            displayShelterSearchResults(result.petfinder.shelters.shelter);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayShelterSearchResults(resultsArray) {
    console.log(resultsArray);
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    $.each(resultsArray, function (resultsArrayKey, resultsArrayValue) {

        buildTheHtmlOutput += '<section class="shelter_results_container text-left">';

        buildTheHtmlOutput += '<div class="shelter_results">';

        buildTheHtmlOutput += '<h2 id="shelter_name">' + checkText(resultsArrayValue.name.$t) + '</h2>';
        buildTheHtmlOutput += '<ul class="shelter_ul">';

        buildTheHtmlOutput += '<li id="shelter_location"><i class="fa fa-map-marker" aria-hidden="true"></i> ' + checkText(resultsArrayValue.address1.$t) + ' ' + checkText(resultsArrayValue.city.$t) + ' ' + checkText(resultsArrayValue.state.$t) + ' ' + checkText(resultsArrayValue.zip.$t) + '</li>';

        if (!resultsArrayValue.phone) {
            '<li id="shelter_phone"><i class="fa fa-phone" aria-hidden="true"></i> No Phone Number Avaialable </li>';
        } else {
            buildTheHtmlOutput += '<li id="shelter_phone"><i class="fa fa-phone" aria-hidden="true"></i> ' + checkText(resultsArrayValue.phone.$t) + '</li>';
        }

        buildTheHtmlOutput += '<li id="shelter_email"><a href="" class="shelter_email"><i class="fa fa-envelope" aria-hidden="true"> </i> ' + checkText(resultsArrayValue.email.$t) + '</a></li>';
        buildTheHtmlOutput += '</ul>';

        buildTheHtmlOutput += '</div>';

        buildTheHtmlOutput += '</section>';
    });
    //use the HTML output to show it in the index.html
    $(".shelter_results_container").html(buildTheHtmlOutput);
};
