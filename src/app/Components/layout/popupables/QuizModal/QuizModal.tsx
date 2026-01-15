'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getApiClient } from '@/app/lib/apiClient';
import type { Question, Answer } from '@/app/types/Quiz';
import type { ApiError } from '@/app/lib/apiClient';
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/app/lib/auth/useAuth";

export default function QuizModal() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [recommendations, setRecommendations] = useState<any>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (isOpen) {
            if (dialog && !dialog.open) {
                dialog.showModal();
            }
            fetchQuestions();
        } else {
            if (dialog?.open) {
                dialog.close();
            }
        }
    }, [isOpen]);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiClient = getApiClient();
            const fetchedData: any[] = await apiClient.getQuestions();

            const transformedQuestions: Question[] = fetchedData.map((q, index) => ({
                _id: q._id || index,
                question: q.question,
                answers: q.quiz_answers,
            }));

            setQuestions(transformedQuestions);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        // Reset state for next time
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuizCompleted(false);
        setQuestions([]);
        setRecommendations(null);
    };

    const handleAnswerSelect = (questionId: number, answerId: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleQuizSubmit();
        }
    };

    const handleQuizSubmit = async () => {
        const quizAnswers: { [key: string]: string } = {};
        Object.keys(selectedAnswers).forEach(qId => {
            const questionId = parseInt(qId, 10);
            const answerId = selectedAnswers[questionId];
            const question = questions.find(q => q._id === questionId);
            const answer = question?.answers.find(a => a.answerId === answerId);

            if (question && answer) {
                const key = question.question.toLowerCase().replace(/\s+/g, '_').replace(/[?]/g, '');
                quizAnswers[key] = answer.text;
            }
        });

        const requestBody = {
            interests_text: "I like backend development with Python and API design",
            preferred_location: "Amsterdam",
            max_difficulty: 3,
            role_include: ["backend", "api"],
            quiz_answers: quizAnswers,
            k: 5
        };

        try {
            setLoading(true);
            const apiClient = getApiClient();
            const recommendations = await apiClient.getRecommendations(requestBody);
            setRecommendations(recommendations);

            if (user && recommendations?.vkm_recommendations) {
                const recommendedIds = recommendations.vkm_recommendations.map((rec: any) => rec._id);
                await apiClient.updateUserRecommendedVKMs(user.sub, recommendedIds);
            }

            setQuizCompleted(true);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to get recommendations.");
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    const renderQuizContent = () => {
        if (loading) return <p>Loading questions...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (quizCompleted) {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quiz Completed!</h3>
                    {recommendations ? (
                        <div>
                            <h4 className="text-lg font-semibold">Recommendations:</h4>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                                {JSON.stringify(recommendations, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <p>Thank you for completing the quiz.</p>
                    )}
                </div>
            );
        }
        if (!currentQuestion) return <p>No questions available.</p>;

        return (
            <div>
                <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                <div className="space-y-2">
                    {Array.isArray(currentQuestion.answers) && currentQuestion.answers.map(answer => (
                        <div
                            key={answer.answerId}
                            onClick={() => handleAnswerSelect(currentQuestion._id, answer.answerId)}
                            className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer ${selectedAnswers[currentQuestion._id] === answer.answerId ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'}`}
                        >
                            <Checkbox
                                id={`q${currentQuestion._id}-a${answer.answerId}`}
                                checked={selectedAnswers[currentQuestion._id] === answer.answerId}
                                onCheckedChange={() => handleAnswerSelect(currentQuestion._id, answer.answerId)}
                            />
                            <label
                                htmlFor={`q${currentQuestion._id}-a${answer.answerId}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {answer.text}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <h2 className="text-4xl mb-2">Benieuwd welk keuzedeel bij jou past?</h2>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 mb-3"
            >
                Doe de Quiz
            </button>

            {isOpen && (
                <dialog
                    ref={dialogRef}
                    className="fixed top-0 left-1/2 -translate-x-1/2 m-0 p-0 bg-transparent backdrop:bg-black/50"
                    onClose={closeModal}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="w-[min(92vw,520px)] rounded-xl bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b px-5 py-4">
                                <h2 className="text-lg font-semibold">Keuzedeel Quiz</h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    aria-label="Close modal"
                                    className="rounded-md p-2 hover:bg-black/5"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="px-5 py-4">
                                {renderQuizContent()}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t pt-4 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border px-4 py-2 hover:bg-black/5"
                                >
                                    Cancel
                                </button>
                                {!quizCompleted && (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!selectedAnswers[currentQuestion?._id]}
                                        className="rounded-md bg-black px-4 py-2 font-medium text-white hover:opacity-90 disabled:bg-gray-400"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
