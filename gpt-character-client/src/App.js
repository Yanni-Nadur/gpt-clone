import './App.css';
import PlusIcon from './images/plus-icon.svg';
import UserIcon from './images/user.svg';
import MikuIcon from './images/miku.jpg';
import { useState } from 'react';

function App() {
	const [input, setInput] = useState("");
	const [chatLog, setChatLog] = useState([
		{
			user: "gpt",
			message: "Nyallo 💙 I am Shiorin~ What do you want to talk about?"
		},
	]);

	function clearChat(){
		setChatLog([
			{
				user: "gpt",
				message: "Nyallo 💙 I am Shiorin~ What do you want to talk about?"
			},
		]);
	}

	async function handleSubmit(e){
		e.preventDefault();

		let chatLogNew = [...chatLog, { user: "me", message: `${input}`}];

		setInput("");
		setChatLog(chatLogNew)

		const messages = chatLogNew.map((message) => message.message).join("\n")

		const response = await fetch("http://localhost:3080/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				message: messages
			})
		});
		
		const data = await response.json();

		setChatLog([...chatLogNew, {user: "gpt", message: `${data.message}`}])
	}

	return (
		<div className='flex bg-pink-300 text-white h-screen'>
			<aside className='w-[240px] border-2 border-white p-6 flex bg-pink-500'>
				<div onClick={clearChat} className='p-3 border-2 border-white rounded-md w-full h-fit flex items-center justify-center gap-x-3 cursor-pointer hover:opacity-75 transition-all'>
					<img src={PlusIcon} className="w-4 h-4 invert brightness-200" alt="logo" />
					<span>New Chat</span>
				</div>
			</aside>
			<section className='flex flex-col flex-1 border border-white'>
				<div className='chat-log h-[90%] overflow-auto'>
					{chatLog.map((message, index) => (
						<ChatMessage key={index} message={message} />
					))}
				</div>
				<form className="py-6 px-10 mt-auto mr-auto w-full h-[10%] rounded-md flex items-center" onSubmit={handleSubmit}>
					<input 
					value={input} 
					onChange={(e) => setInput(e.target.value)} 
					className='w-full px-5 py-3 bg-pink-400 border-2 rounded-3xl border-white resize-none focus-visible:outline-none placeholder:text-white' placeholder="Type your message here..."></input>
				</form>
			</section>
		</div>
	);
}

const ChatMessage = ({ message }) =>{
	return(
		<div className={`${message.user === "gpt" && "bg-pink-500"} chat-message flex items-center py-4 px-10 gap-x-5`}>
			{message.user === "gpt" ? (
				<div className="flex shrink-0 w-10 h-10 rounded-full overflow-hidden">
					<img src={MikuIcon} className="w-full h-full " alt="icon" />
				</div>
			) : (
				<div className="flex shrink-0 w-10 h-10 rounded-full bg-black overflow-hidden">
					<img src={UserIcon} className="w-full h-full invert" alt="icon" />
				</div>
			)}

			<div className='message'>{message.message}</div>
		</div>
	)
}

export default App;
