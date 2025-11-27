import React from "react";
import Navbar from "../home/Navbar";
import ShareButton from "./ShareButton";
import PublishButton from "./PublishButton";
import PreviewButton from "./PreviewButton";

export default function BuilderHeader({ form }) {
    return (
        <div className="builder-header border-bottom mb-4 bg-white">
            <Navbar showBack={true} />

            <div className="builder-nav navbar navbar-light bg-white">
                <PreviewButton formId={form?.form_id} />
                <ShareButton formId={form?.form_id} />
                <PublishButton formId={form?.form_id} initialPublic={form?.is_public} />
            </div>
        </div>
    );
}
