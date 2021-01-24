// Javascript file for handling interactions between the two layers of the game, the chess and go layers.
//================================================================================================================

// Need to kill the king when he wanders into enemy territory
// Square counts as under a player's territory if, for each of its four corners:
// - It is occupied by a player's stone, or
// - The point is empty, but falls under territory (go) controlled by the player

// For the point aspect,
// - If it is part of the eye of a living group, and there are no enemy stones in the eye, then it should kill the king
// - If same as above, but there are enemy stones in the eye, the king should live, until the stones are cleared out
// - If it is part of the eye of a dying group, but there are no stones within, the king should be killed
// - If same as above, but enemy stones are present, the king should live
// - For all other situations involving killing the king via territory, the king should live
