// Javascript file for handling interactions between the two layers of the game, the chess and go layers.
//================================================================================================================

// Need to kill the king when he wanders into enemy territory
// Square counts as under a player's territory if, for each of its four corners:
// - It is occupied by a player's stone, or
// - The point is empty, but falls under territory (go) controlled by the player

// In this game, pawns can kill stones by capturing them, which moves the pawn to the square diagonal to
// its previous square, connected by the stone
function pawnCapturesStone() {}
