# Game Time

![Game Time](https://media.giphy.com/media/pPmTlpumKEmj1xYQHD/giphy.gif)

This is the source code for all-in-one solution to play games in Ueno offices.

## How it works

1. Exposed API can add gametime request to a MQTT queue
2. On-site device will read from the queue and:
   1. Turn on the projector
   2. Pull down the projector screen
   3. Turn on the PS4 and run the desired game

## How to run

1. Slack command `/gametime FIFA`
2. Via action from a set timer that asks "Is it gametime yet?" on a slack channel.
3. With one of the supported interfaces:
   1. REST
   2. GraphQL
   3. Protobuf
   4. SOAP
   5. XML-RCP
   6. FTP
   7. POP

## How to stop playing

https://www.webmd.com/mental-health/addiction/video-game-addiction
