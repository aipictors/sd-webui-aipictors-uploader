#アップロードボタンの作成
import modules.scripts as scripts
import gradio as gr

class Script(scripts.Script):
    def title(self):
        return "Aipictors Uploader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def after_component(self, component, **kwargs):
         if kwargs.get("elem_id") == "extras_tab":
            gr.Button(value="Upload to Aipictors", elem_id="upload_to_aipictors_button")

    def ui(self, is_img2img):
        pass
