import falcon
from api import controller

app = falcon.API()

app.add_route('/api/users/', controller.Users())
app.add_route('/api/users/{login}', controller.User())
app.add_route('/api/users/{login}/posts', controller.Entries())
app.add_route('/api/users/{login}/posts/{header}', controller.Entry())
