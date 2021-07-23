# Chess-vs-Go
A web game that combines the classic games of chess and go in a new and interesting way, by using the idea of stones being placed on corners of a square, and pieces being placed on the squares themselves. The site can be found [here](https://protected-ravine-01841.herokuapp.com/), but before playing you must first familiarize yourself with the [rules](https://protected-ravine-01841.herokuapp.com/rules.html). Also, since I am still relatively new at programming, errors are bound to pop up on site navigation (but not on gameplay, since that is the point of the site it is relatively solid). If you find any error or something you think I could improve on the site, do not hesitate to create and issue on here.

## Installation
The site can be played on any modern browser.

## Usage
Once you are on the homepage, enter a tagname, and request a game against another opponent, or accept another's request in the lobby. For each game, each player has 90 seconds to make a move. The game ends when a king is killed. Refer to rules page for details.

## Next steps
Some of the things to add to gameplay include:
- **Promotion**: The ability to promote a pawn to an official piece in this new game will involve various factors, and will be added to the game as it develops. The idea is that the pawn will have to enter an enemy zone to promote, but if a zone is formed _around_ the pawn, it will be killed. Once promoted, the official will only be killed if it moves to another enemy zone, it is killed by an enemy official, or the zone it is on is destroyed and reformed. Basically, it will not be killed for staying in the zone it was formed in. As you can see, this will be somewhat challenging to code, which is why it isn't already a feature. 
- **Castling**: Similar to promotion, the concept of castling must be modified to make sense in this game. My plan is that castling will only be possible if neither the king nor the rook have moved since the rook is summoned, they share a file or rank, and none of the squares between them are occupied by enemy pieces or blocked by stones.
- **Ko**: This is a programming challenge, that I simply have not gotten around to yet. Will be implemented.

Once a new mechanic is added to the game, not only will the Rules page be updated, but this page will be as well. So be sure to check back frequently if you are interested in the game.

## Special thanks
Special thanks go to:
- duckpunch's [godash](https://github.com/duckpunch/godash/), a library that not only contains the logic for playing the game of Go, but is also flexible enough for users to place and remove stones ignoring the rules of Go, a feature crucial to the development of this game, and with no equivalent in chess libraries (that I could find, so I had to code the entire ruleset and logic for the chess portion of this game myself :unamused:).
- bryanrasmussen's [TilerTheCreator](https://github.com/bryanrasmussen/TilerTheCreator), and by extension isohedral's [tactile-js](https://github.com/isohedral/tactile-js), a tiling library that allows one to create any tiled pattern on a surface, used to create the honeycomb pattern for zones in this game.

