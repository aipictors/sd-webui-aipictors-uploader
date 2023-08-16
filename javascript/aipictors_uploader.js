//アップロードボタンが押された際の動作
const pictors_url = "https://www.aipictors.com/post/"

const window_width = 400
const window_height = 600

const window_pos_x = screen.width - window_width
const window_pos_y = 0

onUiLoaded(function() {gradioApp().querySelectorAll("#upload_to_aipictors_button").forEach(btn => btn.addEventListener("click", onClick))})

function openPopup(extension,base64Data) {
	let url = ""
	if(extension === null){url = pictors_url}
	else{url = pictors_url + "#image/" + extension + ";base64," + base64Data}
	//window.open(url, "_blank", `width=${window_width},height=${window_height},left=${window_pos_x},top=${window_pos_y}`)
	//ポップアップブロック回避のため、別タブで開く
	//window.open(url)
	window.open(url, '_blank');
}

function noImgAlert(){
	alert("アップロードできる画像がありません")
}
function onClick() {
	const tab = gradioApp().getElementById('tabs').getElementsByClassName("selected")[0].textContent.toString()
	let selectedIndex = selected_gallery_index()
	let selectedButton = null
	let imgElement =　null
	let imgSrc = null

	//一覧表示の場合
	if (selectedIndex == -1) {
		try{
			if(tab.includes("txt2img")){
				imgElement = document.getElementById("txt2img_gallery").querySelector('img')
			}else if(tab.includes("img2img")){
					imgElement = document.getElementById("img2img_gallery").querySelector('img')
			}else{//起こるはずはないが、txt2imgタブかimg2imgタブ以外でボタンが押された場合
				noImgAlert()
				return
			}
		}catch{ // 画像がなかった場合
			noImgAlert()
			return
		}
	}else{//詳細表示の場合
		selectedButton = all_gallery_buttons()[selectedIndex]
		if(selectedButton == null){return}
		imgElement = selectedButton.querySelector('img')
	}
	try{
		imgSrc = imgElement.getAttribute('src')
	}catch{
		noImgAlert()
		return
	}

	const extension = imgSrc.split('/').pop().split('.').pop()

	fetch(imgSrc)
    .then(response => {
        if (!response.ok) {
            throw new Error('レスポンスエラー')
        }
        return response.blob()
    })
    .then(blob => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1]
            openPopup(extension, base64Data)
        }
        reader.readAsDataURL(blob)
    })
    .catch(error => {
        alert('画像の取得に失敗しました', error)
    })
}

