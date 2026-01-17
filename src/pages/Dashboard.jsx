import NavBar from "../components/NavBar.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UploadBox from "../components/UploadBox.jsx";

export default function Dashboard() {

    const navigate = useNavigate();
    const [upload, setUpload] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!puter.auth.isSignedIn()) {
            navigate("/");
        }
    }, [navigate]);

    const handleFile = (file) => {
        console.log(file);
        setUpload(file);
    }

    const handleGenerateFlashcards = async () => {
        if (!upload) return;

        setIsLoading(true);

        try {
            // TODO: Add API call here to process the file

            console.log("Generating flashcards for:", upload.name);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Navigate to flashcards view or show results
            // navigate('/flashcards');

        } catch (error) {
            console.error("Error generating flashcards:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-10 bg-[url('/images/bg-small.svg')] bg-cover">
            <NavBar variant="app"/>
            <section className="main-section">
                <UploadBox onFileSelect={handleFile} />

                {upload && (
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
            </section>
        </main>
    )
}