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

function updateFrontCartCount() {
    const cart = JSON.parse(localStorage.getItem('kakiCart')) || [];
    const count = cart.length;

    // TARGET THE NEW BADGE ELEMENT
    const badgeElement = document.getElementById('cart-badge');

    if (badgeElement) {
        // Update the custom attribute for the CSS content
        badgeElement.setAttribute('data-count', count);
    }
}

// Run immediately
updateFrontCartCount();