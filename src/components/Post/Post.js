// Post/post.js
const posts = []; // 게시글을 저장할 배열

// 새로운 게시글을 추가하는 함수
function addPost(title, content) {
    const newPost = { id: posts.length + 1, title, content }; // 게시글 ID 자동 생성
    posts.push(newPost); // 배열에 추가
    return newPost;
}

module.exports = { addPost, posts }; // 다른 파일에서 사용할 수 있도록 내보내기
