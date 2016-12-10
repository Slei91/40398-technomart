/**
 * X-Precise by X-Team
 * @author Lubos Kmetko <lubos@x-team.com>
 * @version 0.3
 */  
var XPrecise = {
   
    /**
     * Init X-Precise interface
     */         
    init: function () {
        XPrecise.interfaceAppend();
        XPrecise.overlayChange();
        XPrecise.overlayToggle();
        XPrecise.overlayDrag();
        XPrecise.overlayPosition();
        XPrecise.overlayOpacity();
        XPrecise.pageOpacity();
        XPrecise.overlayFineTuning();
        XPrecise.overUnderToggle();
        XPrecise.interfaceDrag();
        XPrecise.interfaceToggle();
    },

    /**
     * Change overlay image
     * 
     */              
    overlayChange: function () {
        jQuery("#xprecise-image").bind('change', function () {
            jQuery("#xprecise-overlay img").attr('src', jQuery(this).val());
            XPrecise.saveSettings(); 
        });
    },

    /**
     * Toggle overlay image on / off
     * 
     */              
    overlayToggle: function () {
        var link = jQuery("#xprecise a.xprecise-toggle");
        var overlay = jQuery("#xprecise-overlay");
        link.bind('click', function () {
            if (link.text() === "On") {
                link.text("Off");
                link.addClass('xprecise-off');
            } else {
                link.text("On");
                link.removeClass('xprecise-off');
            }            
            overlay.toggle();
            XPrecise.saveSettings(); 
            return false;
        });
        // Hide overlay
        if (link.text() === "Off") {
            overlay.hide();
            link.addClass('xprecise-off');
        }   
    },

    /**
     * Make overlay image draggable
     */         
    overlayDrag: function () { 
        jQuery("#xprecise-overlay").draggable({
            drag: function(event, ui) {
                jQuery("#xprecise-top").val(ui.position.top);
                jQuery("#xprecise-left").val(ui.position.left);
            },
            stop: function(event, ui) { 
                XPrecise.saveSettings();
            }
        });
    },
    
   /**
     * Position overlay by field values
     */         
    overlayPosition: function () {
        var overlay = jQuery("#xprecise-overlay");
        var top_field = jQuery("#xprecise-top")
        var left_field = jQuery("#xprecise-left")
        top_field.bind('change', function () {
            overlay.css('top', jQuery(this).val() + 'px');
            XPrecise.saveSettings();
        });
        left_field.bind('change', function () {
            overlay.css('left', jQuery(this).val() + 'px');
            XPrecise.saveSettings();
        });
        overlay.css('top', top_field.val() + 'px');
        overlay.css('left', left_field.val() + 'px');
    },
    
    
   /**
     * Fine tuning of the overlay position by W, S, A, D keys
     * Pressing these keys moves the overlay by 1px in selected direction      
     */         
    overlayFineTuning: function () {
        var overlay = jQuery("#xprecise-overlay");
        var top_field = jQuery("#xprecise-top")
        var left_field = jQuery("#xprecise-left")
        var top, left;
         
        // Init listening to keypresses only on hover over the overlay
        overlay.hover(
            function () {
                jQuery(document).unbind('keypress.xprecise');
                jQuery(document).bind('keydown.xprecise', function (e) {
                    switch(e.keyCode) { 
                        // Pressed "W" - up key
                        case 87:
                            setTop('up');
                            break;
                        // Pressed "S" - down key
                        case 83:
                            setTop('down');
                            break;
                        // Pressed "A" left key
                        case 65:
                            setLeft('left');
                            break;
                        // Pressed "D" - rigth key
                        case 68:
                            setLeft('right');
                            break;     
                    }
                });
            }, 
            function () {
                jQuery(document).unbind('keydown.xprecise');
            }
        );
        
        /**
         * Set top position
         * @param direction of overlay moving, default is top         
         */                 
        function setTop(direction) {
            var top = top_field.val() * 1 - 1;
            if (direction === 'down') {
                top = top_field.val() * 1 + 1;
            } 
            top_field.val(top);
            overlay.css('top', top + 'px');
            XPrecise.saveSettings();
        }
        
        /**
         * Set left position
         * @param direction of overlay moving, default is left         
         */                 
        function setLeft(direction) {
            var left = left_field.val() * 1 - 1;
            if (direction === 'right') {
                left = left_field.val() * 1 + 1;
            } 
            left_field.val(left);
            overlay.css('left', left + 'px');
            XPrecise.saveSettings();
        }
        
    },    
    
    /**
     * Change overlay opacity by interface slider
     */         
    overlayOpacity: function () {
        
        var overlay = jQuery("#xprecise-overlay");
        var overlay_value = jQuery("#xprecise-opacity-value");
        var overlay_opacity = overlay_value.text() * 1;
        
        overlay.css('opacity', overlay_opacity/100);
        
        jQuery("#xprecise-opacity").slider({ 
             value: overlay_opacity,
             slide: function(event, ui) {
                 overlay_value.text(ui.value);
                 overlay.css('opacity', ui.value/100)
             },
             stop: function(event, ui) {
                 XPrecise.saveSettings();  
             }
        });
    },    
    
    /**
     * Change page opacity by interface slider
     */         
    pageOpacity: function () {
        
        var page = jQuery("#xprecise-wrapper");
        var page_value = jQuery("#xprecise-page-opacity-value");
        var page_opacity = page_value.text() * 1;
        
        page.ClearTypeFadeTo({speed: 1, opacity: page_opacity/100, bgColor: 'transparent'})
        
        jQuery("#xprecise-page-opacity").slider({ 
             value: page_opacity,
             slide: function(event, ui) {
                 page_value.text(ui.value);
                 page.ClearTypeFadeTo({speed: 1, opacity: ui.value/100, bgColor: 'transparent'})
             },
             stop: function(event, ui) {
                 XPrecise.saveSettings();  
             }
        });
    },    

    /**
     * Toggle position of the overlay over and under the page
     */         
    overUnderToggle: function () {
        var overlay = jQuery("#xprecise-overlay");
        
        jQuery("#xprecise-over").bind('click', function () {
            overlay.css("z-index", 10000);
            XPrecise.saveSettings(); 
        });
        
        jQuery("#xprecise-under").bind('click', function () {
            overlay.css("z-index", 1000);
            XPrecise.saveSettings(); 
        });
        
        // Initial settings
        if (jQuery("#xprecise-over").is(":checked")) {
            overlay.css("z-index", 10000);
        } else {
            overlay.css("z-index", 1000);
        }        
    },    
    
    /**
     * Make interface draggable
     */         
    interfaceDrag: function () { 
        jQuery("#xprecise").draggable({ 
            handle: 'h2',
            stop: function(event, ui) { 
                XPrecise.saveSettings();
            } 
        });
    },
    
    /**
     * Toggle interface on / off
     */         
    interfaceToggle: function () {
        var form = jQuery("#xprecise form");
        var link = jQuery("#xprecise a.xprecise-close"); 
        link.bind('click', function () {
            var link = jQuery(this);
            form.toggle();
            if (link.text() === "-") {
                link.text("+");
                link.addClass('xprecise-closed');
            } else {
                link.text("-");
                link.removeClass('xprecise-closed');
            }
            XPrecise.saveSettings(); 
            return false;
        });
        
        // Close interface 
        if (link.text() === "+") {
            form.hide();
            link.addClass('xprecise-closed');
        }  
    },
    
    /**
     * Get image name from page URL
     */         
    getImageFromURL: function () {
        var image_name = '';
        var url_parts = location.pathname.split('/');
        url_parts.reverse();
        if (url_parts[0] !== '') {
            image_name = '_xprecise/' + url_parts[0].replace(/.html/, '.jpg');
        } else {
            image_name = '_xprecise/index.jpg';
        }
        return image_name;
    },
    
    /**
     * Save settings to cookie
     */              
    saveSettings: function () {
        var delimiter = '|';
        var interface_toggle, overlay_toggle, over_under;
        
        // Interface opened/closed
        if (jQuery("#xprecise a.xprecise-close").text() === "-") {
            interface_toggle = '-';
        } else {
            interface_toggle = '+';
        }
        
        // Overlay visible/hidden
        if (jQuery("#xprecise a.xprecise-toggle").text() === "On") {
            overlay_toggle = 'On';
        } else {
            overlay_toggle = 'Off';
        }
        
        // Interface position
        var interface_position = jQuery("#xprecise").position();
        
        // Overlay over or under the page
        if (jQuery("#xprecise-over").is(":checked")) {
            over_under = 'over';
        } else {
            over_under = 'under';
        }
        
        // Store settings in string separated by delimiter
        var xprecise_settings = interface_toggle + delimiter +
                                interface_position.top + delimiter + 
                                interface_position.left + delimiter +
                                overlay_toggle + delimiter +
                                jQuery("#xprecise-image").val() + delimiter +
                                jQuery("#xprecise-top").val() + delimiter + 
                                jQuery("#xprecise-left").val() + delimiter +
                                jQuery("#xprecise-opacity-value").text() + delimiter + 
                                jQuery("#xprecise-page-opacity-value").text() + delimiter +
                                over_under;
        var cookie_info = XPrecise.getCookieInfo();                              
        jQuery.cookie(cookie_info['cookie_name'], xprecise_settings, { path: cookie_info['cookie_path'], expires: 365 });
    },
    
    /**
     * Get cookie name and path for current page
     * @return array     
     */         
    getCookieInfo: function () {
        var cookie_info = [];
        var path_parts = location.pathname.split('/');
        var file_name = path_parts.pop();
        cookie_info['cookie_path'] = path_parts.join('/') + '/';
        cookie_info['cookie_name'] = '_xprecise_' + file_name;
        return cookie_info;
    }, 
    
    /**
     * Load settings
     */              
    loadSettings: function () {
        var settings = [];
        // Load settings from cookie
        var cookie_info = XPrecise.getCookieInfo();
        if (jQuery.cookie(cookie_info['cookie_name'])) {
            var xprecise_settings = jQuery.cookie(cookie_info['cookie_name']).split('|')
            settings['interface'] = xprecise_settings[0];
            settings['interface_top'] = xprecise_settings[1];
            settings['interface_left'] = xprecise_settings[2];
            settings['overlay'] = xprecise_settings[3];
            settings['image'] = xprecise_settings[4];
            settings['overlay_top'] = xprecise_settings[5];
            settings['overlay_left'] = xprecise_settings[6];
            settings['overlay_opacity'] = xprecise_settings[7];
            settings['page_opacity'] = xprecise_settings[8];
            settings['over_under'] = xprecise_settings[9];
        // Do initial settings    
        } else {
            settings['interface'] = '-';
            settings['interface_top'] = 20;
            settings['interface_left'] = 20;
            settings['overlay'] = 'On';
            settings['image'] = XPrecise.getImageFromURL();
            settings['overlay_top'] = 0;
            settings['overlay_left'] = 0;
            settings['overlay_opacity'] = 50;
            settings['page_opacity'] = 100;
            settings['over_under'] = 'over';
        }
        return settings;
    },
    
    /**
     * Append interface and set it up
     */         
    interfaceAppend: function () {
        var settings = this.loadSettings();
        
        // Over under
        var over_checked, under_checked;
        if (settings['over_under'] === 'over') {
            over_checked = ' checked="checked" ';
            under_checked = '';
        } else {
            under_checked = ' checked="checked" ';
            over_checked = '';
        }
        
        var body = jQuery('body');
        jQuery('head').append('<link rel="stylesheet" type="text/css" media="all" href="_xprecise/xprecise.css" />');
        body.children('div').wrapAll('<div id="xprecise-wrapper"></div>');
        body.append('<div id="xprecise-overlay"><img src="' + settings['image'] + '" alt="X-Precise Overlay" /></div>');
        body.append('<div id="xprecise"> <div id="xprecise-inner"> <h2><img src="_xprecise/images/logo.png" alt="X-Precise" width="80" height="17" /> <span class="ie6">X-Precise</span> <a href="#" class="xprecise-close">' + settings['interface'] + '</a></h2> <form action="#"> <ol> <li class="first"> <h3><label for="xprecise-image">Design</label> <a href="#" class="xprecise-toggle">' + settings['overlay'] + '</a></h3> <p><input type="text" value="' + settings['image'] + '" id="xprecise-image" /></p> </li> <li class="xprecise-over-under"> <input type="radio" name="xprecise-over-under" id="xprecise-over" ' + over_checked + '/> <label for="xprecise-over">over</label> <input type="radio" name="xprecise-over-under" id="xprecise-under"' + under_checked + '/> <label for="xprecise-under">under</label> </li> <li class="xprecise-position"> <h3>Position</h3> <p> <label for="xprecise-top">top</label> <input type="text" value="' + settings['overlay_top'] + '" id="xprecise-top" /> <label for="xprecise-left">left</label> <input type="text" value="' + settings['overlay_left'] + '" id="xprecise-left" /> </p> </li> <li> <h3> Design opacity <span id="xprecise-opacity-value">' + settings['overlay_opacity'] + '</span><span>%</span> </h3> <div id="xprecise-opacity"></div> </li> <li> <h3> Page opacity <span id="xprecise-page-opacity-value">' + settings['page_opacity'] + '</span><span>%</span> </h3> <div id="xprecise-page-opacity"></div> </li> </ol> </form> </div> <div id="xprecise-bottom"></div></div>');
        jQuery("#xprecise, #xprecise-overlay").css('position', 'absolute');
        jQuery("#xprecise").css('top', settings['interface_top'] + 'px');
        jQuery("#xprecise").css('left', settings['interface_left'] + 'px');
    }
};    

