const express = require('express');
const { addPost, posts } = require('./Post'); // post.js에서 함수 가져오기

const router = express.Router();

// 모든 게시글을 불러오기 (GET 요청)
router.get('/', (req, res) => {
    res.json(posts);
});

// 새로운 게시글 추가하기 (POST 요청)
router.post('/', (req, res) => {
    const { title, content } = req.body;
    
    // 제목이나 내용 없을 시 오류 메시지 보내기
    if (!title || !content) {
        return res.status(400).json({ message: "제목과 내용을 입력하세요." });
    }

    const newPost = addPost(title, content); // 새로운 게시글 추가
    res.status(201).json(newPost); // 추가된 게시글 반환
});

module.exports = router; // 다른 파일에서 사용할 수 있도록 내보내기