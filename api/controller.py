import json
import falcon
import ipfsapi
from api import models


api = ipfsapi.connect('127.0.0.1', 5001)


class Users(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response):
        print(req.get_param('login'))
        users = models.Users()
        all_users = users.get()
        resp.body = json.dumps(all_users)
    
    def on_post(self, req: falcon.Request, resp: falcon.Response):
        self.data = req.stream.read()
        print(self.data)
        self.users= models.Users()
        self.users_add = self.users.add(self.data)
        if self.users_add is not False:
            resp.status = falcon.HTTP_200
        else:
            resp.status = falcon.HTTP_400

class User(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login):
        user = models.User()
        resp.body = json.dumps(user.get(login))


class Entries(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login):
        self.range = req.get_param_as_list('range')
        self.first_range = self.range[0]
        self.second_range = self.range[1]
        # print(self.second_range)
        _entries = models.Entries()
        resp.body = json.dumps(_entries.get(login, int(self.first_range), int(self.second_range)))

    def on_post(self, req: falcon.Request, resp: falcon.Response, login):
        self.data = json.loads(req.stream.read().decode())
        print(self.data)
        models.Entries().add(login, self.data)

class Entry(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, login, header):
        entry = models.Entry()
        entry = entry.get(login, header)
        resp.body = entry.decode()

class Search(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, query):
        search = models.Search(query)
        result = search.get()
        resp.body = json.dumps(result)