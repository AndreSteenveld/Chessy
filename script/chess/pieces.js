/*
 *	Copyright (C) 2012 Andr� jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [
	".",
	"./pieces", /*jsl:import ./pieces/Piece.js*/
	
	"./pieces/Pawn",   /*jsl:import ./pieces/Pawn.js*/
	"./pieces/Knight", /*jsl:import ./pieces/Knight.js*/
	"./pieces/Bishop", /*jsl:import ./pieces/Bishop.js*/
	"./pieces/Rook",   /*jsl:import ./pieces/Rook.js*/
	"./pieces/Queen",  /*jsl:import ./pieces/Queen.js*/
	"./pieces/King"    /*jsl:import ./pieces/King.js*/
	
], function( chess, pieces ){
	
	return ( chess.pieces = pieces );
	
});