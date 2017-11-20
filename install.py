import ipfsapi
import io
import json
from termcolor import colored


def install():
    print("\n")
    print("start installation...\n")
    api = ipfsapi.connect('127.0.0.1', 5001)
    print(colored("making entry_list.json file...\n", 'yellow'))
    entries = [
        {'path': '/user/romka/entry/Test', 'user' : 'romka', 'header' : 'header'},
        {'path': '/user/romka/entry/Test123', 'user' : 'romka', 'header' : 'header'}
    ]
    json_entries = json.dumps(entries).encode()
    api.files_write("/entry_list.json", io.BytesIO(json_entries), create=True)
    print(colored('Success!\n', 'green'))
if __name__ == "__main__":
    install()
