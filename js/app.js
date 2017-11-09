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
});


const STATE = {
    query: {
        key: '3b8476a6e7f18bdc3bf46ddc98e13f7a',
        animal: 'dog',
        output: 'full',
        format: 'json',

    }
}

/* Update all the parameters for your API test*/
var params = {
    key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
    animal: 'dog',
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
        console.log(result.petfinder.pet.animal);
        /* if the results are not meeningful, it might help to convert them to string first
                    var displayStringifiedResults = JSON.stringify(result);
                    console.log(displayStringifiedResults);*/
        /* if the results contain invalid json, it might help to sanitize them first
                    var displaySanitizedResults = sanitizeJSON(result);
                    console.log(displaySanitizedResults);*/
    })
    /* if the call is NOT successful show errors */
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });


// STEP 3 - using the JSON response (videos), populate the relevant part of your HTML with the variable inside the JSON
function displaySearchResults(videosArray) {

    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    $.each(videosArray, function (videosArrayKey, videosArrayValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += "<li>";
        buildTheHtmlOutput += "<p>" + videosArrayValue.snippet.title + "</p>"; //output vide title
        buildTheHtmlOutput += "<a href='https://www.youtube.com/watch?v=" + videosArrayValue.id.videoId + "' target='_blank'>"; //taget blank is going to open the video in a new window
        buildTheHtmlOutput += "<img src='" + videosArrayValue.snippet.thumbnails.high.url + "'/>"; //display video's thumbnail
        buildTheHtmlOutput += "</a>";
        buildTheHtmlOutput += "</li>";
    });

    //use the HTML output to show it in the index.html
    $("#search-results ul").html(buildTheHtmlOutput);
}
});
