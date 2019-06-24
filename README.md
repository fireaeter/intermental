# INTERMENTAL
Telegram bot that allows you to monitor the status of microservices
For use it you must create your telegram bot. See <https://core.telegram.org/bots#creating-a-new-bot>

## Requirements
- `python 3.6 or higher`

## Configuration variables
 _used in the config.ini_
 - `api_token` - Telegram API TOKEN
 - `lifetime` - codeword limetime
 - `salt` - hashids salt
 - `address` - websocket address
 - `port` - websocket port
 - `route` - websocket route
 - `chat_id` - admin chat_id
 - `username` - admin username
 
## Installation
- build notifire image from Dockerfile `docker build -t notifire .`
- run redis container `docker run --name redis_db -d redis redis-server --appendonly yes`
- run notifire container `docker run -e REDIS_HOST=redis_db --name _container name_ --link redis_db:redis_db -it notifire bash`

## Using
- After running the notifire container for the first time, wait for the installation to complete. During the installation, the codeword and the service_key will be generated. Use them to get started with the bot.
- Write in telegram to your bot `/start _your_codeword_`

To connect to the bot's web socket, the client must pass the following parameters
- `service_name`
- `service_key` 