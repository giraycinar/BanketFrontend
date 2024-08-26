import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import SideBar from "./Components/SideBar/SideBar";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import SurveyIndex from "./pages/SurveyIndex/SurveyIndex";
import { AuthContext } from "./context/AuthContext";
import QuestionIndex from "./pages/QuestionIndex/QuestionIndex";
import UserProfile from "./Components/UserProfile/UserProfile";
import AddManager from "./Components/AddManager/AddManager";
import { UserAPIContextProvider } from "./context/UserAPIContext";
import PasswordUpdate from "./Components/UserProfile/PasswordUpdate";
import DisplaySurvey from "./Components/DisplaySurvey/DisplaySurvey";
import Report from "./pages/Report/Report";
import DetailReport from "./pages/Report/DetailReport";


function App() {
  const { isAuthenticated } = useContext(AuthContext);

  

  return (
    <Router>
      <Routes>
        <Route path="/display-survey" element={<DisplaySurvey />} />
        {!isAuthenticated ? (
          <>
            <Route path="*" element={<LoginPage />} />
          </>
        ) : (
          <>
            <Route path="*" element={
              <>
                <Header />
                <SideBar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/survey-index" element={<SurveyIndex />} />
                  <Route path="/question-index" element={<QuestionIndex />} />
                  <Route path="/report" element={<Report/>} />
                  <Route path="/detail-report" element={<DetailReport/>} />
                  <Route
                    path="/user-profile"
                    element={
                      <UserAPIContextProvider>
                        <UserProfile />
                      </UserAPIContextProvider>
                    }
                  />
                  <Route
                    path="/password-update"
                    element={
                      <UserAPIContextProvider>
                        <PasswordUpdate />
                      </UserAPIContextProvider>
                    }
                  />
                  <Route
                    path="/add-manager"
                    element={
                      <UserAPIContextProvider>
                        <AddManager />
                      </UserAPIContextProvider>
                    }
                  />
                </Routes>
              </>
            } />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;