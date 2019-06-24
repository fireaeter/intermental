import re
import attr
from api.views.book.models import Book
from api.views.books.models import Books


@attr.s(slots=True)
class Search:
    query: str = attr.ib()

    async def search(self):
        self.query = self.query.lower()
        books = Books()
        books_list = await books.get_names()
        response = []
        pattern = re.compile(self.query)
        for name in books_list:
            if pattern.search(name.lower()) is not None:
                book = Book(name=name)
                info = await book.get_first_block()
                response.append(info)
        return response
