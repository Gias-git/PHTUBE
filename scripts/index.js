
function getTimeString(time) {
    const hour = parseInt(time / 3600);
    const remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    const Second = remainingSecond % 60;
    return `${hour} Hour ${minute} Minute ${Second} Second Ago`
}

function removeActiveClass() {
    const button = document.getElementsByClassName('category-btn');

    for (let btn of button) {
        btn.classList.remove('activeStyle')
    }
}

// 1. Load and fetch categories on html

// create load categories

const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((err) => console.log(err))
}

loadCategories();
// create load videos

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.videos))
        .catch((err) => console.log(err))
}


loadVideos();

// display categories

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach((item) => {
        // create a button
        const button = document.createElement("button");
        button.classList = 'btn category-btn';

        button.id = `${item.category_id}`;
        button.innerText = item.category;
        button.onclick = () => {
            removeActiveClass();
            const id = item.category_id;
            const activeBtn = document.getElementById(button.id);
            console.log(activeBtn);
            activeBtn.classList.add('activeStyle')
            fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
                .then((res) => res.json())
                .then((data) => displayVideos(data.category))
                .catch((err) => console.log(err))
        }

        // add button to the category container
        categoriesContainer.append(button);
    });

}


// display videos

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = "";
    if (videos.length == 0) {
        videoContainer.classList.remove("grid");
        return videoContainer.innerHTML = `
       <div class="min-h-[600px] w-full flex flex-col gap-5 justify-center mx-auto items-center">
       <img src= "assests/Icon.png">
       <h2 class = "text-center text-4xl font-bold">
       No videos In this Category
       </h2>
       </div>
       
       `
    } else {
        videoContainer.classList.add("grid");
    }
    videos.forEach((video) => {
        const card = document.createElement("div");

        card.classList = 'card card-compact'

        card.innerHTML = `

                    <figure class="h-[200px] relative ">
                        <img class ="h-full w-full object-cover"
                        src=${video.thumbnail}
                        alt="Shoes"/>

                        ${video.others.posted_date.length !== 0 ? `<span class= "absolute right-2 bottom-2 px-2 bg-black text-white rounded-sm text-sm"> ${getTimeString(video.others.posted_date)}</span>` : ``};
                        
                    </figure>
                    <div class="px-0 py-3 flex gap-2">
                       <div>
                            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} >
                       </div>

                       <div>
                       <h2 class= "font-bold"> ${video.title}</h2>

                       <div class= "flex  items-center gap-x-2">
                       <p class= "text-gray-600">${video.authors[0].profile_name}</p>

                       ${video.authors[0].verified == true ? '<img class="w-4 rounded-full object-cover" src="https://img.icons8.com/?size=100&id=r7FUj5zJZpgL&format=png&color=000000"/>' : ''}
                       
                       </div>
                       
                       <p></p>
                       
                       </div>
                    </div>`

        videoContainer.append(card);
    })
}


document.getElementById('search-input').addEventListener('keyup',(e)=>{
    loadVideos(e.target.value);
})
