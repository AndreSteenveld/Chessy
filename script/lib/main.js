/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ 
	".", 
	
	"dojo/_base/lang",
	"dojo/_base/declare", 
	
	"dojo/Deferred",
	"dojo/promise/all",
	"dojo/promise/first",
	
	"dojo/topic", 
	"dojo/aspect", 
	"dojo/Evented",
	
	"dojo/on",
	
	"dojo/DeferredList",
	
	"dojo/String",
	
	"./Function" /*jsl:import ./lib/Function.js*/
	
], function( lib, lang, declare, Deferred, all, first, topic, aspect, Evented, on, DeferredList, String ){
	//
	// Some functionality we need in the chess engine. To ensure we stay library independent it is
	// all required in here. So if for some reason we need to strip dojo away we only need to add
	// some implementation here.
	//
	
	lang.mixin( lib, lang );
	lang.mixin( lib, {
		declare  : declare,
		
		Deferred     : Deferred,
		DeferredList : DeferredList,
		
		subscribe : topic.subscribe,
		publish   : topic.publish,
		
		aspect : aspect,
		
		Evented : Evented,
		on : on,
		
		string : String
	});
	
	lib.Deferred.all = all;
	lib.Deferred.first = first;
	
	return ( this.lib = lib );
});