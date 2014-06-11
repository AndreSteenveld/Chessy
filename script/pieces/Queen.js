/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose = require( "compose" ),
    Piece   = require( "./piece" );
    
module.exports = Compose(

    Piece,
    
    {
		type: "Queen",
		
		movement: Compose.around( function( base ){
			return function( ){
			    return base.call( this, [
    				[ this.x, Infinity  ],
    				[ this.x, -Infinity ],
    				[ Infinity,  this.y ],
    				[ -Infinity, this.y ],
    				[  Infinity,  Infinity ],
    				[ -Infinity, -Infinity ],
    				[  Infinity, -Infinity ],
    				[ -Infinity,  Infinity ] 
    			]);
            }
		})
	}
);