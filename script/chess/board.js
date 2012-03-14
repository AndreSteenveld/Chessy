define( [ 
	".",            
	"./board",      
	"./board/Board" /*jsl:import ./board/Board.js*/
], function( chess, board ){

	return ( chess.board = board );
	
});