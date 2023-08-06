//アップロードボタンが押された際の動作
const pictors_url = "https://www.aipictors.com/post/"

const window_width = 400;
const window_height = 600;

const window_pos_x = screen.width - window_width;
const window_pos_y = 0;

onUiLoaded(function() {
	gradioApp().querySelectorAll("#upload_to_aipictors_button").forEach(btn => btn.addEventListener("click", onClick));
})

function openPopup(extension,base64Data) {
	let url = ""
	if(extension == null){url = pictors_url}
	else{url = pictors_url + "#image/" + extension + ";base64," + base64Data}
	window.open(url, "_blank", `width=${window_width},height=${window_height},left=${window_pos_x},top=${window_pos_y}`);
}

function onClick() {
	let selectedIndex = selected_gallery_index();
	if (selectedIndex == -1) {
		openPopup(null,null);
		return
	}
	const selectedButton = all_gallery_buttons()[selectedIndex];
	if(selectedButton == null){return}
	const imgElement = selectedButton.querySelector('img')
	const imgSrc = imgElement.getAttribute('src');
	const extension = imgSrc.split('/').pop().split('.').pop();

	fetch(imgSrc)
		.then(response => response.blob())
		  	.then(blob => {
				const reader = new FileReader();
				reader.onload = () => {
					const base64Data = reader.result.split(',')[1];
			  		openPopup(extension,base64Data)
				};
				reader.readAsDataURL(blob);
			})
		.catch(error => {
			console.error('画像の取得に失敗しました', error);
		});
}

