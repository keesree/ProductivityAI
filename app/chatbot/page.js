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
