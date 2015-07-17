/**
 * jQuery Grid-A-Licious(tm) v3.01
 *
 * Terms of Use - jQuery Grid-A-Licious(tm)
 * under the MIT (http://www.opensource.org/licenses/mit-license.php) License.
 *
 * Copyright 2008-2012 Andreas Pihlström (Suprb). All rights reserved.
 * (http://suprb.com/apps/gridalicious/)
 *
 */
// Debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
// Copy pasted from http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function ($, sr) {
    var debounce = function (func, threshold, execAsap) { 
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            };
            var width = $(window).width();
            
            if($('body').hasClass('woocommerce')){
                if(width  < 768 ) {
                    $('.woocommerce ul.products li').css('width','100%');
                    $('.woocommerce ul.products li').css('margin-right','0');
                    $('.woocommerce ul.products li').css('display','block');
                    $('.woocommerce ul.products li').css('margin','30px auto');
                    return false;    
                }
            }
            
            if (timeout) clearTimeout(timeout);
            else if (execAsap) func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 150);
        };
    }
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');

// The Grid-A-Licious magic

(function ($) {

    $.Gal = function (options, element) {
        this.element = $(element);
        this._init(options);
    };

    $.Gal.settings = {
        selector: '.item',
        width: 225,
        gutter: 0,
        animate: false,
        animationOptions: {
            speed: 200,
            duration: 300,
            effect: 'fadeInOnAppear',
            queue: true,
            complete: function () {}
        },
    };

    $.Gal.prototype = {

        _init: function (options) {
            var container = this;
            this.name = this._setName(5);
            this.gridArr = [];
            this.gridArrAppend = [];
            this.gridArrPrepend = [];
            this.setArr = false;
            this.setGrid = false;
            this.setOptions;
            this.cols = 0;
            this.itemCount = 0;
            this.prependCount = 0;
            this.isPrepending = false;
            this.appendCount = 0;
            this.resetCount = true;
            this.ifCallback = true;
            this.box = this.element;
            this.boxWidth = this.box.width();
            this.options = $.extend(true, {}, $.Gal.settings, options);
            this.gridArr = $.makeArray(this.box.find(this.options.selector));
            this.isResizing = false;
            this.w = 0;
            this.boxArr = [];

            // build columns
            var width = $(window).width();
            
            if($('body').hasClass('woocommerce')){
                if(width  < 768 ) {
                    this._setCols();
                    // build grid
                    this._renderGrid('append');
                    // add class 'gridalicious' to container
                    $(this.box).addClass('gridalicious');
                    // add smartresize
                    $(window).smartresize(function () {
                        container.resize();
                    });
                    
                    $('.woocommerce ul.products li').css('width','100%');
                    $('.woocommerce ul.products li').css('margin-right','0');
                    $('.woocommerce ul.products li').css('display','block');
                    $('.woocommerce ul.products li').css('margin','30px auto');
  
                } else {
                    this._setCols();
                    // build grid
                    this._renderGrid('append');
                    // add class 'gridalicious' to container
                    $(this.box).addClass('gridalicious');
                    // add smartresize
                    $(window).smartresize(function () {
                        container.resize();
                    });
                }
            } else {
                this._setCols();
                // build grid
                this._renderGrid('append');
                // add class 'gridalicious' to container
                $(this.box).addClass('gridalicious');
                // add smartresize
                $(window).smartresize(function () {
                    container.resize();
                });
            }
        },

        _setName: function (length, current) {
            current = current ? current : '';
            return length ? this._setName(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
        },

        _setCols: function () {
            // calculate columns
            this.cols = Math.floor(this.box.width() / this.options.width);
            //console.log(this.cols);
            //If Cols lower than 1, the grid disappears
            if (this.cols < 1) { this.cols = 1; }
            
            if($('body').hasClass('woocommerce')){
                var marginR = Math.floor((2 * this.options.gutter) / (this.cols - 1)) + this.options.gutter;
            }

            diff = (this.box.width() - (this.cols * this.options.width) - this.options.gutter) / this.cols;
            if($('body').hasClass('woocommerce')){
                w = (this.options.width + diff - this.options.gutter) / this.box.width() * 100;
            } else {
                w = (this.options.width + diff) / this.box.width() * 100;
            }
            this.w = w;
            var initNoBoxes = this.box.find(this.options.selector).length;
            // add columns to box
            if ( initNoBoxes > 2 ) {
                if($('body').hasClass('woocommerce')){
                    for (var i = 0; i < this.cols; i++) {
                        if(i == this.cols - 1){
                            var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                'width': w + '%',
                                'marginRight': 0,
                                'paddingBottom': marginR,
                                'float': 'left',
                                '-webkit-box-sizing': 'border-box',
                                '-moz-box-sizing': 'border-box',
                                '-o-box-sizing': 'border-box',
                                'box-sizing': 'border-box'
                            });
                            this.box.append(div);                        
                        } else { 
                            var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                'width': w + '%',
                                'marginRight': marginR,
                                'paddingBottom': marginR,
                                'float': 'left',
                                '-webkit-box-sizing': 'border-box',
                                '-moz-box-sizing': 'border-box',
                                '-o-box-sizing': 'border-box',
                                'box-sizing': 'border-box'
                            });
                            this.box.append(div);
                        }
                    }                    
                } else {
                    
                        for (var i = 0; i < this.cols; i++) {
                            var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                'width': w + '%',
                                'paddingLeft': this.options.gutter,
                                'paddingBottom': this.options.gutter,
                                'float': 'left',
                                '-webkit-box-sizing': 'border-box',
                                '-moz-box-sizing': 'border-box',
                                '-o-box-sizing': 'border-box',
                                'box-sizing': 'border-box'
                            });
                            this.box.append(div);
                        } 
                }
        	} else {
                if($('body').hasClass('woocommerce')){ 
                        for (var i = 0; i < this.cols; i++) {
                            if(i == this.cols - 1){
                                var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                    'width': w + '%',
                                    'marginRight': 0,
                                    'paddingBottom': marginR,
                                    'float': 'left',
                                    '-webkit-box-sizing': 'border-box',
                                    '-moz-box-sizing': 'border-box',
                                    '-o-box-sizing': 'border-box',
                                    'box-sizing': 'border-box'
                                });
                                this.box.append(div);
                            } else {
                                var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                    'width': w + '%',
                                    'marginRight': marginR,
                                    'paddingBottom': marginR,
                                    'float': 'left',
                                    '-webkit-box-sizing': 'border-box',
                                    '-moz-box-sizing': 'border-box',
                                    '-o-box-sizing': 'border-box',
                                    'box-sizing': 'border-box'
                                });
                                this.box.append(div);                            
                            }
                        }
                    } else {
                        for (var i = 0; i < this.cols; i++) {
                            var div = $('<li></li>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                                'width': w + '%',
                                'paddingLeft': this.options.gutter,
                                'paddingBottom': this.options.gutter,
                                'float': 'none',
                                'display': 'inline-block',
                                'vertical-align': 'top'
                            });
                            this.box.append(div);
                        }
                    }
        	}

            this.box.find($('#clear' + this.name)).remove();
            // add clear float
            var clear = $('<li></li>').css({
                'clear': 'both',
                'height': '0',
                'width': '0',
                'display': 'block'
            }).attr('id', 'clear' + this.name);
            this.box.append(clear);
        },

        _renderGrid: function (method, arr, count, prepArray) {
            var items = [];
            var boxes = [];
            var prependArray = [];
            var itemCount = 0;
            var prependCount = this.prependCount;
            var appendCount = this.appendCount;
            var gutter = this.options.gutter;
            var cols = this.cols;
            var name = this.name;
            var i = 0;
            var w = $('.galcolumn').width();

            var columnsHeight = {};
            if($('body').hasClass('woocommerce')){
                var marginR = Math.floor((2 * this.options.gutter) / (this.cols - 1)) + this.options.gutter;
            }
            // if arr
            if (arr) {
                boxes = arr;
                // if append
                if (method == "append") {
                    // get total of items to append
                    appendCount += count;
                    // set itemCount to last count of appened items
                    itemCount = this.appendCount;
                }               
                // if prepend
                if (method == "prepend") {
                    // set itemCount
                    this.isPrepending = true;
                    itemCount = Math.round(count % cols);
                    if (itemCount <= 0) itemCount = cols; 
                }
                // called by _updateAfterPrepend()
                if (method == "renderAfterPrepend") {
                    // get total of items that was previously prepended
                    appendCount += count;
                    // set itemCount by counting previous prepended items
                    itemCount = count;
                }
            }
            else {
                boxes = this.gridArr;
                appendCount = $(this.gridArr).size();
            }

			// init array of height 
            var ii;
            for ( ii=0; ii < cols; ii++) {
            	columnsHeight[ ii ] = 0;
        	}

            // push out the items to the columns
            $.each(boxes, function (index, value) {
                var item = $(value);
                var width = '100%';
				var thisHeight;
				var thisId;
				var thisInitMin;
				var j;

                // if you want something not to be "responsive", add the class "not-responsive" to the selector container            
                if (item.hasClass('not-responsive')) {
                  width = 'auto';
                }
                
                
                 if($('body').hasClass('woocommerce')){
                    item.css({
                        'marginBottom': marginR,
                        'zoom': '1',
                        'filter': 'alpha(opacity=0)',
                        'opacity': '0'
                    }).find('img, object, embed, iframe').css({
                        'height': 'auto',
                        'display': 'block',
                        'margin-left': 'auto',
                        'margin-right': 'auto'
                    });                 
                 }else{
                    item.css({
                        'marginBottom': gutter,
                        'zoom': '1',
                        'filter': 'alpha(opacity=0)',
                        'opacity': '0'
                    }).find('img, object, embed, iframe').css({
                        'height': 'auto',
                        'display': 'block',
                        'margin-left': 'auto',
                        'margin-right': 'auto'
                    });
                 }
                // prepend on append to column
                if (method == 'prepend') {
                    itemCount--;
                    $("#item" + itemCount + name).prepend(item);
                    items.push(item);
                    if(itemCount == 0) itemCount = cols;
                } else {
					thisHeight = item.outerHeight(true);
					thisId = 0;
					thisInitMin = columnsHeight[thisId];
					if ( thisInitMin != 0) {
			            for (j=1; j<cols; j++ ) {
							if ( columnsHeight[j] === 0) {
								thisId = j;
								break;
			            	} else if ( columnsHeight[j] < thisInitMin) {
			            		thisInitMin = columnsHeight[j];
								thisId = j;
			            	}
			        	}
			        }

                    $("#item" + thisId + name).append(item);
                    items.push(item);
                    columnsHeight[thisId] += item.outerHeight(true); 

                }
            });

            this.appendCount = appendCount;
            this.itemCount = itemCount;

            if (method == "append" || method == "prepend") {
                if (method == "prepend") { 
                  // render old items and reverse the new items
                  this._updateAfterPrepend(this.gridArr, boxes);
                }
                this._renderItem(items);
                this.isPrepending = false;
            } else {
                this._renderItem(this.gridArr);
            }

            var selector = this.box.children('.galcolumn');
            $.each(selector, function (index, value) {
            	var itemx = $(value);
            	if ( !itemx.html() ) {
            		itemx.addClass( 'display-none' );
            	}
            });

        },

        _collectItems: function () {
            var collection = [];
            $(this.box).find(this.options.selector).each(function (i) {
                collection.push($(this));
            });
            return collection;
        },

        _renderItem: function (items) {

            var speed = this.options.animationOptions.speed;
            var effect = this.options.animationOptions.effect;
            var duration = this.options.animationOptions.duration;
            var queue = this.options.animationOptions.queue;
            var animate = this.options.animate;
            var complete = this.options.animationOptions.complete;

            var i = 0;
            var t = 0;

            // animate
            if (animate === true && !this.isResizing) {

                // fadeInOnAppear
                if (queue === true && effect == "fadeInOnAppear") {
                    if (this.isPrepending) items.reverse();
                    $.each(items, function (index, value) {
                        setTimeout(function () {
                            $(value).animate({
                                opacity: '1.0'
                            }, duration);
                            t++;
                            if (t == items.length) {
                                complete.call(undefined, items)
                            }
                        }, i * speed);
                        i++;
                    });
                } else if (queue === false && effect == "fadeInOnAppear") {
                    if (this.isPrepending) items.reverse();
                    $.each(items, function (index, value) {
                        $(value).animate({
                            opacity: '1.0'
                        }, duration);
                        t++;
                        if (t == items.length) {
                            if (this.ifCallback) {
                                complete.call(undefined, items);
                            }
                        }
                    });
                }

                // no effect but queued
                if (queue === true && !effect) {
                    $.each(items, function (index, value) {
                        $(value).css({
                            'opacity': '1',
                            'filter': 'alpha(opacity=1)'
                        });
                        t++;
                        if (t == items.length) {
                            if (this.ifCallback) {
                                complete.call(undefined, items);
                            }
                        }
                    });
                }

            // don not animate & no queue
            } else {
                $.each(items, function (index, value) {
                    $(value).css({
                        'opacity': '1',
                        'filter': 'alpha(opacity=1)'
                    });
                });
                if (this.ifCallback) {
                    complete.call(items);
                }
            }
        },

        _updateAfterPrepend: function (prevItems, newItems) {            
            var gridArr = this.gridArr;
            // add new items to gridArr
            $.each(newItems, function (index, value) {
                gridArr.unshift(value);
            })
            this.gridArr = gridArr;
        },

        resize: function () {
            if (this.box.width() === this.boxWidth) {
                return;
            }

            // delete columns in box
            this.box.find($('.galcolumn')).remove();
            // build columns
            this._setCols();
            // build grid
            this.ifCallback = false;
            this.isResizing = true;
            this._renderGrid('append');
            this.ifCallback = true;
            this.isResizing = false;
            this.boxWidth = this.box.width();
        },

        append: function (items) {
            var gridArr = this.gridArr;
            var gridArrAppend = this.gridArrPrepend;
            $.each(items, function (index, value) {
                gridArr.push(value);
                gridArrAppend.push(value);
            });
            this._renderGrid('append', items, $(items).size());
        },

        prepend: function (items) {
            this.ifCallback = false;
            this._renderGrid('prepend', items, $(items).size());
            this.ifCallback = true;
        },
    }

    $.fn.gridalicious = function (options, e) {
        if (typeof options === 'string') {
            this.each(function () {
                var container = $.data(this, 'gridalicious');
                container[options].apply(container, [e]);
            });
        } else {
            this.each(function () {
                $.data(this, 'gridalicious', new $.Gal(options, this));
            });
        }
        return this;
    }

})(jQuery);