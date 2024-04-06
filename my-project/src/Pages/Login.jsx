// src/components/LoginForm.js
import React, { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
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

    const loginTab = () => {
        return (
            <>

                <form onSubmit={handleloginSubmit}>
                    <label>
                        E-posta:
                        <input
                            type="email"
                            value={user.login.email}
                            onChange={(e) => setUser({ ...user, login: { ...user.login, email: e.target.value } })}
                        />
                    </label>
                    <label>
                        Şifre:
                        <input
                            type="password"
                            value={user.login.password}
                            onChange={(e) => setUser({ ...user, login: { ...user.login, password: e.target.value } })}
                        />
                    </label>
                    <br />
                    <button type="submit">Giriş Yap</button>
                    <br />
                </form>
                <button onClick={loginGoogle}>Google İle Giriş</button>
            </>
        )
    }

    const registerTab = () => {
        return (
            <>
                <form onSubmit={handleRegisterSubmit}>
                    <div>
                        <label>E-posta:</label>
                        <input
                            type="email"
                            value={user.register.email}
                            onChange={(e) => setUser({ ...user, register: { ...user.register, email: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label>Şifre:</label>
                        <input
                            type="password"
                            value={user.register.password}
                            onChange={(e) => setUser({ ...user, register: { ...user.register, password: e.target.value } })}
                        />
                    </div>
                    <button type="submit">Kayıt Ol</button>
                </form>
                <button onClick={loginGoogle}>Google İle Kayıt</button>
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

            <Tabs value="login">
                <TabsHeader>
                    {LoginRegisterElements.map(({ label, value }) => (
                        <Tab key={value} value={value}>
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody>
                    {LoginRegisterElements.map(({ value, element }) => (
                        <TabPanel key={value} value={value}>
                            <div className='bg-red-300'>
                                {element}
                            </div>
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </>
    );
};

export default LoginForm;
