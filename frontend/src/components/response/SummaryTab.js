import SummaryItemCard from "./SummaryItemCard";

export default function SummaryTab({ questions, answers }) {
    if (!questions || questions.length === 0) {
        return (
            <section className="summary-section text-center text-muted-none mt-3">
                <span>질문이 없습니다</span>
            </section>
        );
    }

    return (
        <div className="summary-tab-container">
            {questions.map((q) => (
                <SummaryItemCard key={q.question_id} question={q} allAnswers={answers || []} />
            ))}
        </div>
    );
}
