/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose = require( "compose" ),
    Piece   = require( "./Piece" );
    
module.exports = Compose(

    Piece,
    
    {
		type: "Rook",
		
		movement: Compose.around( function( base ){
			return function( ){
			    return base.call( this, [
    				[ this.x,  Infinity ],
    				[ this.x, -Infinity ],
    				[ Infinity,  this.y ],
    				[ -Infinity, this.y ]
			    ]);
			};			
		})
	}
    
);