var defaultTheme = true;
function animateButton (id){
    var button = document.getElementById(id);
    button.style.backgroundColor = '#ff2040';
}

function defaultAnimationButton (id){
    var button = document.getElementById(id);
    button.style.backgroundColor = 'white';
}
function onClickButton(id){
    var button = document.getElementById(id);
    button.style.backgroundColor = 'yellow';
}
function sliderChange(val, id){
    document.getElementById(id).value = val;
}
function changeTheme(){
    if(defaultTheme){
        defaultTheme = false;
        $("#content").css("background-image", "url(background/background6.jpg)");
        $("#content").css("background-repeat", "no-repeat");
        $("#content").css("background-size", "cover");
        $("#description").css("background", "transparent");
        $("#bank_image").css("border", "0");
        $("#player_image").css("border", "0");
        $("div#bank_image > img").hide();
        $("div#player_image > img").hide();
        $("#player_Name").css("background", "transparent");
        $("#nameOfPlayer").hide();
        $("#player_Name").css("border", "0");
        $('label[for=name]').hide();
        $("#player_image").css("width", "60%");
        $("#player_image").css("padding-top", "5%");
        $("#textClassicTheme").css("visibility", "visible");
        $("#textClassicTheme").text($("#state").html());
        $("#state").hide();
    }
    else{
        defaultTheme = true;
        $("#content").css("background-image", "none");
        $("#content").css("background-color", "#00cc00");
        $("#description").css("background-color", "#20e020");
        $("#bank_image").css("border", "1px solid red");
        $("#player_image").css("border", "1px solid red");
        $("div#bank_image > img").show();
        $("div#player_image > img").show();
        $("#nameOfPlayer").show();
        $("#player_Name").css("background-color", "red");
        $("#player_Name").css("border", "1px solid white");
        $('label[for=name]').show();
        $("#player_image").css("width", "20%");
        $("#player_image").css("padding-top", "0");
        $("#textClassicTheme").empty();
        $("#state").show();
        
    }
}