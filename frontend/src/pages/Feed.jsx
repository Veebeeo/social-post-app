import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Card, Typography, Avatar, Button, TextField, 
  IconButton, Divider, InputAdornment, Menu, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PhotoCamera, Send, FavoriteBorder, ChatBubbleOutlined, 
  ShareOutlined, Search, NotificationsNone, DarkModeOutlined, MoreVert
} from '@mui/icons-material';
import axios from 'axios';


export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const token = localStorage.getItem('token');
  const currentUsername = token ? JSON.parse(atob(token.split('.')[1])).username : '';

  // Menu State 
  const [anchorEl, setAnchorEl] = useState(null);
  const [activePost, setActivePost] = useState(null);

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPostData, setEditPostData] = useState({ id: '', text: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://social-post-app-u6t2.onrender.com/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePostSubmit = async () => {
    if (!postText && !imageFile) return;

    const formData = new FormData();
    formData.append('text', postText);
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.post('https://social-post-app-u6t2.onrender.com/api/posts', formData, {
        headers: { 
          
          'Authorization': `Bearer ${token}` 
        }
      });
      setPostText('');
      setImageFile(null);
      setImagePreview(null);
      fetchPosts(); // Refresh feed
    } catch (err) {
      console.error('Error creating post', err);
      err.status(500).json({ message: err.message || 'Server Error during upload' });
    }
  };
  //Menu Handlers
  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setActivePost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActivePost(null);
  };

  // --- Delete Handler ---
  const handleDeletePost = async () => {
    try {
      await axios.delete(`https://social-post-app-u6t2.onrender.com/api/posts/${activePost._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      handleMenuClose();
      fetchPosts(); // Refresh feed after deleting
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  // --- Edit Handlers ---
  const handleOpenEditDialog = () => {
    setEditPostData({ id: activePost._id, text: activePost.text || '' });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`https://social-post-app-u6t2.onrender.com/api/posts/${editPostData.id}`, 
        { text: editPostData.text }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setEditDialogOpen(false);
      fetchPosts(); // Refresh feed after editing
    } catch (err) {
      console.error('Error editing post', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`https://social-post-app-u6t2.onrender.com/api/posts/${postId}/like`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return;

    try {
      await axios.post(`https://social-post-app-u6t2.onrender.com/api/posts/${postId}/comment`, { text }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
      fetchPosts();
    } catch (err) {
      console.error('Error commenting', err);
    }
  };
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId] 
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Deletes the saved session
    navigate('/login'); // Redirects back to the login screen
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 3, pb: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
      
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Social</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          <IconButton size="small"><NotificationsNone /></IconButton>
          <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main' }}>
            {currentUsername.charAt(0).toUpperCase()}
          </Avatar>

          <IconButton onClick={handleLogout} color="error" size="small">
            <Logout />
          </IconButton>
          
        </Box>
      </Box>

      {/* Search Bar */}
      <TextField 
        fullWidth 
        placeholder="Search promotions, users..." 
        size="small"
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: 'white' } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}><Search fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ ml: 1 }}><DarkModeOutlined fontSize="small" /></IconButton>
              <Avatar sx={{ width: 24, height: 24, ml: 1,mb: 3, bgcolor: '#FF9800' }}>U</Avatar>
            </InputAdornment>
          ),
        }}
      />

      
      <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Box mb={3}>
          <Typography fontWeight="bold" variant="h5" mb={3}>Create Post</Typography>
          <Box display="flex" gap={2} sx={{ mt: 1.5 }}>
            <Button variant="contained" size="small" sx={{ borderRadius: 20, mr: 2 }}>All Posts</Button>
            <Button variant="outlined" color="inherit" size="small" sx={{ borderRadius: 20, border: 'none', bgcolor: '#F0F2F5' }}>Promotions</Button>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="What's on your mind?" 
          variant="standard"
          InputProps={{ disableUnderline: true }}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          sx={{ mb: 3 }}   
        />

        {imagePreview && (
          <Box mb={3}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </Box>
        )}

        
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
            <label htmlFor="icon-button-file" style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="primary" component="span"><PhotoCamera /></IconButton>
            </label>
          </Box>
          <Button 
            variant="contained" 
            endIcon={<Send />} 
            onClick={handlePostSubmit}
            disabled={!postText && !imageFile}
            sx={{ borderRadius: 20, textTransform: 'none', px: 3 }}
          >
            Post
          </Button>
        </Box>
      </Card>

      

      {/* Feed List */}
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', p:2 }}>
          
          {/* Main Content Wrapper with Padding */}
          <Box p={2.5} sx={{ position: 'relative' }}> 
            
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} sx={{width:'100%'}}>
              
              {/* Left side: Avatar and Clean User Info */}
              <Box display="flex" flexDirection="row" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#1877F2', color: 'white', width: 40, height: 40 }}>
                  {post.username.charAt(0).toUpperCase()}
                </Avatar>
                
                
                <Box display="flex" flexDirection="column">
                  <Typography fontWeight="bold" variant="body1" lineHeight={1.2}>
                    {post.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    @{post.username} • {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Right side: Pinned to top-right corner */}
              {currentUsername !== post.username ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, borderRadius: 20, py: 0.5, px: 2, textTransform: 'none' }}
                >
                  Follow
                </Button>
              ) : (
                <IconButton
                  onClick={(e) => handleMenuOpen(e, post)}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, p: 0.5 }}
                >
                  <MoreVert />
                </IconButton>
              )}
            </Box>

            {post.text && <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>{post.text}</Typography>}
          </Box>

          {post.imageUrl && (
            <Box px={2.5} pb={2}>
               <img 
                 src={post.imageUrl} 
                 alt="Post Content" 
                 style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
               />
            </Box>
          )}

          <Divider />

          
          <Box display="flex" justifyContent="space-around" alignItems="center" px={2.5} py={1}>
            <Button 
              startIcon={<FavoriteBorder color={post.likes.includes(currentUsername) ? "primary" : "inherit"} />} 
              onClick={() => handleLike(post._id)}
              color="inherit"
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              {post.likes.length}
            </Button>
            {/* 3. TRIGGER VISIBILITY ON CLICK */}
            <Button 
              startIcon={<ChatBubbleOutlined color={expandedComments[post._id] ? "primary" : "inherit"} />} 
              onClick={() => toggleComments(post._id)}
              color="inherit" 
              sx={{ color: expandedComments[post._id] ? 'primary.main' : 'text.secondary', textTransform: 'none' }}
            >
              {post.comments.length}
            </Button>

            <Button startIcon={<ShareOutlined />} color="inherit" sx={{ color: 'text.secondary', textTransform: 'none' }}>
              0
            </Button>
          </Box>

          {/* 4. WRAP COMMENT INPUT & LIST IN CONDITIONAL LOGIC */}
          {expandedComments[post._id] && (
            <Box>
              {/* Comment Input */}
              <Box px={2.5} pb={2} pt={1} display="flex" gap={1.5} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#F0F2F5' } }}
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                />
                <IconButton color="primary" onClick={() => handleCommentSubmit(post._id)}>
                  <Send fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Comments List */}
              {post.comments.length > 0 && (
                <Box px={2.5} pb={2.5} display="flex" mb={1} flexDirection="column" gap={1}> 
                  {post.comments.map((c, i) => (
                    <Box key={i} sx={{ bgcolor: '#F0F2F5', borderRadius: '12px', py: 1, px: 2, alignSelf: 'flex-start', maxWidth: '90%', mb:1 }}>
                      <Typography variant="body2">
                        <strong style={{ color: '#050505' }}>{c.username}:</strong> {c.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, mt: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={handleOpenEditDialog}>Edit Post</MenuItem>
        <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>Delete Post</MenuItem>
      </Menu>

      {/* Mui Dialog for Editing  */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle fontWeight="bold">Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            placeholder="What's on your mind?"
            value={editPostData.text}
            onChange={(e) => setEditPostData({ ...editPostData, text: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ borderRadius: 20, textTransform: 'none' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
   
    </Container>
  );
}