const openBook = document.getElementById("openBook");
const contents = document.getElementById("contents");

openBook.addEventListener("click", () => {

    contents.classList.remove("hidden");

    contents.scrollIntoView({
        behavior: "smooth"
    });

});
