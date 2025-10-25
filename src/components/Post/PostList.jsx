import React from 'react';
import PostItem from './PostItem';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './PostList.css';

// props로 pinnedPosts를 추가로 받습니다.
const PostList = ({ pinnedPosts = [], posts = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        {/* ... TableHead ... */}
        <TableBody>
          {/* 상단 고정 글을 먼저 표시 (배경색 등으로 구분) */}
          {pinnedPosts.map((post) => (
            <PostItem key={`pinned-${post.id}`} post={post} isPinned={true} />
          ))}
          {/* 일반 글 표시 */}
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default PostList;