import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";

import FormBuilderPage from "./pages/FormBuilderPage";

import AnswerFormPage from "./pages/AnswerFormPage";
import CompletePage from "./pages/CompletePage";

import ResponsesPage from "./pages/ResponsesPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/loading" element={<LoadingPage />} />

                <Route path="/forms/edit/:formId" element={<FormBuilderPage />} />

                <Route path="/forms/answer/:formId" element={<AnswerFormPage />} />
                <Route path="/forms/answer/complete" element={<CompletePage />} />

                <Route path="/forms/responses/:formId" element={<ResponsesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
