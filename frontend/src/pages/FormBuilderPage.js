import React, { useEffect, useState } from "react";
import { FormAPI, QuestionAPI } from "../api/api";
import BuilderHeader from "../components/editor/BuilderHeader";
import FormTitleEditor from "../components/editor/FormTitleEditor";
import QuestionItem from "../components/editor/QuestionItem";
import FloatingMenu from "../components/editor/FloatingMenu";
import { useParams } from "react-router-dom";

export default function FormBuilderPage() {
    const { formId } = useParams();

    const [form, setForm] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        loadForm();
    }, [formId]);

    async function loadForm() {
        try {
            const formData = await FormAPI.getForm(formId);
            console.log(formData);
            setForm(formData.data);

            const res = await QuestionAPI.getQuestionsByForm(formId);
            console.log(res.data);
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
            alert("폼을 불러오는 중 오류가 발생했습니다.");
        }
    }

    async function handleUpdateForm(field, value, isBlur) {
        setForm({ ...form, [field]: value });

        if (isBlur) {
            try {
                await FormAPI.updateForm(formId, { [field]: value });
            } catch (err) {
                alert("폼 업데이트 실패");
            }
        }
    }

    async function handleAddQuestion() {
        try {
            const dto = {
                question_name: `Q${questions.length + 1}`,
                question_content: "",
                question_type: "SHORT",
                question_order: questions.length + 1,
                form_id: formId,
            };

            const newQ = await QuestionAPI.createQuestion(dto);
            setQuestions([...questions, newQ]);
        } catch (err) {
            alert("질문 생성 실패");
        }
    }

    function updateQuestionLocal(qid, changes) {
        setQuestions((prev) => prev.map((q) => (q.question_id === qid ? { ...q, ...changes } : q)));
    }

    function handleDeleteQuestion(id) {
        QuestionAPI.deleteQuestion(id).then(loadForm);
    }

    return (
        <div className="builder-container">
            <BuilderHeader form={form} />
            <div className="builder-wrapper container">
                <main>
                    <FormTitleEditor title={form?.title} description={form?.description} onChangeTitle={(v, blur) => handleUpdateForm("title", v, blur)} onChangeDescription={(v, blur) => handleUpdateForm("description", v, blur)} />

                    <section className="question-list">
                        {questions.map((q) => (
                            <QuestionItem key={q.question_id} question={q} onLocalChange={updateQuestionLocal} onDelete={handleDeleteQuestion} />
                        ))}
                    </section>
                    <FloatingMenu handleAddQuestion={handleAddQuestion} />
                </main>
            </div>
        </div>
    );
}
