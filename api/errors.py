PARSING_JSON = {
    'code': 1,
    'message': "Error while parsing json data"
}


class Errors:
    def __init__(self):
        self.errors = []

    async def push(self, error):
        self.errors.append(error)

    async def get(self):
        return {
            'errors': self.errors
        }
