// 게시판 목록 전체를 보여주는 페이지

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Tabs, Tab } from '@mui/material'; // Tabs, Tab 추가
import PostList from '../components/Post/PostList';
import axiosInstance from '../utils/axiosInstance';
import '../components/styles/PostListPage.css';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]); // --- 상단 고정 글을 위한 state 추가 ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- 카테고리 기능 추가 ---
  const [category, setCategory] = useState('all'); // 'all'을 기본값으로 설정

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // --- 상단 고정 글 & 일반 글 동시 요청으로 변경 ---
        // 카테고리가 'all'일 때만 상단 고정 글을 함께 불러옵니다.
        if (category === 'all') {
          const [postsResponse, pinnedResponse] = await Promise.all([
            axiosInstance.get('/posts'), // 일반 게시글
            axiosInstance.get('/posts/pinned') // 상단 고정 게시글
          ]);
          setPosts(postsResponse.data);
          setPinnedPosts(pinnedResponse.data);
        } else {
          // --- 카테고리별 게시글 요청 ---
          const response = await axiosInstance.get(`/posts?category=${category}`);
          setPosts(response.data);
          setPinnedPosts([]); // 다른 카테고리에서는 상단 고정 글을 비웁니다.
        }

        setError(null);
      } catch (err) {
        setError('게시글 목록을 불러오지 못했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category]); // category가 바뀔 때마다 useEffect가 다시 실행됩니다.

  // --- 카테고리 기능 추가 ---
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }
  if (error) {
    return <Container><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" className="post-list-page-container">
      <Box className="post-list-header">
        <Typography variant="h4" component="h1">게시판</Typography>
        <Button variant="contained" onClick={() => navigate('/posts/new')}>글쓰기</Button>
      </Box>

      {/* --- 카테고리 탭 추가 --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={category} onChange={handleCategoryChange}>
          <Tab label="전체" value="all" />
          <Tab label="자유게시판" value="free" />
          <Tab label="질문" value="qna" />
          {/* TODO: 백엔드와 협의된 실제 카테고리명으로 수정 */}
        </Tabs>
      </Box>

      {/* 상단 고정 글과 일반 글 목록을 합쳐서 PostList에 전달 */}
      <PostList pinnedPosts={pinnedPosts} posts={posts} />
    </Container>
  );
};

export default PostListPage;