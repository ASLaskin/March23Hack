import {Link} from 'react-router-dom';

const Home = () => {
	return (
		<section className="relative h-screen">
			<div
				className="absolute inset-0 bg-cover bg-center z-0"
				style={{
					backgroundImage:
						'url("https://images.unsplash.com/photo-1537202108838-e7072bad1927?q=80&w=2846&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
				}}
			></div>

			{/* Overlay */}
			<div className="absolute inset-0 bg-black opacity-50 z-10"></div>

			{/* Header */}
			<header className="absolute top-0 left-0 w-full z-30">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<a
						href="/"
						className="flex items-center space-x-3 rtl:space-x-reverse "
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="h-8 text-blue-700"
						>
							<path
								fill="currentColor"
								d="M256 8C119 8 8 119 8 256c0 66.6 26.3 129.4 73.8 176.6l.1.1c47.2 47.4 109.9 74.1 177.1 74.1s129.9-26.7 177.1-74.1l.1-.1C477.7 385.4 504 322.6 504 256 504 119 393 8 256 8zm0 392.7c-49.5 0-95.6-19.3-130.4-54-34.8-34.8-54.1-80.9-54.1-130.4 0-49.5 19.3-95.6 54.1-130.4 34.8-34.8 80.9-54.1 130.4-54.1s95.6 19.3 130.4 54.1c34.8 34.8 54.1 80.9 54.1 130.4 0 49.5-19.3 95.6-54.1 130.4-34.9 34.8-80.9 54.1-130.4 54.1z"
							/>
						</svg>

						<h1 className="self-center text-2xl font-semibold whitespace-nowrap text-white">
							NetUF
						</h1>
					</a>
					<div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link to="/login">
						<button
							type="button"
							className="text-white  font-medium text-sm px-4 py-2 text-center"
						>
							Login
						</button>
            </Link>
						<div className="hidden md:block w-3"></div>
            <Link to="/signup">
						<button
							type="button"
							className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
						>
							Signup
						</button>
            </Link>
						<button
							data-collapse-toggle="navbar-sticky"
							type="button"
							className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600"
							aria-controls="navbar-sticky"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 17 14"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M1 1h15M1 7h15M1 13h15"
								/>
							</svg>
						</button>
					</div>

					<div
						className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
						id="navbar-sticky"
					>
						<ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
							<li>
								<a
									href="#"
									className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0"
									aria-current="page"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="#"
									className="block py-2 px-3 text-white rounded md:p-0"
								>
									About
								</a>
							</li>
						</ul>
					</div>
				</div>
			</header>

			<div className="absolute inset-0 flex justify-center lg:justify-start items-center text-white z-20">
				<div className="  px-8 py-6 rounded-lg lg:ml-48 lg:max-w-md w-full md:w-auto">
					<h1 className="text-5xl md:text-6xl font-bold mb-4">
            Like Emails But Better
					</h1>
					<p className="text-lg mb-6">
            Simplify your communications with faculty and students with NetUF. Innovating a new way to communicate with your Students,TA's or Professors.
					</p>
					<div className="flex  space-y-0 space-x-4">
						<button
							type="button"
							className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
						>
							Get Started
						</button>
						<button
							type="button"
							className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
						>
							Learn More
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
export default Home;
