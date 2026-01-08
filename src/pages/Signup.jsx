import React from "react";
import NavBar from "../components/NavBar.jsx";
import {useForm} from "react-hook-form";

function Signup() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit = (data) => {
        const existingUser = JSON.parse(localStorage.getItem(data.email));

        if (existingUser) {
            console.log("User already exists");
            return;
        }

        const newUser = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        localStorage.setItem(data.email, JSON.stringify(newUser));
        console.log(`${data.name} has been successfully registered`);
    }

    return (
        <main className="min-h-screen pt-10 bg-[url('/images/bg-auth.svg')] bg-cover">
            <NavBar variant="auth" />

            <section className="main-section">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                    <h1 className="text-center mb-6">Create an Account</h1>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Name"
                        />
                        {errors.name && <span style={{ color: "red" }}>*Name is required</span>}
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
                    <p className="text-sm font-light text-center mt-6">Already have an account? <span className="text-sm font-semibold mt-6"><a href="#">Log in</a></span></p>
                </div>
            </section>
        </main>
    )
}

export default Signup;