
const sidebar = document.getElementById('sidebar')


document.onclick = function(e) {
    if(e.target.id !== 'sidebar')
    {
        const sidebar = document.querySelector('.sidebar')
        sidebar.style.display = 'none'
    }
}