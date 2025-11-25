import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
        console.error("API 오류:", message);
        return Promise.reject(error);
    }
);

export const createUser = (dto) => api.post(`/users/signup`, dto);
export const loginUser = (dto) => api.post(`/users/login`, dto);
export const oauthLogin = (dto) => api.get(`/auth/login/google`, dto);
export const getUserInfo = (userId) => api.get(`/users/${userId}`);

export const createForm = (dto) => api.post(`/forms`, dto);
export const getForm = (formId) => api.get(`/forms/${formId}`);
export const getFormsByUser = (userId) => api.get(`/forms/user/${userId}`);
export const updateForm = (formId, dto) => api.put(`/forms/${formId}`, dto);
export const deleteForm = (formId) => api.delete(`/forms/${formId}`);
export const publishForm = (formId, dto) => api.patch(`/forms/${formId}/publish`, dto);

export const createQuestion = (dto) => api.post(`/questions`, dto);
export const getQuestion = (questionId) => api.get(`/questions/${questionId}`);
export const getQuestionsByForm = (formId) => api.get(`/forms/${formId}/questions`);
export const updateQuestion = (questionId, dto) => api.put(`/questions/${questionId}`, dto);
export const reorderQuestions = (dto) => api.patch(`/questions/order`, dto);
export const setRequired = (questionId, dto) => api.patch(`/questions/${questionId}/required`, dto);
export const deleteQuestion = (questionId) => api.delete(`/questions/${questionId}`);

export const createOption = (dto) => api.post(`/options`, dto);
export const getOption = (optionId) => api.get(`/options/${optionId}`);
export const getOptionsByQuestion = (questionId) => api.get(`/questions/${questionId}/options`);
export const updateOption = (optionId, dto) => api.put(`/options/${optionId}`, dto);
export const reorderOptions = (dto) => api.put(`/options/order`, dto);
export const deleteOption = (optionId) => api.delete(`/options/${optionId}`);

export const createAnswer = (dto) => api.post(`/answers`, dto);
export const getAnswer = (answerId) => api.get(`/answers/${answerId}`);
export const getAnswersByQuestion = (questionId) => api.get(`/questions/${questionId}/answers`);
export const getAnswersByForm = (formId) => api.get(`/forms/${formId}/answers`);
export const getUserAnswerForForm = (userId, formId) => api.get(`/answers/user/${userId}/forms/${formId}`);
export const deleteAnswer = (userId) => api.delete(`/answers/${userId}`);

export const getSurveyHistory = (userId) => api.get(`/answers/user/${userId}/forms`);
export const getAnswerCount = (questionId) => api.get(`/statistics/questions/${questionId}/count`);
export const getUnansweredCount = (questionId) => api.get(`/statistics/questions/${questionId}/unanswered`);
export const getFormStatistics = (formId) => api.get(`/statistics/forms/${formId}`);
export const getOptionStats = (questionId) => api.get(`/statistics/questions/${questionId}/options`);
export const getCheckboxGroupStats = (questionId) => api.get(`/statistics/questions/${questionId}/checkbox`);
export const getTextAnswers = (questionId) => api.get(`/statistics/questions/${questionId}/text`);
export const getDuplicateCount = (questionId) => api.get(`/statistics/questions/${questionId}/duplicate`);
export const streamLiveStats = (formId) => api.get(`/statistics/forms/${formId}/live`);
export const getCodedData = (formId) => api.get(`/statistics/forms/${formId}/coded`);
export const downloadExcel = (formId) => api.get(`/statistics/forms/${formId}/export/xls`);
export const downloadCSV = (formId) => api.get(`/statistics/forms/${formId}/export/csv`);
