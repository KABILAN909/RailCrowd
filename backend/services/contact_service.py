import json
import os

DATA_FILE = "data/contacts.json"


def save_contact(contact):

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            contacts = json.load(file)
    else:
        contacts = []

    contacts.append(contact)

    with open(DATA_FILE, "w") as file:
        json.dump(contacts, file, indent=4)

    return True