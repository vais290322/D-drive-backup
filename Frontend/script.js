console.log("hello")
function toggleContent(button) {
    const extraContent = button.previousElementSibling.querySelector('.extra-content');
    if (extraContent.style.display === "none") {
      extraContent.style.display = "block";
      button.textContent = "Show Less";
    } else {
      extraContent.style.display = "none";
      button.textContent = "Show More";
    }
  }