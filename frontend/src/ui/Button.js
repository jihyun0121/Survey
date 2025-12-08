export default function Button({ children, loading = false, loadText = "처리중...", variant = "primary", className = "", ...props }) {
    const variantClass = `btn btn-${variant}`;

    return (
        <button className={`${variantClass} ${className}`} disabled={loading} {...props}>
            {loading ? loadText : children}
        </button>
    );
}
