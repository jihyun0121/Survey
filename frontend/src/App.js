import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";

import FormBuilderPage from "./pages/FormBuilderPage";

// import AnswerPage from "./pages/AnswerPage";
// import ResponseSummaryPage from "./components/response/SummaryTab";
// import ResponseByQuestionPage from "./components/response/QuestionTab";
// import ResponseByIndividualPage from "./components/response/ResponseByIndividualPage";

import AnswerFormPage from "./pages/AnswerFormPage";
import ResponsesPage from "./pages/ResponsesPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/loading" element={<LoadingPage />} />

                {/* <Route path="/forms/new" element={<FormCreatePage />} /> */}
                <Route path="/forms/:formId/edit" element={<FormBuilderPage />} />

                <Route path="/forms/answer/:formId" element={<AnswerFormPage />} />
                <Route path="/forms/responses/:formId" element={<ResponsesPage />} />

                {/* <Route path="/forms/:formId/responses/summary" element={<ResponseSummaryPage />} />
                <Route path="/forms/:formId/responses/questions" element={<ResponseByQuestionPage />} />
                <Route path="/forms/:formId/responses/individual" element={<ResponseByIndividualPage />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
