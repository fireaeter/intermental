import json
import ipfsapi
import io
import re
from lib.blockchain import Chain
from lib.exceptions import BlockchainException
from datetime import datetime

ipfs_client: ipfsapi.Client = ipfsapi.connect('127.0.0.1', 5001)


class User(object):
    def check(self, username):
        self.users = json.dumps(ipfs_client.files_ls("/intermental"))
        self.users = json.loads(self.users)['Entries']
        self.users_list = []
        if self.users is not None:
            for i in range (len(self.users)):
                self.users_list.append(self.users[i]['Name'])
            if username in self.users_list:
                return True
            else:
                return False
        else:
            return False

    def get(self, login):
        self.user_exist = self.check(login)
        if self.user_exist is True: 
            chain = Chain(ipfs_client, '/intermental/%s' % login)
            self.posts_num = ipfs_client.files_ls('/intermental/%s' % login)
            return chain.get_range(1, 0), len(self.posts_num['Entries'])
        else:
            return False
    
class Users(object):
    def get(self):
        self.users = json.dumps(ipfs_client.files_ls("/intermental"))
        self.users = json.loads(self.users)['Entries']
        self.users_list = []
        self.users_length = len(self.users)
        for i in range (self.users_length):
            self.users_list.append(self.users[i]['Name'])
        return self.users_list

    def add(self, data):
        self.data = json.loads(data.decode())
        self.login = self.data['login']
        self.password = self.data['password']
        self.email = self.data['email']
        self.blog_name = self.data['blog_name']
        self.keywords = self.data['keywords']
        self.birthday = self.data['birthday']
        self.date = datetime.strftime(datetime.now(), "%Y.%m.%d %H:%M:%S")
        self.user_exist = User.check(self, self.login)
        if self.user_exist is True:
            return False
        else:
            # self.profile = io.BytesIO(json.dumps({'login': self.login, 'password': self.password}).encode())
            ipfs_client.files_mkdir("/intermental/%s" % self.login)
            user_info = dict([('email', self.email), ('blog_name', self.blog_name), ('keywords', self.keywords), ('birthday', self.birthday), ('created_date', self.date)])
            chain = Chain(ipfs_client, '/intermental/%s' % self.login, self.password)
            chain.add(user_info)
            return True

class Entry(object):
    def check(self, login, entry):
        self.user_exist = User.check(self, login)
        if self.user_exist is True:
            self.entry = json.dumps(ipfs_client.files_ls("/user/%s/entry" % login))
            self.entry = json.loads(self.entry)['Entries']
            self.entry_list = []
            for i in range (len(self.entry)):
                self.entry_list.append(self.entry[i]['Name'])
            if entry in self.entry_list:
                return True
            else:
                return False
    
    def get(self, login, header):
        if self.check(login, header) is True:
            self.entry = ipfs_client.files_read("/user/%s/entry/%s" % (login, header))
            return self.entry

class Entries(object):
    def get(self, login, first_range, second_range):
        user_exist = User().check(login)
        if user_exist is True:
            chain = Chain(ipfs_client, '/intermental/%s' % login)
            return chain.get_range(first_range, second_range)
        else:
            return False
    def add(self, login, data):
        self.login = login
        self.password = data["password"]
        self.header = data['header']
        self.content = data['content']
        self.post_dict = dict([('header', self.header), ('content', self.content)])
        chain = Chain(ipfs_client, '/intermental/%s' % self.login, self.password)
        chain.add(self.post_dict)

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
        return all_completed_users
    