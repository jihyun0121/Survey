import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";

// import FormCreatePage from "./pages/FormCreatePage";
import FormBuilderPage from "./pages/FormBuilderPage";

// import AnswerPage from "./pages/AnswerPage";
// import ResponseSummaryPage from "./pages/ResponseSummaryPage";
// import ResponseByQuestionPage from "./pages/ResponseByQuestionPage";
// import ResponseByIndividualPage from "./pages/ResponseByIndividualPage";

// import FormSettingsPage from "./pages/FormSettingsPage";
import AnswerFormPage from "./pages/AnswerFormPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/loading" element={<LoadingPage />} />

                {/* <Route path="/forms/new" element={<FormCreatePage />} /> */}
                <Route path="/forms/:formId/edit" element={<FormBuilderPage />} />

                {/* <Route path="/forms/:formId/answer" element={<AnswerFormPage />} /> */}
                <Route path="/form/answer/1" element={<AnswerFormPage />} />

                {/* <Route path="/forms/:formId/responses/summary" element={<ResponseSummaryPage />} />
                <Route path="/forms/:formId/responses/questions" element={<ResponseByQuestionPage />} />
                <Route path="/forms/:formId/responses/individual" element={<ResponseByIndividualPage />} /> */}

                {/* <Route path="/forms/:formId/settings" element={<FormSettingsPage />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
