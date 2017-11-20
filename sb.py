from marshmallow import Schema, fields

class BandMemberSchema(Schema):
    name = fields.String(required=True)
    email = fields.Email()

user_data = [
    {'email': 'mick@stones.com', 'name': 'Mick'},
    {'email': 'keith@stones.com', 'name': 'Keith'},
    {'email': 'charlie@stones.com', 'name': 'Romka'},  # missing "name"
]

result = BandMemberSchema(many=True).load(user_data)
print(result.errors)