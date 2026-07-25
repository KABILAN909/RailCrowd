import json


def load_trains():
    with open("data/trains.json", "r") as file:
        return json.load(file)


def get_train_by_id(train_id):
    trains = load_trains()

    for train in trains:
        if train["id"] == train_id:
            return train

    return None