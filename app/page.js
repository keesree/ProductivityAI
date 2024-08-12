'use client'
import { Box, Stack, Typography, Button, Slider } from "@mui/material";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSlider } from '../context/SliderContext';
import { motion } from 'framer-motion';

export default function Introduction() {
  const { sliderValue, setSliderValue } = useSlider();
  const router = useRouter();

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleButtonClick = () => {
    router.push('/chatbot');
  };
    
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the ProductivityAI assistant. How can I help you today?"
    },
  ])

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

useEffect(() => {
  scrollToBottom()
}, [messages])


  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      sx={{
        background: 'linear-gradient(to right, #e3f2fd, #b3e5fc)', 
        textAlign: 'center',
      }}
    >
      <Stack spacing={4}>
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to Your Productivity Boost!
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Discover how our chatbot can help you stay organized and productive.
          </Typography>
        </motion.div>

        <Box width="60%">
          <Typography gutterBottom>For better assistance, please adjust your productivity level</Typography>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            marks
            min={0}
            max={100}
            sx={{
              color: 'primary.main',
              height: 8,
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: 'primary.main',
                border: '2px solid #fff',
                '&:hover': {
                  boxShadow: '0px 0px 0px 8px rgba(255, 255, 255, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                height: 8,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleButtonClick}
          >
            Start Chatting
          </Button>
        </motion.div>
      </Stack>
    </Box>
  );
}
