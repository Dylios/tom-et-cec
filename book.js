/* ------------------------------------------------------------
   Le site comme un livre
   - on tourne la page entre les chapitres (View Transitions)
   - la couverture s'ouvre sur le sommaire
   - on peut aussi glisser le doigt pour changer de chapitre
   Tout est un « bonus » : sans ces API, les pages changent
   simplement sans animation.
   ------------------------------------------------------------ */

(function () {

    var ORDER = ["index", "histoire", "mariage", "lieu", "infos", "aventure"];

    function chapterOf(url) {
        var file = new URL(url, location.href).pathname.split("/").pop();
        var name = file.replace(".html", "") || "index";
        var i = ORDER.indexOf(name);
        return i < 0 ? 0 : i;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


    /* ---------- 1. Sens de la page qui se tourne ---------- */

    window.addEventListener("pagereveal", function (event) {

        if (!event.viewTransition || !window.navigation || !navigation.activation) {
            return;
        }

        var from = navigation.activation.from;
        var to = navigation.activation.entry;

        if (!from || !to) {
            return;
        }

        var root = document.documentElement;

        root.dataset.turn = chapterOf(to.url) >= chapterOf(from.url) ? "forward" : "backward";

        event.viewTransition.finished.finally(function () {
            delete root.dataset.turn;
        });
    });


    /* ---------- 2. Glisser pour tourner la page ---------- */

    var startX = 0;
    var startY = 0;
    var tracking = false;

    function link(rel) {
        var a = document.querySelector('a[rel="' + rel + '"]');
        return a ? a.href : null;
    }

    function go(url) {
        if (url) {
            location.href = url;
        }
    }

    document.addEventListener("touchstart", function (e) {
        if (e.touches.length !== 1) { tracking = false; return; }
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        // on laisse tranquille le bord de l'écran (geste « retour » du navigateur)
        tracking = startX > 28 && startX < window.innerWidth - 28;
    }, { passive: true });

    document.addEventListener("touchend", function (e) {
        if (!tracking) { return; }
        tracking = false;

        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 2) { return; }

        var onIndex = document.body.querySelector(".book");

        if (onIndex) {
            var contents = document.getElementById("contents");
            if (dx < 0 && contents && !contents.classList.contains("hidden")) { go("histoire.html"); }
            return;
        }

        go(dx < 0 ? link("next") : link("prev"));
    }, { passive: true });


    /* ---------- 3. Couverture : ouvrir / refermer le livre ---------- */

    var cover = document.querySelector(".cover");
    var contents = document.getElementById("contents");
    var openBtn = document.getElementById("openBook");
    var closeBtn = document.getElementById("closeBook");

    if (!cover || !contents) { return; }

    function swap(showContents, animated) {

        var incoming = showContents ? contents : cover;
        var outgoing = showContents ? cover : contents;

        window.scrollTo(0, 0);

        incoming.classList.remove("hidden");

        if (!animated || reduceMotion.matches) {
            outgoing.classList.add("hidden");
            return;
        }

        // la couverture est toujours la page qui pivote
        cover.classList.add(showContents ? "is-opening" : "is-closing");
        contents.classList.add(showContents ? "is-revealed" : "is-covered");

        cover.addEventListener("animationend", function done() {
            cover.removeEventListener("animationend", done);
            cover.classList.remove("is-opening", "is-closing");
            contents.classList.remove("is-revealed", "is-covered");
            outgoing.classList.add("hidden");
        });
    }

    openBtn.addEventListener("click", function () { swap(true, true); });
    closeBtn.addEventListener("click", function () { swap(false, true); });

    // retour depuis un chapitre : on arrive directement sur le sommaire
    if (location.hash === "#sommaire") {
        swap(true, false);
    }

    window.addEventListener("hashchange", function () {
        if (location.hash === "#sommaire") { swap(true, false); }
    });

})();
