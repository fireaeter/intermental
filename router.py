import controller
import falcon

app = falcon.API()

app.add_route('/api/users/', controller.Users_controller())
app.add_route('/api/users/{login}', controller.User_controller())
app.add_route('/api/users/{login}/posts', controller.Entries_controller())
app.add_route('/api/users/{login}/posts/{header}', controller.Entry_controller())
app.add_route('/api/posts', controller.All_Entries_controller())
