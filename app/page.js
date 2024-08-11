'use client'
import { Box, Stack, Typography, Button, Slider } from "@mui/material";
import { useState } from 'react';
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
