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
        if (currentIndex < flashcardSet.flashcards.length - 1) {
            setFlipped(false);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setFlipped(false);
            setCurrentIndex(currentIndex - 1);
        }
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
    const isFirstCard = currentIndex === 0;
    const isLastCard = currentIndex === flashcardSet.flashcards.length - 1;

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
                        <h1 className="text-3xl font-bold text-gray-800">{flashcardSet.name}</h1>
                        <div className="w-32"></div>
                    </div>


                    <div
                        className="bg-white rounded-3xl shadow-2xl p-12 min-h-100 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:shadow-3xl"
                        onClick={() => setFlipped(!flipped)}
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            {!flipped ? (
                                <div className="text-center">
                                    <p className="text-sm text-gray-400 mb-6 uppercase tracking-wide">Question</p>
                                    <h2 className="text-3xl font-semibold text-gray-900 leading-relaxed">
                                        {currentCard.question}
                                    </h2>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-gray-400 mb-6 uppercase tracking-wide">Answer</p>
                                    <p className="text-2xl text-gray-700 leading-relaxed">
                                        {currentCard.answer}
                                    </p>
                                </div>
                            )}
                        </div>


                        <div className="w-full flex justify-between items-center mt-8 pt-6 border-t border-gray-200">

                            <div className="text-gray-500 font-medium">
                                {currentIndex + 1} / {flashcardSet.flashcards.length}
                            </div>


                            <div className="flex gap-4">

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevious();
                                    }}
                                    disabled={isFirstCard}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                                        isFirstCard
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-linear-to-br from-purple-500 to-blue-500 text-white hover:scale-110 hover:shadow-lg'
                                    }`}
                                >
                                    ←
                                </button>


                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    disabled={isLastCard}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                                        isLastCard
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-linear-to-br from-purple-500 to-blue-500 text-white hover:scale-110 hover:shadow-lg'
                                    }`}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>


                    <p className="text-center text-gray-500 mt-6 text-sm">
                        Click the card to {flipped ? 'see the question' : 'reveal the answer'}
                    </p>
                </div>
            </section>
        </main>
    );
}