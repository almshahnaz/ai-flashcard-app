import NavBar from "../components/NavBar.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UploadBox from "../components/UploadBox.jsx";
import {flashcardStorage} from "../utils/flashcardStorage.js";

export default function Dashboard() {

    const navigate = useNavigate();
    const [upload, setUpload] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [savedSets, setSavedSets] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [setName, setSetName] = useState("");

    useEffect(() => {
        if (!puter.auth.isSignedIn()) {
            navigate("/");
        } else {
            loadSavedSets();
        }
    }, [navigate]);

    const loadSavedSets = async () => {
        const sets = await flashcardStorage.getAllSets();
        setSavedSets(sets);
    };

    const handleFile = (file) => {
        console.log(file);
        setUpload(file);
        setError(null);
    }

    const handleGenerateFlashcards = async () => {
        if (!upload) return;

        setIsLoading(true);
        setError(null);

        try {

            // Upload file to Puter filesystem
            const tempFileName = `temp_flashcard_${Date.now()}.${upload.name.split('.').pop()}`;
            const puterFile = await puter.fs.write(tempFileName, upload);
            const uploadedPath = puterFile.path;

            // Call AI with the file
            const completion = await puter.ai.chat([
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            puter_path: uploadedPath
                        },
                        {
                            type: 'text',
                            text: `You are a flashcard generator. Analyze the uploaded document and create comprehensive flashcards for studying.

For each flashcard, provide:
1. A clear question on the front
2. A concise answer on the back  
3. A difficulty level (easy, medium, hard)

Generate 10-15 flashcards covering the main concepts, definitions, and key points from the document.

Return ONLY valid JSON in this exact format with NO additional text:
{
 "flashcards":[
    {"question": "What is...?", "answer": "...", "difficulty": "easy"},
    {"question": "...", "answer": "...", "difficulty": "medium"}
 ]
}`
                        }
                    ]
                }
            ], {model: 'claude-sonnet-4', stream: true });

            console.log("AI Response:", completion);

            // Collect the streamed response
            let responseText = '';
            for await (const part of completion) {
                responseText += part?.text || '';
            }

            console.log("Full response text:", responseText);

            // Clean up temporary file
            try {
                await puter.fs.delete(uploadedPath);
            } catch (e) {
                console.warn("Could not delete temp file:", e);
            }

            // Parse the response
            let generatedFlashcards;

            const jsonMatch = responseText.match(/\{[^]*\}/);
            if (jsonMatch) {
                generatedFlashcards = JSON.parse(jsonMatch[0]);
            } else {
                generatedFlashcards = JSON.parse(responseText);
            }

            if (!generatedFlashcards.flashcards || generatedFlashcards.flashcards.length === 0) {
                throw new Error("No flashcards were generated. Please try again with a different document.");
            }

            setFlashcards(generatedFlashcards.flashcards);

        } catch (error) {
            console.error("Error generating flashcards:", error);
            setError(error.message || "Failed to generate flashcards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveFlashcards = async () => {
        if (!flashcards || !setName.trim()) {
            setError("Please enter a name for your flashcard set");
            return;
        }

        try {
            await flashcardStorage.saveSet(setName, flashcards, upload?.name);
            setShowSaveModal(false);
            setFlashcards(null);
            setUpload(null);
            setSetName("");
            await loadSavedSets();
            alert("Flashcards saved successfully!");
        } catch (e) {
            console.error("Error saving flashcards:", e);
            setError("Failed to save flashcards");
        }
    };

    const handleDeleteFlashcards = async (id) => {
        if (confirm("Are you sure you want to delete this flashcard?")) {
            await flashcardStorage.deleteSet(id);
            await loadSavedSets();
        }
    };

    const handleStudySet = async (set) => {
        await flashcardStorage.updateLastStudied(set.id);
        navigate(`/study/${set.id}`);
    };

    return (
        <main className="min-h-screen pt-10 bg-[url('/images/bg-small.svg')] bg-cover">
            <NavBar variant="app"/>
            <section className="main-section">
                <UploadBox onFileSelect={handleFile} />

                {error && (
                    <div className="w-full max-w-3xl mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {upload && !flashcards && (
                    <div className="w-full max-w-3xl mt-6 animate-fadeIn">
                        <button
                            onClick={handleGenerateFlashcards}
                            disabled={isLoading}
                            className="primary-button w-full max-w-md mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Generating Flashcards...
                                </span>
                            ) : (
                                "Generate Flashcards"
                            )}
                        </button>
                    </div>
                )}

                {flashcards && (
                    <div className="w-full max-w-5xl mt-8 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Flashcards ({flashcards.length})
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    className="primary-button"
                                >
                                    Save Flashcards
                                </button>
                                <button
                                    onClick={() => {
                                        setFlashcards(null);
                                        setUpload(null);
                                    }}
                                    className="secondary-button"
                                >
                                    Create New Set
                                </button>
                            </div>
                        </div>

                        <div className="flashcard-container">
                            {flashcards.map((card, index) => (
                                <FlashcardPreview
                                    key={index}
                                    question={card.question}
                                    answer={card.answer}
                                    difficulty={card.difficulty}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {showSaveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold mb-4">Save Flashcard Set</h3>
                            <div className="form-div">
                                <label>Set Name</label>
                                <input
                                    type="text"
                                    value={setName}
                                    onChange={(e) => setSetName(e.target.value)}
                                    placeholder="e.g., Biology Chapter 5"
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveFlashcards}
                                    className="primary-button flex-1"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="secondary-button flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {savedSets.length > 0 && !flashcards && (
                    <div className="w-full max-w-5xl mt-16">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Saved Sets</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedSets.map((set) => (
                                <div key={set.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                    <h4 className="font-bold text-lg mb-2">{set.name}</h4>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {set.flashcards.length} cards
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Created {new Date(set.created).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStudySet(set)}
                                            className="primary-button text-sm flex-1"
                                        >
                                            Study
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFlashcards(set.id)}
                                            className="secondary-button text-sm"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

function FlashcardPreview({ question, answer, difficulty }) {
    const [flipped, setFlipped] = useState(false);

    const difficultyConfig = {
        easy: { class: 'badge-easy', label: 'Easy' },
        medium: { class: 'badge-medium', label: 'Medium' },
        hard: { class: 'badge-hard', label: 'Hard' }
    };

    const config = difficultyConfig[difficulty] || difficultyConfig.medium;

    return (
        <div
            className="flashcard"
            onClick={() => setFlipped(!flipped)}
        >
            <div className="flex justify-between items-center mb-4">
                <span className={`${config.class} flex items-center gap-1`}>
                    <span>{config.label}</span>
                </span>
                <span className="text-gray-400 text-sm">
                    {flipped ? 'Answer' : 'Question'}
                </span>
            </div>

            {!flipped ? (
                <div className="flashcard-front">
                    <p>{question}</p>
                </div>
            ) : (
                <div className="flashcard-back">
                    <p>{answer}</p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center font-medium">
                    Click to {flipped ? 'see question' : 'reveal answer'} →
                </p>
            </div>
        </div>
    );
}