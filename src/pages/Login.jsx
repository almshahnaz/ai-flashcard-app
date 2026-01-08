import NavBar from "../components/NavBar.jsx";
import {useForm} from "react-hook-form";

function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(data.email));

        if (!userData) {
            console.log("Email or password is incorrect");
            return;
        }

        if (userData.password !== data.password) {
            console.log("Email or password is incorrect");
            return;
        }

        console.log("Logged in successfully");
    }

    return (
        <main className="min-h-screen pt-10 bg-[url('/images/bg-auth.svg')] bg-cover">
            <NavBar variant="auth" />

            <section className="main-section">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                    <h1 className="text-center mb-6">Welcome Back</h1>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="email"
                            {...register('email', {required: true})}
                            placeholder="Email"
                        />
                        {errors.email && <span style={{ color: "red" }}>*Email is required</span>}

                        <input
                            type="password"
                            {...register('password', {required: true})}
                            placeholder="Password"
                        />
                        {errors.password && <span style={{ color: "red" }}>*Password is required</span>}
                        <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
                    </form>
                    <p className="text-sm font-light text-center mt-6">Don't have an account? <span className="text-sm font-semibold mt-6"><a href="#">Sign Up</a></span></p>
                </div>
            </section>
        </main>
    )
}

export default Login;