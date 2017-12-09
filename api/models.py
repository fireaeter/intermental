import json
import ipfsapi
import io
import re
from lib.blockchain import Chain
from lib.exceptions import BlockchainException
from datetime import datetime

ipfs_client: ipfsapi.Client = ipfsapi.connect('127.0.0.1', 5001)


class Book(object):
    def __init__(self, current_book):
        self.current_book = current_book
    def check(self):
        self.all_books = json.dumps(ipfs_client.files_ls("/intermental"))
        self.all_books = json.loads(self.all_books)['Entries']
        self.all_books_list = []
        if self.all_books is not None:
            for i in range (len(self.all_books)):
                self.all_books_list.append(self.all_books[i]['Name'])
            if self.current_book in self.all_books_list:
                return True
            else:
                return False
        else:
            return False

    def get(self):
        self.current_book_exist_status = self.check()
        if self.current_book_exist_status is True: 
            chain = Chain(ipfs_client, '/intermental/%s' % self.current_book)
            self.current_book_posts_num = len(ipfs_client.files_ls('/intermental/%s' % self.current_book)['Entries'])
            self.current_book_info_list = json.loads(json.dumps(chain.get_range(1, 0)))
            self.current_book_info_list.append(self.current_book_posts_num)
            return json.dumps(self.current_book_info_list)
        else:
            return False
    
class Books(object):
    def get(self):
        self.all_books = json.dumps(ipfs_client.files_ls("/intermental"))
        self.all_books = json.loads(self.all_books)['Entries']
        self.all_books_list = []
        self.all_books_num = len(self.all_books)
        for i in range (self.all_books_num):
            self.all_books_list.append(self.all_books[i]['Name'])
        return self.all_books_list

    def add(self, data):
        self.current_book_data = json.loads(data.decode())
        self.current_book_name = self.current_book_data['book_name']
        self.current_book_password = self.current_book_data['book_password']
        self.current_book_author_name = self.current_book_data['book_author']
        self.current_book_keywords = self.current_book_data['book_keywords']
        self.current_book_author_birthday = self.current_book_data['birthday']
        self.current_book_date = datetime.strftime(datetime.now(), "%Y.%m.%d %H:%M:%S")
        self.book = Book(self.current_book_name)
        self.current_book_exist_status = self.book.check()
        if self.current_book_exist_status is True:
            return False
        else:
            ipfs_client.files_mkdir("/intermental/%s" % self.current_book_name)
            self.current_book_info = dict([('book_name', self.current_book_name), ('author_name', self.current_book_author_name) ,('keywords', self.current_book_keywords), ('author_birthday', self.current_book_author_birthday), ('created_date', self.current_book_date)])
            chain = Chain(ipfs_client, '/intermental/%s' % self.current_book_name, self.current_book_password)
            chain.add(self.current_book_info)
            return True

class Book_Entries(object):
    def __init__(self, current_book):
        self.current_book = current_book
    def get(self, first_range, second_range):
        current_book_exist_status = Book(self.current_book).check()
        if current_book_exist_status is True:
            chain = Chain(ipfs_client, '/intermental/%s' % self.current_book)
            return chain.get_range()
        else:
            return False

    def add(self, data):
        print(self.current_book)
        self.current_book_password = data["password"]
        self.current_book_entry_header = data['header']
        self.current_book_entry_content = data['content']
        self.current_book_entry_date = datetime.strftime(datetime.now(), "%Y.%m.%d %H:%M:%S")
        self.current_book_entry_info_dict = dict([('header', self.current_book_entry_header), ('content', self.current_book_entry_content), ('date', self.current_book_entry_date)])
        chain = Chain(ipfs_client, '/intermental/'+self.current_book+'/', self.current_book_password)
        if chain.add({'header': self.current_book_entry_header, 'content': self.current_book_entry_content, 'date': self.current_book_entry_date}) is True:
            return True
        else:
            return False

class Search(object):
    def __init__(self, query):
        self.query = query
    
    def get(self):
        books = Books()
        all_books = books.get()
        all_books_num = len(all_books)
        all_suitable_results = []
        pattern = re.compile(self.query)
        for i in range(all_books_num):
            search_result = pattern.findall(all_books[i])
            search_result_num = len(search_result)
            if search_result_num is not 0:
                all_suitable_results.append(all_books[i])
        return all_suitable_results
    