from validator import UserSchema
from models import User
from models import Users
from models import Entries
from models import Entry
from models import All_Entries
import falcon
import ipfsapi
import json
import io


api = ipfsapi.connect('127.0.0.1', 5001)


def validate_user(req, resp, resource, params):
    data = req.stream.read()
    validator = UserSchema()
    result = validator.load(json.loads(data.decode()))
    result_errors_length = len(result.errors)
    if result_errors_length is not 0:
        resp.status = falcon.HTTP_400
    else:
        users = Users()
        users.add(data)
        resp.status = falcon.HTTP_200

class Users_controller(object):
    def on_get(self, req, resp):
        users = Users()
        all_users = users.get()
        resp.body = json.dumps(all_users)
    @falcon.before(validate_user)
    def on_post(self, req, resp):
        pass

class User_controller(object): 
    def on_get(self, req, resp, login):
        user = User()
        resp.body = json.dumps(user.get(login))

class Entries_controller(object):
    def on_get(self, req, resp, login):
        _entries = Entries()
        resp.body = json.dumps(_entries.get(login))

class Entry_controller(object):
    def on_get(self, req, resp, login, header):
        entry = Entry()
        entry = entry.get(login, header)
        resp.body = entry.decode()

class All_Entries_controller(object):
    def on_get(self, req, resp):
        entries = All_Entries().get()
        resp.body = json.dumps(entries)