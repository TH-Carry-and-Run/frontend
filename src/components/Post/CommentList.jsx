// PostDetailPage로부터 댓글 데이터만 받아 댓글 목록 전체를 보여주는 역할 (각 댓글 아이템 보여줌)

import React from 'react';
import { Box, Typography, List, Divider } from '@mui/material';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './CommentList.css';

const CommentList = ({ comments, postId, onCommentAdded }) => {
  return (
    <Box className="comment-section">
      <Typography variant="h6" gutterBottom>
        댓글 ({comments.length})
      </Typography>
      
      <CommentForm postId={postId} onCommentAdded={onCommentAdded} />
      
      <List sx={{ width: '100%' }}>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <CommentItem comment={comment} postId={postId} onCommentDeleted={onCommentAdded}/>
            {index < comments.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            아직 댓글이 없습니다.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default CommentList;