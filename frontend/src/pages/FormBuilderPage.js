import React, { useEffect, useState, useRef } from "react";
import { FormAPI, QuestionAPI } from "../api/api";
import BuilderHeader from "../components/editor/BuilderHeader";
import FormTitleEditor from "../components/editor/FormTitleEditor";
import QuestionItem from "../components/editor/QuestionItem";
import FloatingMenu from "../components/editor/FloatingMenu";
import { useParams } from "react-router-dom";
import Sortable from "sortablejs";

export default function FormBuilderPage() {
    const { formId } = useParams();

    const [form, setForm] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [focusedQuestionId, setFocusedQuestionId] = useState(null);

    const listRef = useRef(null);

    useEffect(() => {
        loadForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));

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
                question_content: "",
                question_type: "SHORT",
                question_order: questions.length + 1,
                form_id: formId,
            };

            const newQ = await QuestionAPI.createQuestion(dto);
            const created = newQ.data ?? newQ;

            setQuestions((prev) => [...prev, created]);
            setFocusedQuestionId(created.question_id);
        } catch (err) {
            console.error(err);
            alert("질문 생성 실패");
        }
    }

    function updateQuestionLocal(qid, changes) {
        setQuestions((prev) => prev.map((q) => (q.question_id === qid ? { ...q, ...changes } : q)));
    }

    function handleDeleteQuestion(id) {
        QuestionAPI.deleteQuestion(id)
            .then(loadForm)
            .catch(() => alert("질문 삭제 실패"));
    }

    useEffect(() => {
        if (!listRef.current) return;

        const sortable = Sortable.create(listRef.current, {
            animation: 150,
            handle: ".drag-handle",
            draggable: ".block-question-card",

            onEnd: async (evt) => {
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;

                setQuestions((prev) => {
                    const newList = [...prev];
                    const [moved] = newList.splice(oldIndex, 1);
                    newList.splice(newIndex, 0, moved);

                    return newList.map((q, index) => ({
                        ...q,
                        question_order: index + 1,
                    }));
                });

                const movedQuestion = questions[oldIndex];

                try {
                    await QuestionAPI.reorderQuestions({
                        question_id: movedQuestion.question_id,
                        question_order: newIndex + 1,
                    });
                } catch (err) {
                    console.error("순서 변경 실패", err);
                }
            },
        });

        return () => sortable.destroy();
    }, [questions]);

    return (
        <div className="builder-container">
            <BuilderHeader form={form} />
            <div className="builder-wrapper container">
                <main>
                    <FormTitleEditor title={form?.title} description={form?.description} onChangeTitle={(v, blur) => handleUpdateForm("title", v, blur)} onChangeDescription={(v, blur) => handleUpdateForm("description", v, blur)} />

                    <section className="question-list" ref={listRef}>
                        {questions.map((q) => (
                            <QuestionItem key={q.question_id} question={q} onLocalChange={updateQuestionLocal} onDelete={handleDeleteQuestion} autoFocus={q.question_id === focusedQuestionId} />
                        ))}
                    </section>

                    <FloatingMenu handleAddQuestion={handleAddQuestion} />
                </main>
            </div>
        </div>
    );
}
