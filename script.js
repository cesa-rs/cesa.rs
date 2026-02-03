let canUpdate = false;

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://webring.otomir23.me/cesarean/data")
        .then(res => res.json())
        .then(data => {
            if (!data.prev || !data.next) return;

            const prev = document.querySelector(".webring .prev");
            const next = document.querySelector(".webring .next");

            if (prev) {
                const h3 = prev.querySelector("h3");

                if (h3) h3.textContent = data.prev.name;
                prev.addEventListener("click", () => {
                    window.location.href = data.prev.url;
                });
            }

            if (next) {
                const h3 = next.querySelector("h3");

                if (h3) h3.textContent = data.next.name;
                next.addEventListener("click", () => {
                    window.location.href = data.next.url;
                });
            }
        })
        .catch(err => console.error("Webring fetch error:", err));
});

(function () {
    const birth = new Date("2005-10-20T07:00:00");
    const msYear = 365.2425 * 24 * 60 * 60 * 1000;
    const el = document.getElementById("age");
    if (!el) return;

    let prevAge = 0;
    let initialized = false;

    function tick() {
        const now = Date.now();
        const age = (now - birth) / msYear;

        if (!initialized) {
            const start = age - 0.5;
            renderCounter(start.toFixed(7));

            animateCounterSmooth(start, age, 30, 75);

            prevAge = age;
            initialized = true;
        } else {
            const diff = age - prevAge;
            if (Math.abs(diff) > 0.0000001) {
                animateCounter(prevAge, age);
                prevAge = age;
            }
        }

        requestAnimationFrame(tick);
    }

    tick();
})();

function renderCounter(ageStr) {
    const el = document.getElementById("age");
    if (!el) return;
    el.innerHTML = "";

    const [intPart, fracPart] = ageStr.split(".");
    const makeDigit = (d) => {
        const flip = document.createElement("div");
        flip.className = "flip";
        const digit = document.createElement("div");
        digit.className = "digit";
        digit.textContent = d;
        flip.appendChild(digit);
        return flip;
    };

    for (const d of intPart) el.appendChild(makeDigit(d));
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.textContent = ".";
    el.appendChild(dot);
    for (const d of fracPart) el.appendChild(makeDigit(d));
    el.dataset.ready = "1";
}

function animateCounterSmooth(start, end, steps = 40, delay = 50) {
    const stepSize = (end - start) / steps;
    let current = start;
    let i = 0;

    const interval = setInterval(() => {
        current += stepSize;
        const val = current.toFixed(7);
        const el = document.getElementById("age");
        if (!el) return;

        const [intPart, fracPart] = val.split(".");
        const digits = [...intPart, ".", ...fracPart];
        const flips = el.querySelectorAll(".flip");

        let fi = 0;
        digits.forEach((d) => {
            if (d === ".") return;
            const flip = flips[fi++];
            if (!flip) return;

            const cur = flip.querySelector(".digit");
            if (cur && cur.textContent !== d) {
                animateDigitOnce(flip, d);
            }
        });

        if (current >= end - 0.000000000000500)
            canUpdate = true;

        i++;
        if (i >= steps) clearInterval(interval);
    }, delay);
}

function updateDigitsInstant(val) {
    const el = document.getElementById("age");
    if (!el) return;

    const [intPart, fracPart] = val.split(".");
    const digits = [...intPart, ".", ...fracPart];
    const flips = el.querySelectorAll(".flip");
    let fi = 0;

    digits.forEach((d) => {
        if (d === ".") return;
        const flip = flips[fi++];
        if (!flip) return;
        const cur = flip.querySelector(".digit");
        if (!cur || cur.textContent !== d) {
            cur.textContent = d;
        }
    });
}

function animateCounter(start, end) {
    if (!canUpdate) return;
    const el = document.getElementById("age");
    if (!el || !el.dataset.ready) return;

    const startStr = start.toFixed(7);
    const endStr = end.toFixed(7);
    const [startInt, startFrac] = startStr.split(".");
    const [endInt, endFrac] = endStr.split(".");

    const startDigits = [...startInt, ".", ...startFrac];
    const endDigits = [...endInt, ".", ...endFrac];
    const flips = el.querySelectorAll(".flip");

    let fi = 0;
    endDigits.forEach((d) => {
        if (d === ".") return;
        const flip = flips[fi++];
        const current = flip.querySelector(".digit").textContent;
        if (current !== d) animateDigitOnce(flip, d);
    });
}

function animateDigitOnce(flip, newChar) {
    const current = flip.querySelector(".digit:last-child");
    if (current && current.textContent === newChar) return;

    const oldDigit = flip.querySelector(".digit.old");
    if (oldDigit && oldDigit.parentNode === flip) {
        flip.removeChild(oldDigit);
    }

    const newDigit = document.createElement("div");
    newDigit.className = "digit";
    newDigit.textContent = newChar;
    flip.appendChild(newDigit);

    newDigit.getBoundingClientRect();
    newDigit.classList.add("new");
    if (current) current.classList.add("old");

    setTimeout(() => {
        const old = flip.querySelector(".digit.old");
        if (old && old.parentNode === flip) flip.removeChild(old);
        newDigit.classList.remove("new");
    }, 360);

    const avatarWrap = document.querySelector(".avatar-wrap img");
    if (!avatarWrap) return;

    const avatar = document.querySelector(".avatar");
    if (!avatar) return;

    let clickCount = 0;
    let timer = null;
    let easterActive = false;

    avatarWrap.addEventListener("click", () => {
        if (easterActive) {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            return;
        }

        clickCount++;

        clearTimeout(timer);
        timer = setTimeout(() => {
            clickCount = 0;
        }, 1000);

        if (clickCount >= 10) {
            avatarWrap.src = "record-player-pixel-art.gif";
            avatar.style.width = "100px";
            easterActive = true;
            clickCount = 0;
        }
    });
}