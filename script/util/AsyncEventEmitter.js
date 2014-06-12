
var Compose      = require( "compose" ),
    EventEmitter = require( "events" ).EventEmitter,
    Promise      = require( "rsvp" ).Promise;

module.exports = Compose(

    EventEmitter,
    
    {

        //
        // This is just a stub until we get around to doing this properly
        // 
        emit: Compose.around( function( base ){
            
            return function( ){
            
                return Promise.resolve( base.apply( this, arguments ) );   
                
            }; 
            
        })
        
    }

);

