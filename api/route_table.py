from aiohttp import web
routes = web.RouteTableDef()


def add_routes():
    global routes
    from api.views.books import view
    from api.views.book import view
    from api.views.notes import view
    from api.views.note import view
    from api.views.search import view
    # todo: вставить остальные view
    print(routes)
    return routes
