'use client';
import { SliderProvider } from '../context/SliderContext'; 

export default function ClientOnlyLayout({ children }) {
  return (
    <SliderProvider>
      {children}
    </SliderProvider>
  );
}
