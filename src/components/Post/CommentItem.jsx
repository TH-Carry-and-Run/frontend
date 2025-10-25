// 댓글 한 개씩의 내용 보여줌 (수정/삭제 버튼 포함)

import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Button } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import './CommentItem.css';

const CommentItem = ({ comment, postId, onCommentDeleted }) => {

  const handleDelete = async () => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/posts/${postId}/comments/${comment.id}`);
        alert('댓글이 삭제되었습니다.');
        onCommentDeleted();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <ListItem alignItems="flex-start" className="comment-item">
      <ListItemAvatar>
        <Avatar alt={comment.author} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="span" variant="body1" fontWeight="bold">
            {comment.author}
          </Typography>
        }
        secondary={
          <>
            <Typography component="p" variant="body2" color="text.primary" className="comment-content">
              {comment.content}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </>
        }
      />
      <Box className="comment-actions">
        {/* TODO: 본인 댓글일 때만 보이도록 로직 추가 */}
        <Button size="small">수정</Button>
        <Button size="small" color="error" onClick={handleDelete}>삭제</Button>
      </Box>
    </ListItem>
  );
};

export default CommentItem;