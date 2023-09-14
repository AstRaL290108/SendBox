const socket = io();
socket.emit('ping', {name: get_cookie('name')})

function send_message() {
	let message_text = document.querySelector(".message-input").value;

	let name = get_cookie('name');
	let avatar = get_cookie('avatar');

	resp = {name: name, avatar: avatar, text: message_text, id: get_cookie("id")};
	if (resp.text != "") {
		socket.emit('add-message', resp);
		document.querySelector(".message-input").value = "";
		document.querySelector(".message-input").placeholder = "Введите сообщения...";
	}else {
		document.querySelector(".message-input").placeholder = "Введите текст сообщения!!!";
	}
}

socket.on('get-message', (resp) => {

	if (resp.type == "user-message") {

		let chat = document.querySelector(".chat");
		chat.innerHTML += `<div class="message">
			<img src="/src/user-avatar/${resp.avatar}" alt="">
			<div class="message-body">
				<div class="name">${resp.name}</div>
				<div class="text">${resp.text}</div>
			</div>
		</div>`;

	}else if (resp.type == "service-message") {

		let chat = document.querySelector(".content .chat");
		chat.innerHTML += `<div class="service-message">${resp.message}</div>`;

	}
});

socket.on('get-last', (resp) => {
	console.log(resp);
	let chat = document.querySelector(".chat");

	for (let i = 0; i < resp.length; i++) {
		chat.innerHTML += `<div class="message">
			<img src="/src/user-avatar/${resp[i].avatar}" alt="">
			<div class="message-body">
				<div class="name">${resp[i].name}</div>
				<div class="text">${resp[i].text_message}</div>
			</div>
		</div>`;
	}
});