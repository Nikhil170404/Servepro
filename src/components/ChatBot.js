import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Paper,
  List,
  ListItem,
  Typography,
  Avatar,
  useTheme,
  Container,
  AppBar,
  Toolbar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getBotResponse } from '../utils/chatbotResponses';
import { chatbotLearning } from '../utils/chatbotLearning';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user?.uid) return;

    const messagesQuery = query(
      collection(db, 'chatMessages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          message: typeof data.message === 'string' ? data.message : data.message.text,
          sender: data.sender,
          timestamp: data.timestamp,
          sentiment: data.sentiment
        };
      });

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFeedback = async (messageId, isHelpful) => {
    try {
      const messageRef = doc(db, 'chatMessages', messageId);
      const feedbackData = {
        helpful: isHelpful,
        timestamp: serverTimestamp(),
        userId: user.uid
      };

      await updateDoc(messageRef, { feedback: feedbackData });

      const messageDoc = messages.find(m => m.id === messageId);
      if (messageDoc) {
        const prevUserMessage = messages
          .slice(0, messages.findIndex(m => m.id === messageId))
          .reverse()
          .find(m => m.sender === 'user');

        if (prevUserMessage) {
          await chatbotLearning.learnFromInteraction(
            prevUserMessage.message,
            messageDoc.message,
            { 
              rating: isHelpful ? 1 : 0,
              sentiment: messageDoc.sentiment,
              context: messages.slice(-3).map(m => m.message)
            }
          );
        }
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError('Failed to save feedback. Please try again.');
    }
  };

  const handleBotResponse = async (userMessage) => {
    try {
      setTyping(true);
      const botResponse = await getBotResponse(userMessage);
      const responseText = typeof botResponse === 'string' ? botResponse : botResponse.text;

      const messageDoc = {
        userId: user.uid,
        message: responseText,
        sender: 'bot',
        timestamp: serverTimestamp(),
        sentiment: chatbotLearning.analyzeSentiment(userMessage)
      };

      await addDoc(collection(db, 'chatMessages'), messageDoc);
      return responseText;
    } catch (error) {
      console.error('Error getting bot response:', error);
      throw error;
    } finally {
      setTyping(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading || !user?.uid) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    setError(null);

    try {
      // Add user message
      await addDoc(collection(db, 'chatMessages'), {
        userId: user.uid,
        message: userMessage,
        sender: 'user',
        timestamp: serverTimestamp()
      });

      // Get and add bot response
      await handleBotResponse(userMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setMessage(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat Support
          </Typography>
          <Tooltip title="AI Learning Active">
            <IconButton color="inherit">
              <PsychologyIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}
        >
          <List sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            {error && (
              <ListItem>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: theme.palette.error.light,
                    color: theme.palette.error.contrastText,
                    width: '100%',
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Paper>
              </ListItem>
            )}

            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  gap: 1,
                  px: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.sender === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.secondary.main
                  }}
                >
                  {msg.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: msg.sender === 'user'
                        ? theme.palette.primary.main
                        : theme.palette.grey[100],
                      color: msg.sender === 'user'
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary
                    }}
                  >
                    <Typography variant="body1">
                      {typeof msg.message === 'string' ? msg.message : 'Error: Invalid message format'}
                    </Typography>
                  </Paper>
                  {msg.sender === 'bot' && (
                    <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleFeedback(msg.id, true)}
                        sx={{ color: theme.palette.success.main }}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleFeedback(msg.id, false)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <ThumbDownIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}

            {typing && (
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="textSecondary">
                    Assistant is typing...
                  </Typography>
                </Box>
              </ListItem>
            )}

            <div ref={messagesEndRef} />
          </List>

          <Box 
            component="form" 
            onSubmit={handleSend}
            sx={{ 
              p: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading || typing}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
              />
              <IconButton
                type="submit"
                disabled={!message.trim() || loading || typing}
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.action.disabledBackground
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatBot;
