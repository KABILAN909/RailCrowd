import json


# Load all trains
def load_trains():
    with open("data/trains.json", "r") as file:
        return json.load(file)


# Load all stations
def load_stations():
    with open("data/stations.json", "r") as file:
        return json.load(file)


# Get train by ID
def get_train_by_id(train_id):
    trains = load_trains()

    for train in trains:
        if train["id"] == train_id:
            return train

    return None