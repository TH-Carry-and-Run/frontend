// 글을 작성하거나 수정할 때 사용하는 '입력 폼'

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import './PostEditorForm.css';

const PostEditorForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    onSubmit({ title, content });
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate>
      <TextField
        label="제목"
        variant="outlined"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-field"
      />
      <TextField
        label="내용"
        variant="outlined"
        fullWidth
        required
        multiline
        rows={15}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-field"
      />
      <Box className="button-container">
        <Button type="submit" variant="contained" size="large">
          {initialData ? '수정하기' : '작성하기'}
        </Button>
      </Box>
    </Box>
  );
};

export default PostEditorForm;