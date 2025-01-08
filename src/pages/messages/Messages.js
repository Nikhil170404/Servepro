import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        content: newMessage,
        timestamp: serverTimestamp(),
        sender: 'user'
      });
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                      {message.sender === 'user' ? user.email[0].toUpperCase() : 'S'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.sender === 'user' ? 'You' : 'Support'}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {message.content}
                        </Typography>
                        {message.timestamp && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5 }}
                            color="text.secondary"
                          >
                            {message.timestamp.toDate().toLocaleString()}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Messages;
