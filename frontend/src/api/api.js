import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "서버 요청 중 오류가 발생했습니다.";

        console.error("API 오류:", errorMessage);

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);

export const UserAPI = {
    createUser: (dto) => api.post(`/users/signup`, dto),
    loginUser: (dto) => api.post(`/users/login`, dto),
    oauthLogin: (code) => api.get(`/auth/login/google`, { params: { code } }),
    getUserInfo: (userId) => api.get(`/users/${userId}`),
};

export const FormAPI = {
    createForm: (dto) => api.post(`/forms`, dto),
    getForm: (formId) => api.get(`/forms/${formId}`),
    getFormsByUser: (userId) => api.get(`/forms/user/${userId}`),
    updateForm: (formId, dto) => api.put(`/forms/${formId}`, dto),
    publishForm(formId, isPublic) {
        return api.patch(`/forms/${formId}/publish?isPublic=${isPublic}`, isPublic);
    },
    deleteForm: (formId) => api.delete(`/forms/${formId}`),
};

export const QuestionAPI = {
    createQuestion: (dto) => api.post(`/questions`, dto),
    getQuestion: (questionId) => api.get(`/questions/${questionId}`),
    getQuestionsByForm: (formId) => api.get(`/forms/${formId}/questions`),
    updateQuestion: (questionId, dto) => api.put(`/questions/${questionId}`, dto),
    setRequired(questionId, isRequired) {
        return api.patch(`/questions/${questionId}/required?isRequired=${isRequired}`);
    },
    reorderQuestions: (dto) => api.patch(`/questions/order`, dto),
    deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`),

    createOption: (dto) => api.post(`/options`, dto),
    getOption: (optionId) => api.get(`/options/${optionId}`),
    getOptionsByQuestion: (questionId) => api.get(`/questions/${questionId}/options`),
    updateOption: (optionId, dto) => api.put(`/options/${optionId}`, dto),
    reorderOptions: (dto) => api.patch(`/options/order`, dto),
    deleteOption: (optionId) => api.delete(`/options/${optionId}`),
};

export const AnswerAPI = {
    createAnswer: (dto) => api.post(`/answers`, dto),
    getAnswer: (answerId) => api.get(`/answers/${answerId}`),
    getAnswersByQuestion: (questionId) => api.get(`/questions/${questionId}/answers`),
    getAnswersByForm: (formId) => api.get(`/forms/${formId}/answers`),
    getUserAnswerForForm: (userId, formId) => api.get(`/answers/user/${userId}/forms/${formId}`),
    deleteAnswer: (userId) => api.delete(`/answers/${userId}`),
};

export const StatisticAPI = {
    getSurveyHistory: (userId) => api.get(`/answers/user/${userId}/forms`),
    getAnswerCount: (questionId) => api.get(`/statistics/questions/${questionId}/count`),
    getUnansweredCount: (questionId) => api.get(`/statistics/questions/${questionId}/unanswered`),
    getFormStatistics: (formId) => api.get(`/statistics/forms/${formId}`),
    getOptionStats: (questionId) => api.get(`/statistics/questions/${questionId}/options`),
    getCheckboxGroupStats: (questionId) => api.get(`/statistics/questions/${questionId}/checkbox`),
    getTextAnswers: (questionId) => api.get(`/statistics/questions/${questionId}/text`),
    getDuplicateCount: (questionId) => api.get(`/statistics/questions/${questionId}/duplicate`),
    streamLiveStats: (formId) => api.get(`/statistics/forms/${formId}/live`),
    getCodedData: (formId) => api.get(`/statistics/forms/${formId}/coded`),
    downloadExcel: (formId) => api.get(`/statistics/forms/${formId}/export/xls`, { responseType: "blob" }),
    downloadCSV: (formId) => api.get(`/statistics/forms/${formId}/export/csv`, { responseType: "blob" }),
};

export default api;
