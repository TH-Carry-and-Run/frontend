// 새 댓글을 작성하는 입력 폼과 '등록' 버튼

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import './CommentForm.css';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await axiosInstance.post(`/posts/${postId}/comments`, { content });
      setContent('');
      onCommentAdded();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="comment-form-container">
      <TextField
        label="댓글을 입력하세요"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit" variant="contained" className="comment-submit-button">
        등록
      </Button>
    </Box>
  );
};

export default CommentForm;