import ujson
import re
from api.views.books.models import Books
from dataclasses import dataclass


@dataclass
class Search:
    query: str

    async def search(self):
        self.query = self.query.lower()
        books = Books()
        books_list = await books.get_names()
        response = []
        pattern = re.compile(self.query)
        for book in books_list:
            if pattern.search(book.lower()) is not None:
                response.append(book)
        return response
