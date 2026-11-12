/* ------------------------------------------------------------
   Le site comme un livre
   - la couverture s'ouvre sur le sommaire
   - entre deux chapitres, la page se plie et se tourne vraiment :
     elle est découpée en fines bandes articulées qui s'incurvent
   - on peut aussi glisser le doigt pour changer de chapitre
   Tout est un « bonus » : si quelque chose échoue, on change
   simplement de page sans animation.
   ------------------------------------------------------------ */

(function () {

    var ORDER = ["index", "histoire", "mariage", "lieu", "infos", "aventure"];

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var inFrame = window.self !== window.top;


    function chapterOf(url) {
        var file = new URL(url, location.href).pathname.split("/").pop();
        var name = file.replace(".html", "") || "index";
        var i = ORDER.indexOf(name);
        return i < 0 ? -1 : i;
    }


    /* =========================================================
       2. La page qui se tourne
       ========================================================= */

    var DURATION = 1150;       // ms
    var MAX_TILT = 102;        // degrés : la page passe la verticale puis s'efface
    var LAG = 0.38;            // retard de la reliure sur le bord libre (plus = plus de courbe)

    var turning = false;
    var frames = {};
    var stage = null;


    function sheetOf(doc) {
        return doc.querySelector(".page") ||
               doc.querySelector(".cover:not(.hidden)") ||
               doc.querySelector(".contents:not(.hidden)");
    }

    function rootOf(doc) {
        return doc.querySelector(".page") || doc.querySelector(".book");
    }

    function frameKey(url) {
        var u = new URL(url, location.href);
        return u.pathname + u.hash;
    }

    function viewportWidth() {
        return document.documentElement.clientWidth;
    }

    function getFrame(url) {

        var key = frameKey(url);

        if (frames[key]) { return frames[key]; }

        var f = document.createElement("iframe");

        f.src = url;
        f.tabIndex = -1;
        f.title = "";
        f.setAttribute("aria-hidden", "true");
        f.setAttribute("scrolling", "no");
        f.style.cssText =
            "position:fixed;left:0;top:0;border:0;visibility:hidden;" +
            "pointer-events:none;z-index:9998;";

        sizeFrame(f);

        f.ready = new Promise(function (resolve) {
            f.addEventListener("load", function () { resolve(true); });
            setTimeout(function () { resolve(false); }, 3000);
        });

        document.body.appendChild(f);
        frames[key] = f;

        return f;
    }

    function sizeFrame(f) {
        f.style.width = viewportWidth() + "px";
        f.style.height = window.innerHeight + "px";
    }


    // Précharge les pages voisines pour que le tour soit immédiat.
    function preloadNeighbours() {
        ["prev", "next"].forEach(function (rel) {
            var a = document.querySelector('a[rel="' + rel + '"]');
            if (a) { getFrame(a.href); }
        });

        var contentsEl = document.getElementById("contents");
        if (contentsEl) { getFrame("histoire.html"); }
    }

    window.addEventListener("load", function () {
        var run = window.requestIdleCallback || function (fn) { setTimeout(fn, 400); };
        run(preloadNeighbours);
    });


    function cleanUp() {
        if (stage) { stage.remove(); stage = null; }
        Object.keys(frames).forEach(function (k) {
            frames[k].style.visibility = "hidden";
            frames[k].style.transition = "";
            frames[k].style.clipPath = "";
        });
        turning = false;
    }

    window.addEventListener("pageshow", function (e) {
        if (e.persisted) { cleanUp(); }
    });


    function ease(u) {
        return 0.5 - 0.5 * Math.cos(Math.PI * u);
    }

    function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }


    // Construit la feuille : une chaîne de bandes articulées.
    function buildSheet(doc, scrollY, prepare) {

        var sheet = sheetOf(doc);
        var rect = sheet.getBoundingClientRect();

        var cw = viewportWidth();
        var count = clamp(Math.round(rect.width / 46), 9, 22);
        var stripW = Math.floor(rect.width / count);

        var clone = rootOf(doc).cloneNode(true);

        if (prepare) { prepare(clone); }

        [].forEach.call(clone.querySelectorAll("[id]"), function (n) { n.removeAttribute("id"); });
        clone.setAttribute("aria-hidden", "true");

        var strips = [];
        var parent = stage;

        for (var i = 0; i < count; i++) {

            var isLast = i === count - 1;
            var w = isLast ? rect.width - stripW * (count - 1) : stripW;

            var s = document.createElement("div");
            s.style.cssText =
                "position:absolute;top:0;height:100%;transform-style:preserve-3d;" +
                "transform-origin:0 50%;will-change:transform;" +
                "left:" + (i === 0 ? rect.left : stripW) + "px;width:" + w + "px;";

            // recto : la page telle qu'elle est
            var face = document.createElement("div");
            face.style.cssText =
                "position:absolute;left:0;top:0;height:100%;overflow:hidden;" +
                "backface-visibility:hidden;-webkit-backface-visibility:hidden;" +
                "width:" + (w + (isLast ? 0 : 1)) + "px;";

            var inner = document.createElement("div");
            inner.style.cssText =
                "position:absolute;top:" + (-scrollY) + "px;width:" + cw + "px;" +
                "left:" + (-(rect.left + i * stripW)) + "px;" +
                'font-family:"Inter",sans-serif;color:#292722;';

            inner.appendChild(clone.cloneNode(true));
            face.appendChild(inner);

            var shadeFront = document.createElement("div");
            shadeFront.style.cssText = "position:absolute;inset:0;";
            face.appendChild(shadeFront);

            // verso : du papier
            var back = document.createElement("div");
            back.style.cssText =
                "position:absolute;left:0;top:0;height:100%;width:" + (w + (isLast ? 0 : 1)) + "px;" +
                "backface-visibility:hidden;-webkit-backface-visibility:hidden;" +
                "transform:rotateY(180deg);background:#e6dcc6;";

            var shadeBack = document.createElement("div");
            shadeBack.style.cssText = "position:absolute;inset:0;";
            back.appendChild(shadeBack);

            s.appendChild(face);
            s.appendChild(back);
            parent.appendChild(s);

            strips.push({ el: s, front: shadeFront, back: shadeBack, backFace: back });
            parent = s;
        }

        return { strips: strips, rect: rect };
    }


    // Joue le tour de page.
    //   direction : 1 = la feuille se tourne (on découvre ce qu'il y a dessous)
    //              -1 = la feuille revient se poser
    //   o.doc, o.scrollY : d'où on copie la feuille
    //   o.prepare(clone) : ajuste la copie (ex. cacher le sommaire)
    //   o.start() : appelé une fois la feuille en place (révèle le dessous)
    //   o.done() : appelé à la fin
    function runTurn(direction, o) {

        var cw = viewportWidth();

        stage = document.createElement("div");
        stage.setAttribute("aria-hidden", "true");
        stage.style.cssText =
            "position:fixed;left:0;top:0;height:" + window.innerHeight + "px;width:" + cw + "px;" +
            "z-index:9999;overflow:hidden;pointer-events:none;perspective:3200px;";

        var built = buildSheet(o.doc, o.scrollY, o.prepare);
        var strips = built.strips;
        var rect = built.rect;

        stage.style.perspectiveOrigin = (rect.left + rect.width * 0.5) + "px 45%";

        // ombre portée sur la page du dessous
        var dim = document.createElement("div");
        dim.style.cssText =
            "position:absolute;top:0;height:100%;background:#050d18;opacity:0;" +
            "left:" + rect.left + "px;width:" + rect.width + "px;";
        stage.insertBefore(dim, stage.firstChild);

        document.body.appendChild(stage);

        if (o.start) { o.start(rect); }

        var count = strips.length;
        var started = null;

        function frame(now) {

            if (started === null) { started = now; }

            var t = clamp((now - started) / DURATION, 0, 1);

            // p : 0 = page à plat sur le dessus, 1 = page entièrement tournée
            var p = direction > 0 ? t : 1 - t;

            var angles = [];

            for (var i = 0; i < count; i++) {
                var r = count === 1 ? 0 : i / (count - 1);    // 0 = reliure, 1 = bord libre
                var lag = LAG * (1 - r);
                var u = clamp((p - lag) / (1 - LAG), 0, 1);
                angles.push(-MAX_TILT * ease(u));
            }

            function shadeFront(a) { return 0.55 * clamp(-a / 90, 0, 1); }
            function shadeBack(a) { return 0.5 * (1 - clamp((-a - 90) / 60, 0, 1) * 0.7); }

            function paint(el, fn, i) {
                var left = fn(i > 0 ? (angles[i - 1] + angles[i]) / 2 : angles[i]);
                var right = fn(i < count - 1 ? (angles[i] + angles[i + 1]) / 2 : angles[i]);
                el.style.background =
                    "linear-gradient(90deg,rgba(8,18,32," + left.toFixed(3) + "),rgba(8,18,32," + right.toFixed(3) + "))";
            }

            for (var j = 0; j < count; j++) {
                var rel = angles[j] - (j > 0 ? angles[j - 1] : 0);
                strips[j].el.style.transform = "rotateY(" + rel.toFixed(3) + "deg)";
                paint(strips[j].front, shadeFront, j);
                paint(strips[j].back, shadeBack, j);
                strips[j].backFace.style.opacity = (1 - clamp((p - 0.42) / 0.30, 0, 1)).toFixed(3);
            }

            dim.style.opacity = (0.42 * (1 - p)).toFixed(3);

            // la page s'efface en fin de course : la suivante est déjà dessous
            stage.style.opacity = (1 - clamp((p - 0.74) / 0.24, 0, 1)).toFixed(3);

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                o.done();
            }
        }

        requestAnimationFrame(frame);
    }


    // Tour de page entre deux fichiers : on précharge la page voisine.
    function play(direction, destFrame, url) {

        sizeFrame(destFrame);

        var forward = direction > 0;

        runTurn(direction, {
            doc: forward ? document : destFrame.contentDocument,
            scrollY: forward ? window.scrollY : 0,
            start: function (rect) {

                if (!forward) { return; }

                // La page suivante ne doit pas dépasser sous le bas de la page
                // qui se tourne : on ne la dévoile qu'à hauteur de celle-ci,
                // puis elle se déploie vers le bas pendant le tour.
                var hidden = Math.max(0, Math.round(window.innerHeight - rect.bottom));

                destFrame.style.transition = "none";
                destFrame.style.clipPath = "inset(0 0 " + hidden + "px 0)";
                destFrame.style.visibility = "visible";

                void destFrame.offsetHeight;

                destFrame.style.transition =
                    "clip-path " + Math.round(DURATION * 0.5) + "ms ease-out " + Math.round(DURATION * 0.45) + "ms";
                destFrame.style.clipPath = "inset(0 0 0 0)";
            },
            done: function () { location.href = url; }
        });
    }


    function turnTo(url) {

        if (turning) { return; }

        var target = new URL(url, location.href);
        var from = chapterOf(location.href);
        var to = chapterOf(target.href);

        var samePage = target.pathname === location.pathname;

        if (reduceMotion.matches || to < 0 || from < 0 || samePage) {
            location.href = url;
            return;
        }

        turning = true;

        var f = getFrame(target.href);

        f.ready.then(function (ok) {

            try {
                if (!ok || !f.contentDocument || !sheetOf(f.contentDocument)) {
                    throw new Error("page non prête");
                }

                play(to > from ? 1 : -1, f, target.href);

            } catch (err) {
                location.href = url;
            }
        });
    }


    /* =========================================================
       Couverture : ouvrir / refermer le livre
       ========================================================= */

    var cover = document.querySelector(".cover");
    var contents = document.getElementById("contents");

    if (cover && contents) {

        var showContents = function (show) {
            contents.classList.toggle("hidden", !show);
            cover.classList.toggle("hidden", show);
        };

        var swap = function (show, animated) {

            window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            if (!animated || inFrame || reduceMotion.matches || turning) {
                showContents(show);
                return;
            }

            turning = true;

            var book = document.querySelector(".book");

            // la copie ne garde que la couverture, quel que soit l'état
            var onlyCover = function (clone) {
                var c = clone.querySelector(".contents");
                var v = clone.querySelector(".cover");
                if (c) { c.classList.add("hidden"); }
                if (v) { v.classList.remove("hidden"); v.style.visibility = ""; }
            };

            // Le sommaire est plus haut que la couverture : on ne le dévoile
            // que jusqu'à la hauteur de la couverture, puis il se déploie
            // vers le bas pendant que la couverture se tourne.
            var EDGE = "-80px";

            var clipTo = function (extra) {
                return "inset(" + EDGE + " " + EDGE + " " + extra + "px " + EDGE + ")";
            };

            var unfold = function (coverHeight, opening) {

                var extra = Math.max(0, contents.offsetHeight - coverHeight);
                var closed = clipTo(extra);
                var open = "inset(" + EDGE + ")";

                contents.style.transition = "none";
                contents.style.clipPath = opening ? closed : open;

                void contents.offsetHeight;   // fixe l'état de départ

                contents.style.transition = opening
                    ? "clip-path " + Math.round(DURATION * 0.5) + "ms ease-out " + Math.round(DURATION * 0.45) + "ms"
                    : "clip-path " + Math.round(DURATION * 0.5) + "ms ease-in";
                contents.style.clipPath = opening ? open : closed;
            };

            try {
                if (!show) {
                    // on mesure la couverture sans la montrer
                    cover.style.visibility = "hidden";
                    cover.classList.remove("hidden");
                }

                var coverHeight = cover.getBoundingClientRect().height;

                runTurn(show ? 1 : -1, {
                    doc: document,
                    scrollY: 0,
                    prepare: onlyCover,
                    start: function () {
                        if (show) {
                            showContents(true);
                        } else {
                            cover.classList.add("hidden");
                            cover.style.visibility = "";
                        }
                        unfold(coverHeight, show);
                    },
                    done: function () {
                        contents.style.transition = "";
                        contents.style.clipPath = "";
                        showContents(show);
                        if (stage) { stage.remove(); stage = null; }
                        turning = false;
                    }
                });

            } catch (err) {
                cover.style.visibility = "";
                contents.style.transition = "";
                contents.style.clipPath = "";
                showContents(show);
                if (stage) { stage.remove(); stage = null; }
                turning = false;
            }
        };

        document.getElementById("openBook").addEventListener("click", function () { swap(true, true); });
        document.getElementById("closeBook").addEventListener("click", function () { swap(false, true); });

        // arrivée depuis un chapitre : directement sur le sommaire
        if (location.hash === "#sommaire") {
            swap(true, false);
        }

        window.addEventListener("hashchange", function () {
            if (location.hash === "#sommaire") { swap(true, false); }
        });
    }


    // Dans un cadre invisible (préchargement), on s'arrête là.
    if (inFrame) { return; }


    // Tous les liens entre chapitres tournent la page.
    document.addEventListener("click", function (e) {

        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }

        var a = e.target.closest && e.target.closest("a[href]");

        if (!a || a.target === "_blank" || a.hasAttribute("download")) { return; }

        var u = new URL(a.href, location.href);

        if (u.origin !== location.origin || chapterOf(u.href) < 0) { return; }

        e.preventDefault();
        turnTo(a.href);
    });


    /* =========================================================
       3. Glisser pour tourner la page
       ========================================================= */

    var startX = 0;
    var startY = 0;
    var tracking = false;

    function link(rel) {
        var a = document.querySelector('a[rel="' + rel + '"]');
        return a ? a.href : null;
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

        if (document.querySelector(".book")) {
            var c = document.getElementById("contents");
            if (dx < 0 && c && !c.classList.contains("hidden")) { turnTo("histoire.html"); }
            return;
        }

        var next = dx < 0 ? link("next") : link("prev");

        if (next) { turnTo(next); }

    }, { passive: true });

})();
