import json
import ipfsapi
import io
import re

api = ipfsapi.connect('127.0.0.1', 5001)


class User(object):
    def check(self, username):
        self.users = json.dumps(api.files_ls("/user"))
        self.users = json.loads(self.users)['Entries']
        self.users_list = []
        for i in range (len(self.users)):
            self.users_list.append(self.users[i]['Name'])
        if username in self.users_list:
            return True
        else:
            return False

    def get(self, login):
        self.user_exist = self.check(login)
        if self.user_exist is True: 
            self.user = api.files_read("/user/%s/profile.json" % login).decode()
            return self.user
        else:
            return False
    
class Users(object):
    def get(self):
        self.users = json.dumps(api.files_ls("/user"))
        self.users = json.loads(self.users)['Entries']
        self.users_list = []
        self.users_length = len(self.users)
        for i in range (self.users_length):
            self.users_list.append(self.users[i]['Name'])
        return self.users_list

    def add(self, data):
        self.data = json.loads(data.decode())
        print(self.data['login']) 
        self.login = self.data['login']
        self.password = self.data['password']
        self.user_exist = User.check(self, self.login)
        if self.user_exist is True:
            return False
        else:
            self.profile = io.BytesIO(json.dumps({'login': self.login, 'password': self.password}).encode())
            api.files_mkdir("/user/%s" % self.login)
            api.files_mkdir("/user/%s/entry" % self.login)
            api.files_write("/user/%s/profile.json" % self.login, self.profile, create = True)
            return True

class Entry(object):
    def check(self, login, entry):
        self.user_exist = User.check(self, login)
        if self.user_exist is True:
            self.entry = json.dumps(api.files_ls("/user/%s/entry" % login))
            self.entry = json.loads(self.entry)['Entries']
            self.entry_list = []
            for i in range (len(self.entry)):
                self.entry_list.append(self.entry[i]['Name'])
            # смотрим есть ли юзер среди всех
            if entry in self.entry_list:
                return True
            else:
                return False
    
    def get(self, login, header):
        if self.check(login, header) is True:
            self.entry = api.files_read("/user/%s/entry/%s" % (login, header))
            return self.entry

class Entries(object):
    def get(self, login):
        user_exist = User().check(login)
        if user_exist is True:
            self.all_user_entries = api.files_ls("/user/%s/entry" % login)
            self.all_user_entries = self.all_user_entries['Entries']
            self.user_entries_in_list = []
            for i in range (len(self.all_user_entries)):
                self.user_entries_in_list.append(self.all_user_entries[i]['Name'])
            return self.user_entries_in_list
        else:
            return False
class All_Entries(object):
    def get(self):
        self.all_entries = api.files_read("/entry_list.json")
        self.all_entries_in_json = json.loads(self.all_entries.decode())
        self.len_json_entries = len(self.all_entries_in_json)
        self.all_entries_in_list = []
        self.current_entry = str()
        for i in range(self.len_json_entries):
            self.current_entry = api.files_read(self.all_entries_in_json[i]['path'])
            self.all_entries_in_list.append(self.current_entry.decode())
        return self.all_entries_in_list

class Search(object):
    def __init__(self, query):
        self.query = query
    
    def get(self):
        users = Users()
        all_users = users.get()
        all_users_len = len(all_users)
        all_completed_users = []
        pattern = re.compile(self.query)
        for i in range(all_users_len):
            result = pattern.findall(all_users[i])
            result_len = len(result)
            if result_len is not 0:
                all_completed_users.append(all_users[i])
        return json.dumps(all_completed_users)