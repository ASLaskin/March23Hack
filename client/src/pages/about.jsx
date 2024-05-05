import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
	return (
		<>
			<header className="absolute top-0 left-0 w-full z-30 bg-blue-700">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<Link
						to="/"
						className="flex items-center space-x-3 rtl:space-x-reverse "
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							className="h-8 text-white"
						>
							<path
								fill="currentColor"
								d="M256 8C119 8 8 119 8 256c0 66.6 26.3 129.4 73.8 176.6l.1.1c47.2 47.4 109.9 74.1 177.1 74.1s129.9-26.7 177.1-74.1l.1-.1C477.7 385.4 504 322.6 504 256 504 119 393 8 256 8zm0 392.7c-49.5 0-95.6-19.3-130.4-54-34.8-34.8-54.1-80.9-54.1-130.4 0-49.5 19.3-95.6 54.1-130.4 34.8-34.8 80.9-54.1 130.4-54.1s95.6 19.3 130.4 54.1c34.8 34.8 54.1 80.9 54.1 130.4 0 49.5-19.3 95.6-54.1 130.4-34.9 34.8-80.9 54.1-130.4 54.1z"
							/>
						</svg>
						<h1 className="self-center text-2xl font-semibold whitespace-nowrap text-white">
							NetUF
						</h1>
					</Link>
					<Link to="/">
						<div className='text-2xl font-semibold whitespace-nowrap text-white'>Home</div>
					</Link>
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
					</div>
				</div>
			</header>
			<div className="max-w-3xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">About NetUF</h1>
				<p className="text-gray-700 mb-4">
					NetUF aims to revolutionize email communication within educational
					environments through the integration of advanced Artificial
					Intelligence (AI) technology. Traditional email exchanges among
					students, Teaching Assistants (TAs), and professors often prove to be
					time-consuming and inefficient, leading to delays in response times
					and potential miscommunication.
				</p>
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-2">Our Mission</h2>
					<p className="text-gray-700">
						Our mission at NetUF is to simplify and streamline communication
						processes within educational institutions by providing a
						sophisticated messaging platform powered by AI.
					</p>
				</div>
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-2">How It Works</h2>
					<p className="text-gray-700">
						With NetUF, students can effortlessly connect with TAs for
						assistance or clarification on various academic matters. Professors
						can efficiently manage and respond to inquiries forwarded to them,
						ensuring that important messages are not lost in a cluttered inbox.
					</p>
				</div>
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-2">The Role of AI</h2>
					<p className="text-gray-700">
						The core of our platform lies in AI technology, which intelligently
						handles routine queries such as inquiries about course materials,
						assignment deadlines, or any other topics covered in the course
						syllabus. By automating these repetitive tasks, educators can
						reclaim valuable time to focus on more complex and meaningful
						aspects of their role.
					</p>
				</div>
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-2">Benefits</h2>
					<ul className="list-disc list-inside text-gray-700">
						<li>
							Efficiency: By automating routine tasks, NetUF streamlines
							communication processes, reducing response times and minimizing
							the risk of miscommunication.
						</li>
						<li>
							Organization: Professors can easily manage incoming messages,
							ensuring that important inquiries are prioritized and addressed
							promptly.
						</li>
						<li>
							Time-saving: With AI handling routine queries, educators can
							devote more time to teaching, research, and other critical
							responsibilities.
						</li>
						<li>
							Enhanced Learning Experience: By facilitating seamless
							communication between students and educators, NetUF contributes to
							an improved learning environment and academic experience.
						</li>
					</ul>
				</div>
				<p className="text-gray-700">
					At NetUF, we are committed to harnessing the power of technology to
					enhance educational communication and ultimately, enrich the learning
					journey for students and educators alike. Join us in transforming the
					way we communicate in educational settings.
				</p>
			</div>
		</>
	);
};

export default AboutPage;
