
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