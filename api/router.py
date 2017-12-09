import falcon
from api import controller

app = falcon.API()

app.add_route('/api/books/', controller.Books())
app.add_route('/api/books/{book}', controller.Book())
app.add_route('/api/books/{book}/posts', controller.Book_Entries())
# add blockchain search to use its path!
# app.add_route('/api/books/{book}/posts/{header}', controller.Book_Entry())
app.add_route('/api/search/{query}', controller.Search())