jQuery( function( $ ) {
	if ( $( 'ul.page-numbers' ).length && $( '.archive' ).length ) {
		var currentPage = parseInt( $( 'ul.page-numbers .current' ).text() );
		$( 'ul.page-numbers .current' ).replaceWith( '<a href="' + window.location.href + '" class="page-numbers current">' + $( 'ul.page-numbers .current' ).text() + '</a>' );
		if ( $( '.products li' ).last().length ) {
			$( '.products li' ).last().attr( 'data-page', currentPage );
			$( '.products li' ).last().attr( 'data-page-url', window.location.href );
			$( '.products li' ).last().addClass( 'waypoint-page waypoint-page-' + currentPage );
			set_waypoint( $( '.products li' ).last(), window.location.href );
		}
		$( '.products' ).waypoint('infinite', {
			items: '.product',
			onAfterPageLoad: function( $nr, $href ) {
				set_waypoint( $( '.waypoint-page-' + $nr ), $href );
			},
		});
	}
	
	function set_waypoint( $element, $href ) {
		$element.waypoint( function() {
	  		var active = parseInt( $( this ).data( 'page' ) );
	  		$( 'ul.page-numbers' ).find( '.current' ).removeClass( 'current' );
	  		var index = 0;
	  		$( 'ul.page-numbers li' ).each( function() {
	  			if ( $( this ).find( '.prev, .next' ).length )
	  				return;
	  			if ( ++index == active  )
	  				$( this ).find( 'a' ).addClass( 'current' );
	  		});
	  		$( 'ul.page-numbers' ).find( 'a.next' ).parent().show();
	  		$( 'ul.page-numbers' ).find( 'a.prev' ).parent().show();
	  		if ( index == active )
	  			$( 'ul.page-numbers' ).find( 'a.next' ).parent().hide();
	  		else if ( active == 1 )
	  			$( 'ul.page-numbers' ).find( 'a.prev' ).parent().hide();
	  		history.replaceState(null, null,  $href );
		});
	}
});