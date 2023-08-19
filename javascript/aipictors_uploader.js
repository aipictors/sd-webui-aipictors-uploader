//アップロードボタンが押された際の動作
const post_page_url = "https://www.aipictors.com/post/";
const post_image_url = "https://www.aipictors.com/wp-content/themes/AISite/post-img-cache.php";

//ポップアップウィンドウの設定
const window_width = 400;
const window_height = 600;
const window_pos_x = screen.width - window_width;
const window_pos_y = 0;

//アイコンの設定(1.6.0以降用)
const icon_width = "1.4em";
let txt2img_upload_button = null;
let img2img_upload_button = null;
let txt2imgIconElement = null;
let img2imgIconElement = null;

const iconStyles = {
    "min-width": icon_width,
    "max-width": icon_width
};

onUiUpdate(function() {getIcon();});

function getIcon() {
    if(txt2img_upload_button == null || img2img_upload_button == null) {return;}
    const iconPath = opts["aipictors_icon_path"];
    if(iconPath == null){return;}
    setIcon(iconPath);
}

function setIcon(iconPath) {
    //URLではなく、ファイルパスの場合
    if(!iconPath.startsWith("http://") && !iconPath.startsWith("https://")){
        iconPath = "file=" + iconPath;
    }
    if(txt2imgIconElement == null){
        txt2imgIconElement = create_img_element(txt2img_upload_button);
        img2imgIconElement = create_img_element(img2img_upload_button);
    }
    txt2imgIconElement.src = iconPath;
    img2imgIconElement.src = iconPath;
}

function create_img_element(button) {
    const iconElement = document.createElement("img");
    Object.assign(iconElement.style, iconStyles);
    button.appendChild(iconElement);
    return iconElement;
}

onUiLoaded(function() {
    //バージョン1.6.0からUIが変更されたため、以前のバージョンと処理を分ける
    gradioApp().querySelectorAll("#upload_to_aipictors_button_before_151").forEach(btn => btn.addEventListener("click", onClick));

    txt2img_upload_button = gradioApp().querySelector("#txt2img_upload_to_aipictors_button");
    if(txt2img_upload_button != null){
        txt2img_upload_button.addEventListener("click", onClick);
    }
    img2img_upload_button = gradioApp().querySelector("#img2img_upload_to_aipictors_button");
    if(img2img_upload_button != null){
        img2img_upload_button.addEventListener("click", onClick);
    }
});

function openPopup(base64Data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", post_image_url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.result === "success") {
                    const nanoid = response.nanoid;
                    const newTabUrl = `${post_page_url}?cache=${nanoid}`;
                    window.open(newTabUrl, "_blank", `width=${window_width},height=${window_height},left=${window_pos_x},top=${window_pos_y}`);
                } else if (response.result === "oversize") {
                    alert("画像サイズが大きいです。");
                } else if (response.result === "noimage") {
                    alert("空の画像が送信されました。");
                } else {
                    alert("エラーが発生しました。");
                }
            } else {
                alert("リクエストが失敗しました。");
            }
        }
    };

    const formData = new FormData();
    const blob = new Blob([base64Data], {type: "text/plain"});
    formData.append("imageData", blob);
    xhr.send(formData);
}

function onClick() {
    const tab = gradioApp().getElementById('tabs').getElementsByClassName("selected")[0].textContent.toString();
    let selectedIndex = selected_gallery_index();
    let selectedButton = null;
    let imgElement = null;
    let imgSrc = null;

    //一覧表示の場合
    if (selectedIndex == -1) {
        try{
            if(tab.includes("txt2img")){
                imgElement = gradioApp().getElementById("txt2img_gallery").querySelector('img');
            }else if(tab.includes("img2img")){
                imgElement = gradioApp().getElementById("img2img_gallery").querySelector('img');
            }else{//起こるはずはないが、txt2imgタブかimg2imgタブ以外でボタンが押された場合
                noImgAlert();
                return;
            }
        }catch{ // 画像がなかった場合
            noImgAlert();
            return;
        }
    }else{//詳細表示の場合
        selectedButton = all_gallery_buttons()[selectedIndex];
        if(selectedButton == null){return;}
        imgElement = selectedButton.querySelector('img');
    }
    try{
        imgSrc = imgElement.getAttribute('src');
    }catch{
        noImgAlert();
        return;
    }

    fetch(imgSrc)
        .then(response => {
            if (!response.ok) {
                throw new Error('レスポンスエラー');
            }
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result;
                openPopup(base64Data);
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            alert('画像の取得に失敗しました', error);
        });
}

function noImgAlert(){alert("アップロードできる画像がありません");}
