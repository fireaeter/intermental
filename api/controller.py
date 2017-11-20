import json
import falcon
import ipfsapi
from api import models


api = ipfsapi.connect('127.0.0.1', 5001)


class Users(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response):
        users = models.Users()
        all_users = users.get()
        resp.body = json.dumps(all_users)


class User(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login):
        user = models.User()
        resp.body = json.dumps(user.get(login))


class Entries(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login):
        _entries = models.Entries()
        resp.body = json.dumps(_entries.get(login))


class Entry(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login, header):
        entry = models.Entry()
        entry = entry.get(login, header)
        resp.body = entry.decode()
