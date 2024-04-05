console.log("let write javascript")
let currentsong = new Audio();
let songs;
let currFolder;


function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// // Example usage:
// const totalSeconds = 125;
// console.log(secondsToMinutes(totalSeconds)); // Output: "2:05"



async function getsong(folder) {
    currFolder = folder;
    console.log(folder)
    try {
        let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
        let response = await a.text();
        console.log("Fetched response:", response); // Debugging line
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/bhojpuri/")[1]);
            }
        }
        console.log("Songs:", songs); // Debugging line
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error); // Debugging line
        return [];
    }
}




const playMusic = (track) => {
    console.log("Playing track:", track); // Debugging line
    console.log("currentfolder : ", currFolder)



    currentsong.src = `/${currFolder}/` + track;
    console.log(`/${currFolder}`)
    console.log("currentsong src:", currentsong.src)


    console.log("there is music not going to load")
    currentsong.play()
        .then(() => {
            console.log("Music is playing"); // Debugging line
            play.src = "/img/pause.svg";
            document.querySelector(".songinfo").innerHTML = track;
        })
        .catch(error => {
            console.error("Error playing music:", error); // Debugging line
        });

    currentsong.onended = () => {
        const currentIndex = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        console.log("Current Index:", currentIndex); // Debugging line
        const nextIndex = (currentIndex + 1) % songs.length;
        console.log("Next Index:", nextIndex); // Debugging line
        playMusic(songs[nextIndex]);
    };
}


async function main() {
    try {
        songs = await getsong("songs/bhojpuri");
        console.log("Fetched songs:", songs); // Debugging line


        let songUL = document.querySelector(".n-playlist").getElementsByTagName("ul")[0];
        for (const song of songs) {
            songUL.innerHTML +=
                `<li> 
                <div class="playlists p2   border-radius">
                    <img class="invert" src="./img/music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Jyotish</div>
                    </div>
                    <div class="playnow">
                        <span>play Now</span>
                        <img class="play invert" src="./img/play.svg" alt="">
                    </div>
                </div> 
            </li>`;
        }

        // attach an event listener to each
        Array.from(document.querySelector(".n-playlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log("Song clicked:", e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });

        // rest of the code...

    } catch (error) {
        console.error("Error in main function:", error); // Debugging line
    }
}

main();



// attach an event listener to play , next  and previous
play.addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play()
        play.src = "/img/pause.svg"
    }
    else {

        currentsong.pause()
        play.src = "/img/play.svg"

    }
})

// listen for time update events
currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
})

// add event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
})

// add event listener for hamburgur
document.querySelector(".nav").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})

//add event listener for previos 

prev.addEventListener("click", () => {
    currentsong.pause()
    console.log("previous clicked")
    console.log(currentsong)
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])

    }
})

//add event listener for next
next.addEventListener("click", () => {
    currentsong.pause()
    console.log("next clicked")
    console.log(currentsong)
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])

    }
})

// add event listener for volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value)
    currentsong.volume = parseInt(e.target.value) / 100;
})

// load the playlist whenever card is clicked







