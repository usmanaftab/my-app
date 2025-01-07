import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatService, Message } from '../services/chatService';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  Button,
  Theme,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageBubble = styled('div')<{ isUser: boolean }>(({ theme, isUser }) => ({
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  padding: '8px 16px',
  borderRadius: '12px',
  maxWidth: '70%',
  marginLeft: isUser ? 'auto' : '0',
  marginRight: isUser ? '0' : 'auto',
  wordWrap: 'break-word',
}));

const MessageContainer = styled(ListItem)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  padding: '8px 16px',
});

const MessageHeader = styled('div')({
  fontSize: '0.8rem',
  color: '#666',
  marginBottom: '4px',
  display: 'flex',
  justifyContent: 'space-between',
});

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { isAuthenticated, user , token } = useAuth();
  const userName = user?.fullName() || 'Anonymous'; // You can replace this with actual user name from your auth system
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load messages from localStorage when component mounts
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" />;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        setIsLoading(true);
        const userMessage: Message = {
          contextId: '',
          message: newMessage,
          timestamp: Date.now(),
          userName: userName
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        const message = await chatService.sendMessage(newMessage, token);
        setMessages(prevMessages => [...prevMessages, message]);
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{
        height: '70vh',
        mb: 2,
        overflow: 'auto',
        p: 2,
        backgroundColor: '#f5f5f5',
      }}>
        <List>
          {messages.map((message) => (
            <MessageContainer key={message.contextId}>
              <MessageHeader>
                <span style={{ order: message.userName !== 'LLM (llama3.2)' ? 2 : 1 }}>{message.userName}</span>
                <span style={{ order: message.userName !== 'LLM (llama3.2)' ? 1 : 2 }}>{new Date(message.timestamp).toLocaleTimeString()}</span>
              </MessageHeader>
              <MessageBubble isUser={message.userName !== 'LLM (llama3.2)'}>
                {message.message}
              </MessageBubble>
            </MessageContainer>
          ))}
        </List>
      </Paper>
      <form onSubmit={handleSendMessage}>
        <Box sx={{ display: 'flex', gap: 1, position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: 'white',
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!newMessage.trim() || isLoading}
            sx={{
              borderRadius: '20px',
              px: 3,
              minWidth: '100px',
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default Chat;