import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/modal';

const StudentDashboard = () => {
	const [textBoxValue, setTextBoxValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [firstMessages, setFirstMessages] = useState([]);
	const [messagesID, setMessagesID] = useState([]);
	const [isActive, setIsActive] = useState(false);
	const [activeConvo, setActiveConvo] = useState('');
	const [convoMessages, setConvoMessages] = useState([]);

	const submitText = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const chatClick = (idx) => {
		const conversationId = messagesID[idx][idx];
		setIsActive(true);
		setActiveConvo(conversationId);
	};

	useEffect(() => {
		if (isActive) {
			const fetchConvoMessages = async () => {
				try {
					const response = await fetch(
						`http://localhost:5001/conversations/${activeConvo}/messages`,
						{
							method: 'GET',
							credentials: 'include',
						}
					);
					if (!response.ok) {
						throw new Error('Failed to fetch conversation messages');
					}
					//TODO:This may be worth looking into ngl
					const data = await response.json();
					console.log(data.text);
					setConvoMessages(data);
				} catch (error) {
					console.error('Error fetching conversation messages:', error);
				}
			};
			fetchConvoMessages();
		}
	}, [isActive, activeConvo]);

	const newConvo = async () => {
		const response = await axios.post(
			'http://localhost:5001/conversation',
			{
				id: 1,
				user: userEmail,
				text: textBoxValue,
			},
			{
				withCredentials: true, // Include cookies in the request
			}
		);
		console.log('done');
	};

	const signOut = async () => {
		const response = await axios.post('http://localhost:5001/users/logout', {
			email: email,
			password: password,
		});
	};

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch('http://localhost:5001/conversations', {
					method: 'GET',
					credentials: 'include',
				});
				if (!response.ok) {
					throw new Error('Failed to fetch conversations');
				}
				const data = await response.json();

				const messages = data.conversations.map((conversation) => {
					if (conversation.messages && conversation.messages.length > 0) {
						return {
							text: conversation.messages[0].text,
							// other properties you might want to access
						};
					} else {
						return { text: '' }; // or any default value you prefer if there are no messages
					}
				});
				const messagesID = data.conversations.map((conversation, index) => {
					if (conversation.messages && conversation.messages.length > 0) {
						return {
							[index]: conversation._id,
						};
					} else {
						return { [index]: '' };
					}
				});
				setMessagesID(messagesID);
				setFirstMessages(messages);
				console.log('done with messages');
				console.log(messages);
			} catch (error) {
				console.error('Error fetching conversations:', error);
			}
		};

		const fetchEmail = async () => {
			try {
				const response = await fetch('http://localhost:5001/users/profile', {
					method: 'GET',
					credentials: 'include',
				});
				if (!response.ok) {
					throw new Error('Failed to fetch email');
				}
				const data = await response.json();
				setUserEmail(data.email);
				console.log('done with email');
			} catch (error) {
				console.error('Error fetching email:', error);
			}
		};

		fetchEmail();
		fetchConversations();
		return () => {
			console.log('cleaning up');
		};
	}, []);

	return (
		<>
			<nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
				<div className="px-3 py-3 lg:px-5 lg:pl-3"></div>
				<div className="flex items-center justify-between">
					<div className="flex items-center justify-start rtl:justify-end">
						<button
							data-drawer-target="logo-sidebar"
							data-drawer-toggle="logo-sidebar"
							aria-controls="logo-sidebar"
							type="button"
							className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						>
							<span className="sr-only">Open sidebar</span>
							<svg
								className="w-6 h-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									clipRule="evenodd"
									fillRule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
								></path>
							</svg>
						</button>
						<a href="/" className="flex ms-2 md:me-24">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								className="h-8 text-blue-700"
							>
								<path
									fill="currentColor"
									d="M256 8C119 8 8 119 8 256c0 66.6 26.3 129.4 73.8 176.6l.1.1c47.2 47.4 109.9 74.1 177.1 74.1s129.9-26.7 177.1-74.1l.1-.1C477.7 385.4 504 322.6 504 256 504 119 393 8 256 8zm0 392.7c-49.5 0-95.6-19.3-130.4-54-34.8-34.8-54.1-80.9-54.1-130.4 0-49.5 19.3-95.6 54.1-130.4 34.8-34.8 80.9-54.1 130.4-54.1s95.6 19.3 130.4 54.1c34.8 34.8 54.1 80.9 54.1 130.4 0 49.5-19.3 95.6-54.1 130.4-34.9 34.8-80.9 54.1-130.4 54.1z"
								/>
							</svg>
							<span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
								NetUF
							</span>
						</a>
					</div>
					<div className="flex items-center">
						<div className=" items-center ms-3">
							<a
								onClick={signOut}
								className=" flex cursor-pointer space-x-1"
								href="/login"
							>
								<h1
									type="button"
									className="flex text-M rounded-full"
									aria-expanded="false"
									data-dropdown-toggle="dropdown-user"
								>
									<span className="sr-only">Open user menu</span>
									{userEmail}
								</h1>
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Octicons-sign-out.svg"
									alt="settings"
									className="w-6 h-6 text-blue-700"
								/>
							</a>
							<div
								className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
								id="dropdown-user"
							>
								<div className="px-4 py-3" role="none">
									<p
										className="text-sm text-gray-900 dark:text-white"
										role="none"
									>
										{userEmail}
									</p>
								</div>
								<ul className="py-1" role="none"></ul>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<aside
				id="logo-sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
				aria-label="Sidebar"
			>
				<div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
					<ul className="space-y-2 font-medium">
						<button onClick={newConvo}>New Conversation</button>
						{firstMessages.map((conversation, idx) => (
							<a key={idx} onClick={() => chatClick(idx)} className="hover:underline cursor-pointer">
								<li>{conversation.text}</li>
							</a>
						))}
					</ul>
				</div>
			</aside>
			<div className="p-4 sm:ml-64">
				<div
					className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 flex flex-col-reverse"
					style={{ height: 'calc(100vh - 60px)' }}
				>
					<div className="flex items-center justify-between">
						<textarea
							className="text-black left-4 w-full h-16 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
							placeholder="Type something here..."
							value={textBoxValue}
							onChange={(e) => setTextBoxValue(e.target.value)}
						></textarea>
						<button
							type="button"
							className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
							onClick={submitText}
						>
							Submit
						</button>
					</div>
					<div>
						<h1>Conversation Messages:</h1>
						<ul>
								<li >
									<p>User: {convoMessages.user}</p>
									<p>Text: {convoMessages.text}</p>
									<p>Timestamp: {convoMessages.timestamp}</p>
								</li>
	
						</ul>
					</div>
				</div>
			</div>
			<Modal isOpen={isOpen} onClose={closeModal} />
		</>
	);
};

export default StudentDashboard;
