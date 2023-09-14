function ClickButtonSelect() {
	let select_button = document.querySelector(".avatar");
	select_button.click();
}

var img_on_load = false
function ViewImg() {
	var img = document.querySelector(".avatar");
	var view = document.querySelector(".form img");

	var fileReader = new FileReader();
    fileReader.onload = function () {
        view.src = fileReader.result;
        img_on_load = true
    }

    fileReader.readAsDataURL(img.files[0]);
}

function Submit() {
	var data = { 
		name: document.querySelector(".name"),
		login: document.querySelector(".login"),
		password: document.querySelector(".password"),
		img: document.querySelector(".avatar")
	};

	is_valid = Validation(data);
	if (is_valid) {
		document.querySelector(".error").innerHTML = "";

		const formData = new FormData();
		formData.append("avatar", data.img.files[0]);
		formData.append("name", data.name.value);
		formData.append("login", data.login.value);
		formData.append("password", data.password.value);

		const req = new XMLHttpRequest()
		req.open("POST", "../../../../../../server/registration");
		req.responceType = "json";

		req.onload = function () {
			let resp = req.response;

			if (resp[0] === "Y") {
				resp = resp.split("&#$#&");
				document.cookie = `name=${data.name.value}; path=/; max-age=10000000000000000`;
				document.cookie = `avatar=${resp[1]}; path=/; max-age=10000000000000000`;
				document.cookie = `login=${data.login.value}; path=/; max-age=10000000000000000`;
				document.cookie = `password=${data.password.value}; path=/; max-age=10000000000000000`;
				document.cookie = `id=${resp[2]}; path=/; max-age=10000000000000000`;

				location.href = "../../";
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