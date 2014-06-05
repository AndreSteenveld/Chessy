/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ 
	".",            
	"./board",      
	"./board/Board" /*jsl:import ./board/Board.js*/
], function( chess, board ){

	return ( chess.board = board );
	
});