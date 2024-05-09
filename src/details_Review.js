function reviewmaker(user_name, user_rating, review_comments) {    //새로운 리뷰 추가
    const Reviewbox = document.getElementById('reviewbox');

    const User_name = document.createElement('div');
    User_name.classList.add('user_name');
    User_name.textContent = `user_name: ${user_name}`;

    const User_rating = document.createElement('div');
    User_rating.classList.add('user_rating');
    User_rating.textContent = `score: ${user_rating}`;

    const User_info = document.createElement('div');
    User_info.classList.add('user_info');

    const Review_comments = document.createElement('p');
    Review_comments.classList.add('review_comments');
    Review_comments.textContent = review_comments;

    const Review_modify = document.createElement('button');
    Review_modify.classList.add('powderblue_btn');
    Review_modify.classList.add('review_modify');
    Review_modify.textContent = "리뷰 수정";

    const Review_delete = document.createElement('button');
    Review_delete.classList.add('red_btn');
    Review_delete.classList.add('review_delete');
    Review_delete.textContent = "리뷰 삭제";

    const Review = document.createElement('div');
    Review.classList.add('review');

    User_info.appendChild(User_name);
    User_info.appendChild(User_rating);

    Review.appendChild(User_info);
    Review.appendChild(Review_comments);
    Review.appendChild(Review_modify);
    Review.appendChild(Review_delete);

    Reviewbox.appendChild(Review);
}

//하나의 빈공간 메꾸기 함수 (배열,메꿀 인덱스)
function fill_one_array(array, index) {
    while (array[index + 1] !== undefined) {
        array[index] = array[index + 1];
        index++;
    }
    array.pop();
    return array;
}
/*
*/




//로컬 스토리지에 저장한 파일 불러와서 붙이기
const movie_title = window.localStorage.getItem("movie_title");
const movie_image = `https://image.tmdb.org/t/p/w500${window.localStorage.getItem("movie_image")}`;
const movie_explain = window.localStorage.getItem("movie_review");

document.getElementById("movie_title").innerHTML = movie_title;
document.getElementById("movie_image").src = movie_image;
document.getElementById("movie_contents").innerHTML = movie_explain;


//영화의 이름을 키값으로 검색하여 리뷰들을 가져오기
let Reviews = JSON.parse(localStorage.getItem(movie_title));
if (Reviews !== null) {
    Reviews.forEach(data => {
        reviewmaker(data.name, data.rating, data.comments); //user_name, user_rating, review_comments
    });
}


//리뷰에서 수정 버튼을 눌렀을 때
let Modify_buttons = document.querySelectorAll('.review_modify');
for (let i = 0; i < Modify_buttons.length; i++) {
    Modify_buttons[i].addEventListener('click', function () {

        let modal = document.getElementById('write_modify');
        modal.style.display = 'flex';
        console.log(`${i}번째 버튼에서 Modify 발생!`);

        //기존에 작성한 내용 보이게 하기
        document.getElementById('modify_user_nickname').value = Reviews[i].name;
        document.getElementById('modify_user_rating').value = Reviews[i].rating;
        document.getElementById('modify_user_comments').value = Reviews[i].comments;

        document.getElementById('modify_Complete_modal').addEventListener('click', function () {
            let pwd = document.getElementById('modify_user_pwd').value;
            let nickname = document.getElementById('modify_user_nickname').value;
            let rating = document.getElementById('modify_user_rating').value;
            let comments = document.getElementById('modify_user_comments').value;

            if (pwd === Reviews[i].pwd) {
                Reviews[i].name = nickname;
                Reviews[i].rating = rating;
                Reviews[i].comments = comments;
                localStorage.setItem(movie_title, JSON.stringify(Reviews));

                alert("수정 완료");
                modal.style.display = 'none';
                location.reload();
            }
            else {
                alert("비밀번호가 틀립니다! 다시 입력하세요.");
            }

            console.log(pwd + nickname + rating + comments);
        })

        //닫기 버튼
        document.getElementById('modify_close_modal').addEventListener('click', function () {
            modal.style.display = 'none';
        })
    })
}


