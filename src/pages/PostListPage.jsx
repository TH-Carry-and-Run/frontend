import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import Navbar from '../components/Nav/Navbar'; // ✨ 네비게이션 바 import
import PostList from '../components/Post/PostList';
import axiosInstance from '../utils/axiosInstance';
import '../components/styles/PostListPage.css';

// --- [1] 임시 데이터 (백엔드 연동 전 화면 확인용) ---
const dummyPosts = [
  {
    id: 1,
    title: "TCAR 클라우드 서비스 오픈 안내",
    author: "관리자",
    createdAt: "2025-10-01",
    viewCount: 120,
    category: "notice",
    pinned: true
  },
  {
    id: 2,
    title: "리액트로 게시판 만들기 너무 재밌네요",
    author: "김개발",
    createdAt: "2025-12-03",
    viewCount: 45,
    category: "free",
    pinned: false
  },
  {
    id: 3,
    title: "터미널 접속이 안될 때는 어떻게 하나요?",
    author: "이궁금",
    createdAt: "2025-12-04",
    viewCount: 12,
    category: "qna",
    pinned: false
  },
  {
    id: 4,
    title: "오늘 점심 메뉴 추천받습니다",
    author: "배고파",
    createdAt: "2025-12-05",
    viewCount: 5,
    category: "free",
    pinned: false
  },
  {
    id: 5,
    title: "도커 컨테이너 배포 질문입니다.",
    author: "박서버",
    createdAt: "2025-12-06",
    viewCount: 30,
    category: "qna",
    pinned: false
  }
];

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // --- 원래 API 코드 (나중에 백엔드 준비되면 주석 해제하세요) ---
        /*
        if (category === 'all') {
          const [postsResponse, pinnedResponse] = await Promise.all([
             axiosInstance.get('/posts'),
             axiosInstance.get('/posts/pinned')
          ]);
          setPosts(postsResponse.data);
          setPinnedPosts(pinnedResponse.data);
        } else {
          const response = await axiosInstance.get(`/posts?category=${category}`);
          setPosts(response.data);
          setPinnedPosts([]);
        }
        */

        // --- [2] 임시 데이터 로직 (화면 확인용) ---
        // 1. 카테고리에 맞춰 필터링
        let filteredPosts = dummyPosts;
        if (category !== 'all') {
            filteredPosts = dummyPosts.filter(post => 
              post.category === category || (category === 'free' && post.category === 'notice')
            );
        }

        // 2. 고정글(pinned)과 일반글 분리
        const pinned = filteredPosts.filter(p => p.pinned);
        const normal = filteredPosts.filter(p => !p.pinned);

        setPinnedPosts(pinned);
        setPosts(normal);
        // ------------------------------------------

        setError(null);
      } catch (err) {
        console.error(err);
        setError('게시글 목록을 불러오지 못했습니다.');
        setPosts([]); // 에러 시 빈 배열
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category]);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  if (loading) {
    return (
      // 로딩 중에도 Navbar는 보이게 하거나, 로딩 스피너만 띄울 수 있음
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="post-list-page-wrapper">
      {/* ✨ 상단 네비게이션 바 추가 */}
      <Navbar /> 

      {/* 메인 컨텐츠 컨테이너 */}
      <Container maxWidth="lg" className="post-list-page-container" sx={{ mt: 4, mb: 4 }}>
        <Box className="post-list-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            게시판
          </Typography>
          <Button variant="contained" onClick={() => navigate('/posts/new')}>
            글쓰기
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={category} onChange={handleCategoryChange}>
            <Tab label="전체" value="all" />
            <Tab label="자유게시판" value="free" />
            <Tab label="질문" value="qna" />
          </Tabs>
        </Box>

        {/* 임시 데이터가 적용된 리스트가 렌더링됩니다 */}
        <PostList pinnedPosts={pinnedPosts} posts={posts} />
      </Container>
    </div>
  );
};

export default PostListPage;