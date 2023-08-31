#アップロードボタンの作成
from modules import scripts, script_callbacks, shared
from modules.ui_components import ToolButton
import gradio as gr
import os

class Script(scripts.Script):
    def title(self):
        return "Aipictors Uploader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def after_component(self, component, **kwargs):
        #バージョン1.5.2からUIが変更されたため、以前のバージョンと処理を分ける
        if(kwargs.get("elem_id") == "extras_tab"):
            gr.Button(value="Upload to Aipictors", elem_id="upload_to_aipictors_button_before_151")
        elif(kwargs.get("elem_id") == "txt2img_send_to_extras"):
            ToolButton(value="", elem_id="txt2img_upload_to_aipictors_button")
        elif(kwargs.get("elem_id") == "img2img_send_to_extras"):
            ToolButton(value="", elem_id="img2img_upload_to_aipictors_button")
    def ui(self, is_img2img):
        pass

def on_ui_settings():
    section = ('aipictors_uploader', "Aipictors Uploader")
    icon = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')),f"imgs{os.sep}logo.svg")
    shared.opts.add_option("aipictors_icon", shared.OptionInfo(icon, "Icon (1.6.0 or later only)", section=section))


script_callbacks.on_ui_settings(on_ui_settings)
