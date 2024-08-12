'use client'
import { useSlider } from "@/context/SliderContext";
import { Box, Stack, TextField, Button } from "@mui/material"; 
import { useState } from 'react';

export default function Home() {
  const { sliderValue } = useSlider();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi I am the Productivity Support Agent, we acknowledge your productivity level of ${sliderValue}, and we are here to help you improve this value!` },
  ]);

  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }]);
      setMessage(''); // Clear the input field after sending the message
    }
  };
  const [message,setMessage] = useState('')

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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction="column" width="600px" height="700px" border="1px solid black" p={2} spacing={3}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {Array.isArray(messages) && messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="message" 
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} // Update the input value
          />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
}
