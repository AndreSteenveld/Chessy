/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
module.exports = {
    
    //Game: require( "./Game" ),
    //Player: require( "./Player" ),
    
    board: {
        Board: require( "./board/Board" ),
        Field: require( "./board/Field" )    
    },
    
    pieces: {
        Pawn:   require( "./pieces/Pawn" ),
        Knight: require( "./pieces/Knight" ),
        Bishop: require( "./pieces/Bishop" ),
        Rook:   require( "./pieces/Rook" ),
        Queen:  require( "./pieces/Queen" ),
        King:   require( "./pieces/King" )
    },
    
    version: {
        major: 0,
		minor: 3,
		revision: 0,
		
		toString: function( ){
			return "[Chess version: " + this.major + "." + this.minor + "." + this.revision + "]";						
		}        
    }    
};

Object.freeze( module.exports );
Object.keys( module.exports )
    .forEach( function( key ){ 
        typeof module.exports[ key ] === "object" 
            && Object.freeze( module.exports[ key ] ); 
    });
    