//-------------------------------------------------------------------------------------------------------
// ClearTypeFadeTo / ClearTypeFadeIn / ClearTypeFadeOut
//
// Custom fade in and fade out functions for jQuery that will work around
// IE's bug with bold text in elements that have opacity filters set when
// also using Window's ClearType text rendering.
//
// New Parameter:
// bgColor    The color to set the background if none specified in the CSS (default is '#fff')
//
// Examples:
// $('div').ClearTypeFadeIn({ speed: 1500 });
// $('div').ClearTypeFadeIn({ speed: 1500, bgColor: '#ff6666', callback: myCallback });
// $('div').ClearTypeFadeOut({ speed: 1500, callback: function() { alert('Fade Out complete') } });
//
// Notes on the interaction of ClearType with DXTransforms in IE7
// http://blogs.msdn.com/ie/archive/2006/08/31/730887.aspx
(function($) {
    $.fn.ClearTypeFadeTo = function(options) {
        if (options)
                $(this)
                        .show()
                        .each(function() {
                                if (jQuery.browser.msie) {
                                        // Save the original background color
                                        $(this).attr('oBgColor', $(this).css('background-color'));
                                        // Set the bgColor so that bold text renders correctly (bug with IE/ClearType/bold text)
                                        $(this).css({ 'background-color': (options.bgColor ? options.bgColor : '#fff') })
                                }
                        })
                        .fadeTo(options.speed, options.opacity, function() {
                                if (jQuery.browser.msie) {
                                        // ClearType can only be turned back on if this is a full fade in or
                                        // fade out. Partial opacity will still have the problem because the
                                        // filter style must remain. So, in the latter case, we will leave the
                                        // background color and 'filter' style in place.
                                        if (options.opacity == 0 || options.opacity == 1) {
                                                // Reset the background color if we saved it previously
                                                $(this).css({ 'background-color': $(this).attr('oBgColor') }).removeAttr('oBgColor');
                                                // Remove the 'filter' style to restore ClearType functionality.
                                                $(this).get(0).style.removeAttribute('filter');
                                                
                                        }
                                }
                                if (options.callback != undefined) options.callback();
                        });
    };

    $.fn.ClearTypeFadeIn = function(options) {
        if (options)
                $(this)
                        .css({ opacity: 0 })
                        .ClearTypeFadeTo({ speed: options.speed, opacity: 1, callback: options.callback });
    };

    $.fn.ClearTypeFadeOut = function(options) {
        if (options)
                $(this)
                        .css({ opacity: 1 })
                        .ClearTypeFadeTo({ speed: options.speed, opacity: 0, callback: options.callback });
    };
})(jQuery);
  

/**
 * Init X-Precise
 */        
jQuery(document).ready(function() {
    XPrecise.init();
});