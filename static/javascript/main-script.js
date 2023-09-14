window.onload = () => {
	document.querySelector(".avatar").src = "/src/user-avatar/" + get_cookie('avatar');
} 

function get_cookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}