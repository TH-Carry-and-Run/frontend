import React from 'react';
import { TableRow, TableCell, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
  const navigate = useNavigate();

  return (
    <TableRow hover onClick={() => navigate(`/posts/${post.id}`)} className="post-item-row">
      <TableCell align="center">{post.id}</TableCell>
      <TableCell>
        <MuiLink component={RouterLink} to={`/posts/${post.id}`} underline="hover">
          {post.title}
        </MuiLink>
      </TableCell>
      <TableCell align="center">{post.author}</TableCell>
      <TableCell align="center">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="center">{post.viewCount}</TableCell>
      <TableCell align="center">{post.likeCount}</TableCell>
    </TableRow>
  );
};

export default PostItem;