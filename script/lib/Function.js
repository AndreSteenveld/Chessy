/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "." ], function( lib ){

	//Function.bind = function( scope, args, func ){ };
	//
	//Function.onIdle = function( scope, /* timeout */ a1, /* arguments */ a2, /* function */ a3 ){ };
	//
	//Function.async = function( scope, /* timeout */ a1, /* arguments */ a2, /* function */ a3 ){ };
	//
	//Function.prototype.onIdle = function( a1, a2, a3, ){ return Function.onIdle( a1, a2, a3, this ); };
	//Function.prototype.async  = function( a1, a2, a3, ){ return Function.async( a1, a2, a3, this ); };

	Function.bind = function( scope, args, func ){
		if( typeof args === "function" ){
			func = args;
			args = [ ];	
		} 
		
		return func.bind.apply( func, [ scope ].concat( args ) );
	};
	
	Function.onIdle = function( scope, timeout, args, func ){
		if( typeof timeout === "function" ){
			func    = timeout;
			timeout = 0;
			args    = [ ];
			
		} else if( timeout instanceof Array ){
			func = args;
			args = timeout;
			timeout = 0;	
		
		}
		
		return func.onIdle( scope, timeout, args );
	};
	
	Function.async = function( scope, timeout, args, func ){
		if( typeof timeout === "function" ){
			func    = timeout;
			timeout = 0;
			args    = [ ];
			
		} else if( timeout instanceof Array ){
			func = args;
			args = timeout;
			timeout = 0;	
		
		}
		
		return func.async( scope, timeout, args );
	};
	
	Function.prototype.onIdle = function( scope, timeout, args ){
		var f = this, deferred = new lib.Deferred( );
		
		if( timeout === undefined && args === undefined ){
			timeout = 0;
			args    = [ ];	
		} else if( timeout instanceof Array ){
			args    = timeout;
			timeout = 0;	
		}		
			
		setTimeout( function( ){ 
			try {
				deferred.resolve( f.apply( scope, args || [ ] ) );			
			} catch( exception ){
				deferred.reject( exception );
			} 
		}, timeout );	
		
		return deferred.promise; 
	};
	
	Function.prototype.async = function( scope, timeout, args ){ 
		
		if( timeout === undefined && args === undefined ){
			timeout = 0;
			args    = [ ];	
		} else if( timeout instanceof Array ){
			args    = timeout;
			timeout = 0;	
		}
			
		var result = function( ){
				var deferred = new lib.Deferred( );
				
				try {
					this.onIdle( scope, timeout, ( args || [ ] ).concat( Array.prototype.slice.call( arguments ) ) )
						.then( deferred.resolve, deferred.reject );
				} catch( exception ){
					deferred.reject( exception );	
				} 
				
				return deferred;		
			};
			
		return result.bind( this );
	};
	

});