//영화 API
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwODE2MjU1ZDRlZjRkMjljMTk1MWEwYzllZTc0MzhlMyIsInN1YiI6IjY2MmNhYTJhZjZmZDE4MDEyODIyMzFiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mL2dduBP0Qzg4Pqy8gMLYnXHu0g8LfmQA0FQoaQngVQ'
    }
};

//a를 기준으로 소문자와 대문자를 무시하고 텍스트를 대조하는 함수
function text_measure(a, b) {
    let i = 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    while (a[i]) {
        if (a[i] !== b[i]) return false;
        i++;
    }
    return true;
}

//40개 분량의 페이지의 제목들을 전부 수집하여 부합하는 조건이 나오면 그 페이지를 불러내는 함수
let pages = [];
let page = 1;

for (let i = 1; i <= 40; i++) {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
        .then(response => response.json())
        .then(response => {

            let results = response["results"];
            let titles = [];
            for (let j in results) {
                titles.push(results[j]['title']);
            }
            pages[i] = titles;
        });
    page++;
}

async function search_TMDB(text) {
    let end = 0;
    let decision_page;
    let decision_title;

    for (let i = 1; i <= 40; i++) {
        for (let j = 0; j < pages[i].length; j++) {
            if (text_measure(text, pages[i][j])) {
                console.log(pages[i][j]);
                decision_page = i;
                decision_title = j;
                end = 1;
                break;
            }
        }
        if (end) {
            console.log("종료");
            break;
        }
    }
    if (decision_page===undefined) {
        alert("조건에 부합하는 영화가 없습니다!");
        return;
    }


    function fetchData() {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${decision_page}`, options)
            .then(response => response.json())
            .then(response => {
                let movie_Info = response['results'][decision_title];

                //로컬 스토리지에 저장 후 새로고침
                window.localStorage.setItem("movie_title", movie_Info['title']);
                window.localStorage.setItem("movie_review", movie_Info['overview']);
                window.localStorage.setItem("movie_image", `https://image.tmdb.org/t/p/w500${movie_Info[`poster_path`]}`);
                window.localStorage.setItem("moive_rating", movie_Info['vote_average']);
                
                location.reload();
            })
    }
    fetchData();
}


//일치하는 제목을 찾아서 API안의 정보들을 탐색하는 함수 (실행속도를 느리게 하므로 구현하지 않음)
/*
function search_TMDB(title) {
    let results;
    let page = 1;
    let decision = 0;
    let end = 0;

    while (end == 0 && page < 10) {
        console.log("start");
        fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
            .then(response => response.json())
            .then(response => {
                results = response['results'];
                for (let j = 0; j < results.length; j++) {

                    console.log(results[j]['title']);
                    if (text_measure(title, results[j]['title'])) {
                        console.log("yes!");
                        decision = j;
                        end = 1;
                        break;
                    }
                }
                console.log(decision);
                
            });
        console.log("end:"+end);
        page++;
    }

}
*/

//영화를 검색할 때
document.getElementById("floatingInputValue").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        let textvalue = document.getElementById("floatingInputValue").value;
        search_TMDB(textvalue);


        //엔터를 누르고 난 뒤에는 모든 입력을 제거함
        document.getElementById("floatingInputValue").value = null;
        event.preventDefault();
    }

});