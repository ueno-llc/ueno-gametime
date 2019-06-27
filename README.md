# Game Time

This is the source code for all-in-one solution to play games in Ueno offices.

## How it works

1. Exposed API can add gametime request to a MQTT queue
2. On-site device will read from the queue and:
   a) Turn on the projector
   b) Pull down the projector screen
   c) Turn on the PS4 and run the desired game

## How to run

1. Slack command `/gametime FIFA`
2. Via action from a set timer that asks "Is it gametime yet?" on a slack channel.
3. With one of the supported interfaces:
   a) REST
   b) GraphQL
   c) Protobuf
   d) SOAP
   e) XML-RCP
   f) FTP
   g) POP

## How to stop playing

https://www.webmd.com/mental-health/addiction/video-game-addiction
