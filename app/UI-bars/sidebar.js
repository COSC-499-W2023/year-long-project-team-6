var modal = document.getElementById("myModal");


      // Get the button that opens the modal
      var btn = document.getElementById("myBtn");

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on the button, open the modal 
      btn.onclick = function() {
        modal.style.display = "block";
      }

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    
   function searchGroup() {
        var searchInput = document.getElementById('searchInput');
        var resultContainer = document.getElementById('resultContainer');

        // Get the value entered by the user
        var searchValue = searchInput.value.trim();

        if (searchValue.length === 5) {
          // You can implement your search logic here
          // For this example, we'll just display the entered code
          resultContainer.innerHTML = `Searching for group with code: ${searchValue}`;
        } else {
          resultContainer.innerHTML = 'Please enter a 5-character code.';
        }
      }
      // Select all anchor tags within list items



        var links = document.querySelectorAll('li a');
// Add event listener to each anchor tag
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(event) {
      
        // If the clicked anchor has the class 'addgroup', do nothing
        if (this.classList.contains('addgroup')) {
            return; // Exit the function early
        }

        // Remove 'active' class from all anchor tags except the 'addgroup' link
        for (let j = 0; j < links.length; j++) {
            links[j].classList.remove('active');
        }

        // Add 'active' class to the clicked anchor tag
        this.classList.add('active');
    });
}
      
