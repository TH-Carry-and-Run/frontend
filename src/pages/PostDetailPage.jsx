import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Divider, CircularProgress } from '@mui/material';
import PostDetailView from '../components/Post/PostDetailView'; // 자식 컴포넌트
import CommentList from '../components/Post/CommentList'; // 자식 컴포넌트
import axiosInstance from '../utils/axiosInstance';
import '../components/styles/PostDetailPage.css';

const PostDetailPage = () => {
  // ...이하 코드는 이전과 동일
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postResponse, commentsResponse] = await Promise.all([
        axiosInstance.get(`/posts/${postId}`),
        axiosInstance.get(`/posts/${postId}/comments`)
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
      setError(null);
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        alert('게시글이 삭제되었습니다.');
        navigate('/posts');
      } catch (err) {
        alert('게시글 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="md" className="post-detail-page-container">
      {post && <PostDetailView post={post} />}

      <Box className="button-group">
        <Button variant="outlined" onClick={() => navigate('/posts')}>목록</Button>
        <Button variant="contained" onClick={() => navigate(`/posts/edit/${postId}`)}>수정</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>삭제</Button>
      </Box>

      <Divider className="divider" />
      
      <CommentList comments={comments} postId={postId} onCommentAdded={fetchData} />
    </Container>
  );
};

export default PostDetailPage;