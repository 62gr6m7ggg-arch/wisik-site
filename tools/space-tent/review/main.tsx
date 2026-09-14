import React from 'react';
import {createRoot} from 'react-dom/client';
import Review from './review';
import '../app/globals.css';
import '../app/construction-selection.css';
import '../app/explanation-audio.css';
import './review.css';
createRoot(document.getElementById('root')!).render(<Review/>);
