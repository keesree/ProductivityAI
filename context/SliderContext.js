'use client';
// context/SliderContext.js
import React, { createContext, useState, useContext } from 'react';

const SliderContext = createContext();

export function SliderProvider({ children }) {
  const [sliderValue, setSliderValue] = useState(30);

  return (
    <SliderContext.Provider value={{ sliderValue, setSliderValue }}>
      {children}
    </SliderContext.Provider>
  );
}

export function useSlider() {
  return useContext(SliderContext);
}
