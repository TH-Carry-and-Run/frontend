import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import PostEditorForm from '../components/Post/PostEditorForm'; // 이 부분만 남깁니다.
import axiosInstance from '../utils/axiosInstance';
import '../components/styles/PostEditorPage.css';

const PostEditorPage = () => {
  // ...이하 코드는 이전과 동일
  const { postId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(postId);

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchPostForEdit = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(`/api/posts/${postId}`);
          setInitialData(response.data);
        } catch (error) {
          console.error("게시글 정보를 불러오지 못했습니다.", error);
          navigate('/posts');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPostForEdit();
    }
  }, [isEditMode, postId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await axiosInstance.put(`/posts/${postId}`, formData);
        alert('게시글이 수정되었습니다.');
        navigate(`/posts/${postId}`);
      } else {
        const response = await axiosInstance.post('/posts', formData);
        alert('게시글이 작성되었습니다.');
        navigate(`/posts/${response.data.id}`);
      }
    } catch (error) {
      console.error("게시글 처리 중 오류가 발생했습니다.", error);
      alert("오류가 발생했습니다.");
    }
  };

  if (isEditMode && (isLoading || !initialData)) {
    return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="md" className="post-editor-page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? '게시글 수정' : '새 글 작성'}
      </Typography>
      <PostEditorForm initialData={initialData} onSubmit={handleSubmit} />
    </Container>
  );
};

export default PostEditorPage;