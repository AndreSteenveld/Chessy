define([ 
	".", 
	
	"dojo/_base/lang",
	"dojo/_base/declare", 
	"dojo/_base/Deferred",
	
	"dojo/topic", 
	"dojo/aspect", 
	"dojo/Evented",
	
	"./Function" /*jsl:import ./lib/Function.js*/
	
], function( lib, lang, declare, Deferred, topic, aspect, Evented ){
	//
	// Some functionality we need in the chess engine. To ensure we stay library independent it is
	// all required in here. So if for some reason we need to strip dojo away we only need to add
	// some implementation here.
	//
	
	lang.mixin( lib, lang );
	lang.mixin( lib, {
		declare  : declare,
		Deferred : Deferred,
		
		subscribe : topic.subscribe,
		publish   : topic.publish,
		
		aspect : aspect,
		
		Evented : Evented
	});
	
	return ( this.lib = lib );
});