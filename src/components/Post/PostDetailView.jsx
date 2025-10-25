// 게시글 상세 내용(제목, 본문 등)을 보여줌

import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import './PostDetailView.css';

const PostDetailView = ({ post }) => {
  return (
    <Paper elevation={2} className="post-detail-paper">
      <Box className="post-header">
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box className="post-meta">
          <Typography variant="subtitle1" color="text.secondary">
            작성자: {post.author}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            작성일: {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box className="post-content">
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PostDetailView;