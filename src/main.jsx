import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CssBaseline from '@mui/material/CssBaseline';




import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthContext, AuthContextProvider } from './context/AuthContext.jsx';
import SideBar from './Components/SideBar/SideBar.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import QuestionIndex from './pages/QuestionIndex/QuestionIndex.jsx';
import { UserAPIContext } from './context/UserAPIContext.jsx';
import QuestionsSelected from './pages/SurveyIndex/QuestionsSelected.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <CssBaseline />
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
  </React.StrictMode>,
)
