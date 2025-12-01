import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import ResponsesHeader from "../components/response/ResponsesHeader";
import SummaryTab from "../components/response/SummaryTab";
import QuestionTab from "../components/response/QuestionTab";
import IndividualTab from "../components/response/IndividualTab";

import { AnswerAPI, QuestionAPI, StatisticAPI } from "../api/api";

export default function ResponsesPage() {
    const { formId } = useParams();

    const [activeTab, setActiveTab] = useState("summary");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [formStats, setFormStats] = useState(null);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    async function loadData() {
        const q = await QuestionAPI.getQuestionsByForm(formId);
        setQuestions(q.data);

        const a = await AnswerAPI.getAnswersByForm(formId);
        setAnswers(a.data); // 배열  유지

        const s = await StatisticAPI.getFormStatistics(formId);
        setFormStats(s.data); // 객체 저장
    }

    const Respondent = formStats?.respondent ?? 0;

    return (
        <div className="responses-container">
            <div className="builder-header border-bottom bg-white">
                <Navbar showBack={true} />
            </div>
            <div className="responses-wrapper">
                <ResponsesHeader Respondent={Respondent} activeTab={activeTab} onChangeTab={setActiveTab} formId={Number(formId)} />

                {activeTab === "summary" && <SummaryTab formId={Number(formId)} questions={questions} answers={answers} />}

                {activeTab === "question" && <QuestionTab formId={Number(formId)} questions={questions} answers={answers} />}

                {activeTab === "individual" && <IndividualTab formId={Number(formId)} responses={answers} setResponses={setAnswers} questions={questions} />}
            </div>
        </div>
    );
}
