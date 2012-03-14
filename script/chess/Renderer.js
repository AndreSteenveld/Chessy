define([ "dojo/string", "dojox/string/Builder"  ], function( String, StringBuilder ){

	var WHITE_PIECES = { "Bishop": "&#9815;", "King": "&#9812;", "Knight": "&#9816;", "Pawn": "&#9817;", "Queen": "&#9813;", "Rook": "&#9814;" },
		BLACK_PIECES = { "Bishop": "&#9821;", "King": "&#9818;", "Knight": "&#9822;", "Pawn": "&#9823;", "Queen": "&#9819;", "Rook": "&#9820;" };

	var FIELD_TEMPLATE = "<td class='cell row-${row} col-${col} color-${color} ${piece_class}'>${piece}</td>";
						
	var ROW_TEMPLATE = ""
		+ "<tr class='row row-${row}'>"
			+ "<td class='row-name-${name} name-cell'>${name}</td>"
			+ "${fields}"
			+ "<td class='row-name-${name} name-cell'>${name}</td>"
		+ "</tr>";
		
	var BOARD_TEMPLATE = ""
		+ "<table class='board'>"
			+ "<thead></thead>"
			+ "<tbody>"
				+ "<tr><td class='name-cell'>&nbsp;</td><td class='name-cell'>A</td><td class='name-cell'>B</td><td class='name-cell'>C</td><td class='name-cell'>D</td><td class='name-cell'>E</td><td class='name-cell'>F</td><td class='name-cell'>G</td><td class='name-cell'>H</td><td class='name-cell'>&nbsp;</td></tr>"
				+ "${rows}"
				+ "<tr><td class='name-cell'>&nbsp;</td><td class='name-cell'>A</td><td class='name-cell'>B</td><td class='name-cell'>C</td><td class='name-cell'>D</td><td class='name-cell'>E</td><td class='name-cell'>F</td><td class='name-cell'>G</td><td class='name-cell'>H</td><td class='name-cell'>&nbsp;</td></tr>"
			+ "</tbody>"
		+ "</table>";
		
	var xNames = [ "a", "b", "c", "d", "e", "f", "g", "h" ],
		yNames = [ "8", "7", "6", "5", "4", "3", "2", "1" ],
		color  = function( ){
			var color = "black";
			
			return function( ){
				return color === "black"
					? ( color = "white" )
					: ( color = "black" );						
			}					
		}( );
				
	function render( board ){
		var rows = new StringBuilder( );	
		
		yNames.forEach( function( y ){
			var fields = new StringBuilder( );
			
			xNames.forEach( function( x ){
				var piece      = "&nbsp;",
					pieceClass = "";
				
				if( board.fields[ x + y ].piece ){
					piece = board.fields[ x + y ].piece.color === "white"
						? WHITE_PIECES[ board.fields[ x + y ].piece.type ]
						: BLACK_PIECES[ board.fields[ x + y ].piece.type ]
						
					pieceClass = "piece-" + board.fields[ x + y ].piece.color;
				}
				
				var field = String.substitute( FIELD_TEMPLATE, {
					row: y.toUpperCase( ),
					col: x.toUpperCase( ),
					color: color( ),
					piece: piece,
					piece_class: pieceClass
				});
			
				fields.append( field );		
				
			});
			
			color( );
			
			rows.append( 
				String.substitute( ROW_TEMPLATE, {
					row:  "z",
					name: y.toUpperCase( ),
					fields: fields.toString( )
				})
			);					
		});
		
		return String.substitute( BOARD_TEMPLATE, { rows: rows });		
	}

	return { render : render };

});