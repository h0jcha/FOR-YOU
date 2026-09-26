/* =========================================================
   ELEMENTS
   ========================================================= */

const openButton =
    document.getElementById("openButton");

const opening =
    document.getElementById("opening");

const letterPage =
    document.getElementById("letterPage");

const bgMusic =
    document.getElementById("bgMusic");


/* =========================================================
   MUSIC
   ========================================================= */

let fadeInterval = null;


/*
   Fade the music in gently after the user
   has deliberately opened the letter.
*/

function fadeInMusic() {

    clearInterval(fadeInterval);

    bgMusic.volume = 0;

    const targetVolume = 0.32;

    const fadeDuration = 2500;

    const steps = 50;

    const stepTime =
        fadeDuration / steps;

    const volumeStep =
        targetVolume / steps;


    fadeInterval = setInterval(() => {

        const nextVolume =
            bgMusic.volume + volumeStep;


        if (nextVolume >= targetVolume) {

            bgMusic.volume =
                targetVolume;

            clearInterval(
                fadeInterval
            );

            fadeInterval = null;

            return;
        }


        bgMusic.volume =
            nextVolume;

    }, stepTime);
}


/* =========================================================
   OPEN LETTER
   ========================================================= */

openButton.addEventListener(
    "click",
    async () => {

        /*
           Prevent the animation from restarting
           if the button is accidentally clicked twice.
        */

        if (
            document.body.classList.contains(
                "opened"
            )
        ) {
            return;
        }


        /*
           Start the visual transition.
        */

        document.body.classList.add(
            "opened"
        );

        letterPage.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
           Start the music from the beginning.

           Because this happens directly inside
           the user's click event, Safari/mobile
           browsers are much more likely to allow it.
        */

        try {

            clearInterval(fadeInterval);

            bgMusic.currentTime = 0;

            bgMusic.volume = 0;

            await bgMusic.play();

            fadeInMusic();

        } catch (error) {

            /*
               The letter still works perfectly
               even if the browser blocks audio.
            */

            console.log(
                "Music could not start:",
                error
            );
        }

    }
);


/* =========================================================
   PAGE EXIT
   ========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        if (!bgMusic.paused) {
            bgMusic.volume = 0;
        }

    }
);


window.addEventListener(
    "beforeunload",
    () => {

        if (!bgMusic.paused) {
            bgMusic.volume = 0;
        }

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

letterPage.setAttribute(
    "aria-hidden",
    "true"
);

bgMusic.volume = 0;