//리뷰에서 삭제 버튼을 눌렀을 때
let Delete_buttons = document.querySelectorAll('.review_delete');

for (let i = 0; i < Delete_buttons.length; i++) {
    Delete_buttons[i].addEventListener('click', function () {
        console.log(`${i}번째 버튼에서 Delete 발생!`);

        //비밀번호 모달창
        let modal = document.getElementById('input_password');
        modal.style.display = "flex";

        document.getElementById('password_Complete_modal').addEventListener('click', function () {
            let input_password = document.getElementById('pwd_check').value;

            if (input_password === Reviews[i].pwd) {//비밀번호가 맞은 경우
                //삭제 과정
                fill_one_array(Reviews, i);

                //변경된 리뷰데이터를 기존 키값에 다시 저장
                window.localStorage.setItem(movie_title, JSON.stringify(Reviews));
                modal.style.display = "none";
                alert("삭제 완료!");
                location.reload();
            }
            else     //비밀번호가 틀린 경우
                alert("비밀번호가 틀립니다! 다시 입력하세요.");
        })

        //닫기 버튼
        document.getElementById('password_close_modal').addEventListener('click', function () {
            modal.style.display = "none";
        })
        
    })

}


//====================== Write review 모달창 관련=================//

//Write review 버튼을 입력했을 때 -> 모달창 나옴
document.getElementById('movie_write').addEventListener('click', function (event) {
    const modal = document.getElementById('write_review');
    if (modal.style.display === "flex") {
        modal.style.display = 'none';
    }
    else
        modal.style.display = "flex";
})

//모달창에서 작성창 닫기 버튼을 눌렀을 때
document.getElementById('close_modal').addEventListener('click', function () {
    document.getElementById('write_review').style.display = "none";
});
//모달창에서 작성 완료 버튼을 눌렀을 때
document.getElementById("Complete_modal").addEventListener('click', function () {

    //입력한 정보를 받아옴
    const Pwd = document.getElementById("user_pwd").value;
    const Name = document.getElementById("user_nickname").value;
    const Rating = document.getElementById("user_rating").value;
    const Comments = document.getElementById("user_comments").value;

    //유효성 검사
    if (Pwd.length < 3 || Pwd.length > 8) {
        alert("비밀번호가 너무 짧거나 깁니다!");
        return;
    }

    //영화 리뷰에 관한 정보
    const Review = {
        "movie_title": movie_title,
        "pwd": Pwd,
        "name": Name,
        "rating": Rating,
        "comments": Comments,
    }

    let Reviews = window.localStorage.getItem(movie_title);  //유저정보들을 저장하는 데이터의 키값은 '변수',movie_title

    if (Reviews === null) {       //로컬 스토리지에 공간이 없을 경우 공간을 만듬
        //유저정보'들'을 저장하는 객체
        const arr = [];
        const arrString = JSON.stringify(arr);

        window.localStorage.setItem(movie_title, arrString);    //영화의 이름을 키값으로 지정
        Reviews = localStorage.getItem(movie_title);
    }
    Reviews = JSON.parse(Reviews);
    Reviews.push(Review);
    //정보를 추가한 뒤 다시 저장
    localStorage.setItem(movie_title, JSON.stringify(Reviews));

    //모달창 닫기
    document.getElementById('write_review').style.display = "none";

    alert("성공적으로 기록되었습니다!");
    location.reload();
})

//====================== Write review 모달창 관련=================//

//초기화 버튼을 누를 때
document.getElementById("local_init").addEventListener("click", () => {
    window.localStorage.clear();
    alert("successfully removed on all windows");
})
//남은 데이터 버튼을 누를 때
document.getElementById("Call_Data").addEventListener("click", function () {
    let tape = window.localStorage.getItem("movie_title");
    console.log(tape);
})