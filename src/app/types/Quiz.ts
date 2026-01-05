export interface Answer {
    answerId: number;
    text: string;
}

export interface Question {
    _id: number;
    question: string;
    answers: Answer[];
}
