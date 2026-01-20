import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import { flashcardStorage } from "../utils/flashcardStorage.js";

export default function Study() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (!puter.auth.isSignedIn()) {
            navigate("/");
            return;
        }

        loadFlashcardSet();
    }, [id, navigate]);

    const loadFlashcardSet = async () => {
        const set = await flashcardStorage.getSet(id);
        if (set) {
            setFlashcardSet(set);
        } else {
            navigate("/app");
        }
    };

    const handleNext = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcardSet.flashcards.length);
    };

    const handlePrevious = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcardSet.flashcards.length) % flashcardSet.flashcards.length);
    };

    if (!flashcardSet) {
        return (
            <main className="min-h-screen pt-10 bg-[url('/images/bg-small.svg')] bg-cover">
                <NavBar variant="app"/>
                <div className="main-section">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    const currentCard = flashcardSet.flashcards[currentIndex];

    return (
        <main className="min-h-screen pt-10 bg-[url('/images/bg-small.svg')] bg-cover">
            <NavBar variant="app"/>
            <section className="main-section">
                <div className="w-full max-w-4xl">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => navigate("/app")}
                            className="back-button"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold">{flashcardSet.name}</h1>
                        <div className="text-gray-600">
                            {currentIndex + 1} / {flashcardSet.flashcards.length}
                        </div>
                    </div>

                    <div className="study-card" onClick={() => setFlipped(!flipped)}>
                        {!flipped ? (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-4">Question</p>
                                <h2 className="text-3xl font-semibold">{currentCard.question}</h2>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-4">Answer</p>
                                <p className="text-2xl">{currentCard.answer}</p>
                            </div>
                        )}
                    </div>

                    <div className="card-controls">
                        <button
                            onClick={handlePrevious}
                            className="secondary-button"
                            disabled={flashcardSet.flashcards.length === 1}
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => setFlipped(!flipped)}
                            className="primary-button"
                        >
                            {flipped ? "Show Question" : "Show Answer"}
                        </button>
                        <button
                            onClick={handleNext}
                            className="secondary-button"
                            disabled={flashcardSet.flashcards.length === 1}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}