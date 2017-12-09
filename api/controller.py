import json
import falcon
import ipfsapi
from api import models


api = ipfsapi.connect('127.0.0.1', 5001)


class Book(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, book):
        self.current_book = book
        self.book = models.Book(self.current_book)
        resp.body = json.dumps(self.book.get())

class Books(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response):
        books = models.Books()
        all_books_list = books.get()
        resp.body = json.dumps(all_books_list)
    
    def on_post(self, req: falcon.Request, resp: falcon.Response):
        self.data = req.stream.read()
        self.books = models.Books()
        self.book_add = self.books.add(self.data)
        if self.book_add is not False:
            resp.status = falcon.HTTP_200
        else:
            resp.status = falcon.HTTP_400


class Book_Entries(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, book):
        self.current_book = book
        self.range = req.get_param_as_list('range')
        self.first_range = self.range[0]
        self.second_range = self.range[1]
        current_book_entries = models.Book_Entries(self.current_book)
        resp.body = json.dumps(current_book_entries.get(int(self.first_range), int(self.second_range)))

    def on_post(self, req: falcon.Request, resp: falcon.Response, book):
        self.data = json.loads(req.stream.read().decode())
        self.book_entry = models.Book_Entries(book)
        self.book_entry.add(self.data)
        if self.book_entry.add(self.data) is True:
            resp.status = falcon.HTTP_200

class Search(object):
    def on_get(self, req: falcon.Request, resp: falcon.Response, query):
        search = models.Search(query)
        result = search.get()
        resp.body = json.dumps(result)