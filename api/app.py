import ipfsapi
import api.config as config
from aiohttp import web
from api.route_table import add_routes

ipfs_client: ipfsapi.Client = ipfsapi.connect(config.IPFS_HOST, config.IPFS_PORT)

app = web.Application()
app.router.add_routes(add_routes())
