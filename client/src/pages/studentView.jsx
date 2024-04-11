import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/modal';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const StudentDashboard = () => {
	const [textBoxValue, setTextBoxValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [firstMessages, setFirstMessages] = useState([]);
	const [convoMessages, setConvoMessages] = useState([]);
	const [newConvoOrMess, setnewConvoOrMess] = useState([true]);
	const [activeID, setactiveID] = useState();

	const submitText = async () => {
		//This is for model we should make it open after AI response
		//setIsOpen(true);
		const userText = textBoxValue;

		//if its true we make a new convo false we make it a message
		if (newConvoOrMess == true) {
			try {
				const response = await axios.post(
					'/pushConversation',
					{
						text: userText,
					},
					{ withCredentials: true }
				);
				console.log(response.data);
			} catch (error) {
				console.error('Error:', error);
			}
		} else {
			try {
				const response = await axios.post(
					'/pushMessage/' + activeID,
					{
						text: userText,
					},
					{ withCredentials: true }
				);
				console.log(response.data);
			} catch (error) {
				console.error('Error', error);
			}
		}
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const chatClick = async (idx) => {
		try {
			const response = await axios.get(
				'http://localhost:5001/conversationData/' +
					firstMessages[idx].conversationId
			);
			console.log(response.data);
			setactiveID(firstMessages[idx].conversationId);
			setConvoMessages(response.data.conversation.messages);
			setnewConvoOrMess(false);
			console.log(response.data.conversation.messages);
			console.log(convoMessages);
		} catch (error) {
			console.log(error);
		}
	};

	//makes new conversation so clears the screen and primes to send in a new convo
	const makeNew = () => {
		setConvoMessages([]);
		setnewConvoOrMess(true);
	};

	const signOut = async () => {
		try {
			const response = await axios.post(
				'http://localhost:5001/users/logout',
				{},
				{ withCredentials: true }
			);
			console.log(response);
		} catch (error) {
			console.error(error);
		}
	};

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/getConversations',
                    { withCredentials: true }
                );
                setFirstMessages(response.data.firstMessages);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchEmail = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/users/profile',
                    { withCredentials: true }
                );
                setUserEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };

        fetchEmail();
        fetchConversations();

        // Socket.IO event listeners
        socket.on('newConversation', (data) => {
            setFirstMessages([...firstMessages, { conversationId: data.conversationId, firstMessage: 'New conversation' }]);
        });

		socket.on('newMessage', (data) => {
			// Update the conversation messages for the active conversation only
			if (data.conversationId === activeID) {
				setConvoMessages(prevMessages => [...prevMessages, data.message]);
			} else {
				// If the new message is for a different conversation, 
				// update the conversation list to show that there are new messages
				setFirstMessages(prevFirstMessages => {
					return prevFirstMessages.map(conversation => {
						if (conversation.conversationId === data.conversationId) {
							// Update the last message to indicate new messages
							return { ...conversation, firstMessage: 'New message received' };
						}
						return conversation;
					});
				});
			}
		});

        // Cleanup event listeners when the component unmounts
        return () => {
            socket.off('newConversation');
            socket.off('newMessage');
        };
    }, [activeID, convoMessages, firstMessages]);

	const formatTime = (param) => {
		const timestamp = new Date(param);
		const day = timestamp.getDate();
		const month = timestamp.getMonth() + 1; 
		const year = timestamp.getFullYear();

		const formattedDate = `${day}/${month}/${year}`;
		return formattedDate;
	};

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
						<button onClick={makeNew}>New Conversation</button>
						{firstMessages.map((conversation, idx) => (
							<a
								key={idx}
								onClick={() => chatClick(idx)}
								className="hover:underline cursor-pointer"
							>
								<li>{conversation.firstMessage}</li>
							</a>
						))}
					</ul>
				</div>
			</aside>
			<div className="p-4 sm:ml-64">
				<div
					className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 flex flex-col"
					style={{ height: 'calc(100vh - 60px)' }}
				>
					<div
						className="flex flex-col-reverse overflow-y-auto conversation-messages"
						style={{ maxHeight: 'calc(100% - 60px - 3rem)' }}
					>
						{convoMessages
							.slice(0)
							.reverse()
							.map((message, index) => (
								<div key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
									<div className="flex justify-between">
										<div>
											<p className="font-bold">{message.user}</p>
											<p className="mt-2">{message.text}</p>
										</div>
										<p className="text-sm text-gray-500">{formatTime(message.time)}</p>
									</div>
								</div>
							))}
					</div>
					<div className="mt-auto">
						<div className="flex items-center justify-between">
							<textarea
								className="text-black w-full h-16 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
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
					</div>
				</div>
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} />
		</>
	);
};

export default StudentDashboard;
