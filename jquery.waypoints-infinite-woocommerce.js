/*
Infinite Scroll Shortcut for jQuery Waypoints, adapted for WooCommerce v.1.0.0
Copyright (c) 2011-2014 Caleb Troughton, Dennis Nißle
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/

(function() {
    (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
          return define(['jquery', 'waypoints'], factory);
        } else {
          return factory(root.jQuery);
        }
    })(window, function($) {
        var defaults;
        defaults = {
          container: 'auto',
          items: '.infinite-item',
          more: '.infinite-more-link',
          offset: 'bottom-in-view',
          onBeforePageLoad: $.noop,
          onAfterPageLoad: $.noop
        };
        return $.waypoints('extendFn', 'infinite', function(options) {
            var $container, opts;
            opts = $.extend({}, $.fn.waypoint.defaults, defaults, options);
            $container = opts.container === 'auto' ? this : $(opts.container);
            opts.handler = function(direction) {
                var $this;
                if (direction === 'down' || direction === 'right') {
                    $this = $(this);
                    opts.onBeforePageLoad();
                    $this.waypoint('destroy');
                    if ( ! $( opts.more ).length )
                        opts.more = $( '.page-numbers' ).find( '.current' ).parent().next().find( 'a' );
                    if ( ! opts.more.attr( 'href' ) )
                        return false;
                    $container.append( '<div class="ajax-loader-wrapper"><div class="ajax-loader"></div></div>' );
                    return $.get(opts.more.attr('href'), function(data) {
                        var $data, $newMore, $nr, fn;
                        $data = $($.parseHTML(data));
                        var $oldHref = opts.more.attr('href');
                        opts.more = $data.find( '.page-numbers .current' ).parent().next().find( 'a' );
                        $nr = parseInt( $data.find( '.page-numbers .current' ).text() );
                        $data.find(opts.items).last().addClass( 'waypoint-page waypoint-page-' + $nr );
                        $data.find(opts.items).last().attr( { 'data-page': $nr, 'data-page-url': $oldHref } );
                        $data.find(opts.items).first().addClass( 'waypoint-page waypoint-page-' + $nr );
                        $data.find(opts.items).first().attr( { 'data-page': $nr, 'data-page-url': $oldHref } );
                        $container.append( $data.find(opts.items) );
                        $container.find( '.ajax-loader-wrapper' ).remove();
                        if (opts.more.length) {
                            fn = function() {
                                return $this.waypoint(opts);
                            };
                            setTimeout(fn, 0);
                        }
                        return opts.onAfterPageLoad( $nr, $oldHref );
                    });
                }
            };
            return this.waypoint(opts);
        });
    });
}).call(this);
