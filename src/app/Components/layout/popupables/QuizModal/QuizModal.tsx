'use client';

import { useEffect, useRef } from 'react';

type Payload = {
    name: string;
    email: string;
    message: string;
};

export default function ModalForm() {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();

    // Keep React out of the dialog's internal "cancel" behavior (Escape key)
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const onCancel = (e: Event) => {
            // allow closing, but you can intercept here if you want
            // e.preventDefault();
            // closeModal();
        };

        dialog.addEventListener('cancel', onCancel);
        return () => dialog.removeEventListener('cancel', onCancel);
    }, []);

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
        <div>
            <button
                type="button"
                onClick={openModal}
                className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
            >
                Start de quizz
            </button>

            <dialog
                ref={dialogRef}
                className="w-[min(92vw,520px)] rounded-xl p-0 shadow-xl backdrop:bg-black/50"
            >
                {/* Card */}
                <div className="rounded-xl bg-white">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h2 className="text-lg font-semibold">Contact</h2>

                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close"
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
                                required
                                rows={4}
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

                {/* Click-outside to close (backdrop) */}
                <form method="dialog">
                    <button
                        aria-label="Close on backdrop click"
                        className="fixed inset-0 cursor-default"
                    />
                </form>
            </dialog>
        </div>
    );
}
