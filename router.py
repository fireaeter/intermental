import controller
import falcon

app = falcon.API()

app.add_route('/api/users/', controller.Users_controller())
app.add_route('/api/users/{login}', controller.User_controller())
app.add_route('/api/users/{login}/posts', controller.Entries_controller())
