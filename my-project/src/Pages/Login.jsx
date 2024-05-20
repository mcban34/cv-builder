import React, { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, Carousel } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        login: { email: "", password: "" },
        register: { email: "", password: "" }
    })

    const loginUser = useUserStore(state => state.loginUser);
    const registerUser = useUserStore(state => state.registerUser);
    const loginGoogle = useUserStore(state => state.loginWithGoogle);

    const handleloginSubmit = async (event) => {
        event.preventDefault();
        try {
            await loginUser(user.login.email, user.login.password);
            navigate("/home")
            console.log("Giriş başarılı!");
        } catch (error) {
            console.error("Giriş başarısız:", error);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            await registerUser(user.register.email, user.register.password);
            alert("Kayıt başarılı. Giriş yapabilirsiniz!");
        } catch (error) {
            alert(`Kayıt sırasında bir hata oluştu: ${error.message}`);
        }
    }
    //handleloginSubmit
    const loginTab = () => {
        return (
            <>
                <div>
                    <form onSubmit={handleloginSubmit} className="w-full p-6 bg-white rounded-lg shadow-md">
                        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                E-mail:
                                <input
                                    type="email"
                                    value={user.login.email}
                                    onChange={(e) => setUser({ ...user, login: { ...user.login, email: e.target.value } })}
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </label>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                Password:
                                <input
                                    type="password"
                                    value={user.login.password}
                                    onChange={(e) => setUser({ ...user, login: { ...user.login, password: e.target.value } })}
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-themeColor100 duration-300 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                Login
                            </button>
                        </div>

                        <hr className="my-3 border-t" />

                        <button
                            type="button"
                            onClick={loginGoogle}
                            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-700 duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Login With Google
                        </button>
                    </form>
                </div>
            </>
        )
    }

    const registerTab = () => {
        return (
            <>
                <form onSubmit={handleRegisterSubmit} className="w-full p-6 bg-white rounded-lg shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h2>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            E-mail:
                            <input
                                type="email"
                                value={user.register.email}
                                onChange={(e) => setUser({ ...user, register: { ...user.register, email: e.target.value } })}
                                className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </label>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Password:
                            <input
                                type="password"
                                value={user.register.password}
                                onChange={(e) => setUser({ ...user, register: { ...user.register, password: e.target.value } })}
                                className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-themeColor100 duration-300 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Register
                        </button>
                    </div>

                    <hr className="my-3 border-t" />

                    <button
                        type="button"
                        onClick={loginGoogle}
                        className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-700 duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Register With Google
                    </button>
                </form>
            </>

        )
    }

    const LoginRegisterElements = [
        {
            label: "Login",
            value: "login",
            element: loginTab()
        },
        {
            label: "Register",
            value: "register",
            element: registerTab()
        },
    ];

    return (
        <>
            <div className="flex">
                <div className="hidden lg:w-6/12 h-[100vh] lg:flex items-center justify-center bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-themeColor100 opacity-50 z-20"></div>
                    <div className="absolute inset-0 bg-[url('./carousel.jpg')] bg-cover bg-center z-0"></div>
                </div>
                <div className='lg:w-6/12 w-full h-[100vh] flex items-center bg-themeColor100 p-4 lg:p-14'>
                    <Tabs value="login" className="w-full">
                        <TabsHeader>
                            {LoginRegisterElements.map(({ label, value }) => (
                                <Tab key={value} value={value}>
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                        <TabsBody >
                            {LoginRegisterElements.map(({ value, element }) => (
                                <TabPanel key={value} value={value}>
                                    {element}
                                </TabPanel>
                            ))}
                        </TabsBody>
                    </Tabs>
                </div>
            </div >
        </>
    );
};

export default LoginForm;
