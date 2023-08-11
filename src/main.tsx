import React from 'react';
import ReactDOM from 'react-dom/client';

import { Toaster } from '@/shared/components/ui/toaster.tsx';

import Router from './Router.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router />
        <Toaster />
    </React.StrictMode>,
);
