'use client';

import React, { useEffect, useRef, useState } from 'react';

type Payload = {
    name: string;
    email: string;
    message: string;
};

export default function ModalForm() {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // When we set open=true, mount the dialog and open it natively
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!open || !dialog) return;

        // showModal() can throw if called twice; guard it.
        if (!dialog.open) dialog.showModal();
    }, [open]);

    const closeModal = () => {
        const dialog = dialogRef.current;
        if (dialog?.open) dialog.close();
        setOpen(false);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const payload: Payload = {
            name: String(fd.get('name') ?? ''),
            email: String(fd.get('email') ?? ''),
            message: String(fd.get('message') ?? ''),
        };

        console.log('Submitted:', payload);

        e.currentTarget.reset();
        closeModal();
    };

    return (
        <>
            <h2>Benieuwd welk keuzedeel bij jou past?</h2>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 mb-3"
            >
                Doe de Quiz
            </button>

            {open && (
                <dialog
                    ref={dialogRef}
                    className="            fixed top-0 left-1/2
            -translate-x-1/2
            m-0 p-0
            bg-transparent
            backdrop:bg-black/50
"
                    onClose={() => setOpen(false)}
                    onClick={(e) => {
                        // Click on backdrop closes (only if click hits the dialog itself)
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    {/* Center wrapper */}
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* Modal card */}
                        <div className="w-[min(92vw,520px)] rounded-xl bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b px-5 py-4">
                                <h2 className="text-lg font-semibold">Contact</h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    aria-label="Close modal"
                                    className="rounded-md p-2 hover:bg-black/5"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-4 px-5 py-4">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="w-full resize-none rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                                        placeholder="What can we help with?"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-md border px-4 py-2 hover:bg-black/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-md bg-black px-4 py-2 font-medium text-white hover:opacity-90"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
