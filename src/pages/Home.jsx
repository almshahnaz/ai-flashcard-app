import NavBar from "../components/NavBar.jsx";

export default function Home() {
    return <main className="min-h-screen pt-10 bg-[url('/images/bg-main.svg')] bg-cover">
        <NavBar/>
        <section className="main-section">
            <div className="page-heading">
                <h1 className="text-3xl">Transform PDFs into Smart Flashcards</h1>
                <h2>Upload any document and let AI instantly create personalized flashcards and study questions tailored to your learning style.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                <div className="bg-white/10 border-2 border-gray-300 rounded-xl p-8">
                    <h3 className="text-xl font-semibold">AI-Powered Analysis</h3>
                    <p>Use AI to extract key concepts and create targeted questions and flashcards</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                <div className="bg-white/10 border-2 border-gray-300 rounded-xl p-8">
                    <h3 className="text-xl font-semibold">Instant Generation</h3>
                    <p>Get flashcards in seconds. No more manual card creation, focus on learning.</p>
                </div>
            </div>

        </section>
    </main>
}