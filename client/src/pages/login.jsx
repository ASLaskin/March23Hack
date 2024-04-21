import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        try {
            event.preventDefault();
            await axios.post('http://localhost:5001/users/login', {
              email: email,
              password: password,
            }, {
              withCredentials: true
            });
            const response = await axios.post('http://localhost:5001/users/role', {
                email: email,
            });
            const role = response.data;

            if (role === 'student') {
                window.location.href = '/student';
            } else if (role === 'professor') {
                window.location.href = '/teacher';
            } else if (role === 'ta') {
                window.location.href = '/ta';
            } else {
                alert('Unknown role');
            }

          } catch (error) {
            alert('Login failed!');
          }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen relative">
            <Link to="/">
                <button
                    className="absolute top-0 left-0 m-4 bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => console.log('Go back home')}
                >
                    Go back home
                </button>
            </Link>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-white">
                    <h2 className="text-2xl mb-4 text-center font-bold">Log In</h2>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <button
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                            type="button"
                            onClick={handleLogin}
                        >
                            Log In
                        </button>
                        <Link to="/signup">
                            <a className="text-gray-800 font-bold rounded mt-4">
                                Don't have an account? Sign up here.
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
