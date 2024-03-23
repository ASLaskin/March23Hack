import React, { useState } from 'react';
const StudentDashboard = () => {
	const [textBoxValue, setTextBoxValue] = useState('');

	return (
		<>
			<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
				<div class="px-3 py-3 lg:px-5 lg:pl-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center justify-start rtl:justify-end">
							<button
								data-drawer-target="logo-sidebar"
								data-drawer-toggle="logo-sidebar"
								aria-controls="logo-sidebar"
								type="button"
								class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
							>
								<span class="sr-only">Open sidebar</span>
								<svg
									class="w-6 h-6"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										clip-rule="evenodd"
										fill-rule="evenodd"
										d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
									></path>
								</svg>
							</button>
							<a href="/" class="flex ms-2 md:me-24">
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
								<span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
									NetUF
								</span>
							</a>
						</div>
						<div class="flex items-center">
							<div class=" items-center ms-3">
								<div className='flex space-x-1'>
									{/* TODO: Needs to show email at top instead of Andrew Laskin  */}
									<button
										type="button"
										class="flex text-M rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
										aria-expanded="false"
										data-dropdown-toggle="dropdown-user"
									>
										<span class="sr-only">Open user menu</span>
										Andrew Laskin
									</button>
                                    <img src='https://www.svgrepo.com/show/66004/cogwheel.svg' alt='settings' className='w-6 h-6 text-blue-700' />
								</div>
								<div
									class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
									id="dropdown-user"
								>
									<div class="px-4 py-3" role="none">
										<p
											class="text-sm text-gray-900 dark:text-white"
											role="none"
										>
											Neil Sims
										</p>
										<p
											class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
											role="none"
										>
											neil.sims@flowbite.com
										</p>
									</div>
									<ul class="py-1" role="none"></ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<aside
				id="logo-sidebar"
				class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
				aria-label="Sidebar"
			>
				<div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
					<ul class="space-y-2 font-medium">
						<li>Bruh Moment</li>
						<li>Bruh Moment</li>
					</ul>
				</div>
			</aside>
			<div class="p-4 sm:ml-64">
				<div
					class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 flex flex-col-reverse"
					style={{ height: 'calc(100vh - 60px)' }}
				>
					<div class="flex items-center justify-between">

						<textarea
							className="text-black left-4 w-full h-16 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
							placeholder="Type something here..."
							value={textBoxValue}
							onChange={(e) => setTextBoxValue(e.target.value)}
						></textarea>
                        						<button
							type="button"
							className="text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800"
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default StudentDashboard;
