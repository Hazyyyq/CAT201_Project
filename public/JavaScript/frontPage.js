window.addEventListener('scroll', reveal);

function reveal(){
    var reveals= document.querySelectorAll('.reveal');
    for (var i=0; i< reveals.length; i++){
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint= 100;
        if(revealtop < windowheight - revealpoint){
            reveals[i].classList.add('active');
        }
    }
}
reveal();

document.addEventListener("DOMContentLoaded", function () {
    const userBtn = document.getElementById('userIconBtn');
    const userDropdown = document.getElementById('userDropdown');

    // Toggle menu on icon click
    userBtn.addEventListener('click', function(event) {
        event.stopPropagation(); //prevent window click from browser
        userDropdown.classList.toggle('show-dropdown');
    });

    // CLose menu if user clicks anywhere
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.user-icon') && !event.target.matches ('dropdown-content')) {
            if (userDropdown.classList.contains('show-dropdown')) {
                userDropdown.classList.remove('show-dropdown');
            }
        }
    });
});