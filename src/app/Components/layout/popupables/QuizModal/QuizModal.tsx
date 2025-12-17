'use client';

import { useRef } from 'react';

type Payload = {
    name: string;
    email: string;
    message: string;
};

export default function ModalForm() {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload: Payload = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            message: String(formData.get('message') ?? ''),
        };

        console.log('Submitted:', payload);

        e.currentTarget.reset();
        closeModal();
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
            >
                Open modal
            </button>

            <dialog
                ref={dialogRef}
                className="
          fixed inset-0 m-0
          flex items-center justify-center
          backdrop:bg-black/50
        "
                onClick={(e) => {
                    // Close only when clicking backdrop
                    if (e.target === e.currentTarget) closeModal();
                }}
            >
                {/* Modal Card */}
                <div className="w-[min(92vw,520px)] rounded-xl bg-white shadow-xl">
                    {/* Header */}
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

                    {/* Form */}
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
            </dialog>
        </>
    );
}
