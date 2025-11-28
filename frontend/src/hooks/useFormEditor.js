import { useEffect, useState, useRef, useCallback } from "react";
import Sortable from "sortablejs";
import { FormAPI, QuestionAPI } from "../api/api";

export default function useFormEditor(formId) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);

    const listRef = useRef(null);

    const loadForm = useCallback(async () => {
        try {
            const form = await FormAPI.getForm(formId);

            setTitle(form.title || "");
            setDescription(form.description || "");
            setQuestions(form.questions || []);
        } catch (e) {
            console.error(e);
            alert("폼 정보를 불러오지 못했습니다.");
        }
    }, [formId]);

    const saveTitle = () => {
        FormAPI.updateForm(formId, { title });
    };

    const saveDescription = () => {
        FormAPI.updateForm(formId, { description });
    };

    const addQuestion = async () => {
        try {
            const res = await QuestionAPI.createQuestion({
                form_id: formId,
                question_content: "",
                question_type: "SHORT",
                description: "",
                is_required: false,
                order_num: questions.length + 1,
                options: [],
            });

            const q = res.question ?? res;
            setQuestions((prev) => [...prev, q]);
        } catch (err) {
            console.error(err);
            alert("질문 생성 중 오류");
        }
    };

    const updateQuestion = useCallback(async (questionId, patch) => {
        setQuestions((prev) => prev.map((q) => (q.question_id === questionId ? { ...q, ...patch } : q)));
        await QuestionAPI.updateQuestion(questionId, patch);
    }, []);

    const deleteQuestion = useCallback(async (questionId) => {
        await QuestionAPI.deleteQuestion(questionId);
        setQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
    }, []);

    useEffect(() => {
        if (!listRef.current) return;

        const sortable = Sortable.create(listRef.current, {
            animation: 150,
            handle: ".drag-handle",
            onEnd: async (evt) => {
                const newList = [...questions];
                const [moved] = newList.splice(evt.oldIndex, 1);
                newList.splice(evt.newIndex, 0, moved);

                const reordered = newList.map((q, index) => ({
                    ...q,
                    order_num: index + 1,
                }));

                setQuestions(reordered);

                await QuestionAPI.reorderQuestions(
                    reordered.map((q) => ({
                        question_id: q.question_id,
                        order_num: q.order_num,
                    }))
                );
            },
        });

        return () => sortable.destroy();
    }, [questions]);

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    return {
        title,
        description,
        questions,

        setTitle,
        setDescription,

        saveTitle,
        saveDescription,

        addQuestion,
        updateQuestion,
        deleteQuestion,

        listRef,
    };
}
