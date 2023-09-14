function Submit() {
	var data = { 
		login: document.querySelector(".login"),
		password: document.querySelector(".password")
	};

	is_valid = Validation(data);
	if (is_valid) {
		document.querySelector(".error").innerHTML = "";

		const formData = new FormData();
		formData.append("login", data.login.value);
		formData.append("password", data.password.value);

		const req = new XMLHttpRequest()
		req.open("POST", "../../../../../../server/singin");
		req.responceType = "json";

		req.onload = function () {
			let resp = req.response;

			if (resp == "None") {
				document.querySelector(".error").innerHTML = "Неверный логин или пароль!";
			}else {
				resp = resp.split("&#$#&");

				document.cookie = `name=${resp[1]}; path=/; max-age=10000000000000000`;
				document.cookie = `avatar=${resp[0]}; path=/; max-age=10000000000000000`;
				document.cookie = `login=${data.login.value}; path=/; max-age=10000000000000000`;
				document.cookie = `password=${data.password.value}; path=/; max-age=10000000000000000`;
				document.cookie = `id=${resp[2]}; path=/; max-age=10000000000000000`;

				location.href = "../"
			}
		}

		req.send(formData);

	}else {
		document.querySelector(".error").innerHTML = "Заполните форму правильно!";
	}
}

function Validation(data) {
	let keys = Object.entries(data);

	for (let i=0;i<keys.length;i++) {
		if (String(keys[i][1].value) == "") {
			return false;
		}
	}

	return true
}