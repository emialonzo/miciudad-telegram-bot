[![Stories in Ready](https://badge.waffle.io/emialonzo/miciudad-telegram-bot.png?label=ready&title=Ready)](https://waffle.io/emialonzo/miciudad-telegram-bot)
# miciudad-telegram-bot
Bot de telegram para interactuar con http://miciudad.org.py/

## Requisitos

Docker: v. 1.10.0+

Docker Compose: v. 1.5.2+

(ref: https://docs.docker.com/compose/compose-file/compose-versioning/)

## Configurar
Obtener un token para el bot en https://telegram.me/BotFather. Luego renombrar el archivo `.env.template` como `.env` y sustituir el token con el token obtenido desde el *BotFather*.

## Ejecutar 
Levantar docker con node
`docker-compose up`
