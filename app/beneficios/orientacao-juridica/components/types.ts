import React from 'react';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}



