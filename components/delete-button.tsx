"use client";

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="admin-button admin-button--danger"
      onClick={(event) => {
        if (!window.confirm("Delete this item? This action cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
