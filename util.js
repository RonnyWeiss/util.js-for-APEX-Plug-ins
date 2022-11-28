/* eslint-disable no-undef */
/* eslint-disable strict */
const util = {
    featureDetails: {
        name: "#name_of_the_feature#",
        scriptVersion: "1.0",
        utilVersion: "22.11.28",
        url: "https://github.com/RonnyWeiss",
        license: "MIT"
    },
    isDefinedAndNotNull: function ( pInput ) {
        if ( typeof pInput !== "undefined" && pInput !== null && pInput !== "" ) {
            return true;
        } else {
            return false;
        }
    },
    varType: function ( pObj ) {
        if ( typeof pObj === "object" ) {
            const arrayConstructor = [].constructor;
            const objectConstructor = ( {} ).constructor;
            if ( pObj.constructor === arrayConstructor ) {
                return "array";
            }
            if ( pObj.constructor === objectConstructor ) {
                return "json";
            }
        } else {
            return typeof pObj;
        }
    },
    debounce: function ( pFunction, pTimeout = 50 ){
        let timer;
        return ( ...args ) => {
            clearTimeout( timer );
            timer = setTimeout( 
                function() { 
                    pFunction.apply( this, args );
                }, pTimeout );
        };
    },
    parseISOTimeString: function ( str ) {
        try {
            const arr = str.split( /\D+/ );
            return new Date( Date.UTC( arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5], arr[6] ) );
        } catch ( e ) {
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while try to parse ISO Time String",
                "err": e
            } );
        }
    },
    groupObjectArray: function ( objectArr, jSONKey ) {
        if ( objectArr && Array.isArray( objectArr ) ) {
            return objectArr.reduce( function ( retVal, x ) {
                let key = x[jSONKey];
                if ( key ) {
                    /* workaround for object sort of numbers */
                    key = "\u200b" + key;
                    ( retVal[key] = retVal[key] || [] ).push( x );
                }
                return retVal;
            }, {} );
        } else {
            return [];
        }
    },
    getDecimalSeperator: function () {
        try {
            return apex.locale.getDecimalSeparator();
        } catch ( e ) {
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while try to get decimal seperator",
                "err": e
            } );
            return;
        }
    },
    getGroupSeparator: function () {
        try {
            return apex.locale.getGroupSeparator();
        } catch ( e ) {
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while try to get decimal seperator",
                "err": e
            } );
            return;
        }
    },
    convertJSON2LowerCase: function ( obj ) {
        try {
            let output = {};
            for ( let i in obj ) {
                if ( Object.prototype.toString.apply( obj[i] ) === '[object Object]' ) {
                    output[i.toLowerCase()] = util.convertJSON2LowerCase( obj[i] );
                } else if ( Object.prototype.toString.apply( obj[i] ) === '[object Array]' ) {
                    output[i.toLowerCase()] = [];
                    output[i.toLowerCase()].push( util.convertJSON2LowerCase( obj[i][0] ) );
                } else {
                    output[i.toLowerCase()] = obj[i];
                }
            }

            return output;
        } catch ( e ) {
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while to lower json",
                "err": e
            } );
            return;
        }
    },
    cutString: function ( text, textLength ) {
        try {
            if ( textLength < 0 ) {return text;}
            else {
                return ( text.length > textLength ) ?
                    text.substring( 0, textLength - 3 ) + "..." :
                    text;
            }
        } catch ( e ) {
            return text;
        }
    },
    escapeHTML: function ( str ) {
        if ( str === null ) {
            return null;
        }
        if ( typeof str === "undefined" ) {
            return;
        }
        if ( typeof str === "object" ) {
            try {
                str = JSON.stringify( str );
            } catch ( e ) {
                /*do nothing */
            }
        }
        return apex.util.escapeHTML( String( str ) );
    },
    unEscapeHTML: function ( str ) {
        if ( str === null ) {
            return null;
        }
        if ( typeof str === "undefined" ) {
            return;
        }
        if ( typeof str === "object" ) {
            try {
                str = JSON.stringify( str );
            } catch ( e ) {
                /*do nothing */
            }
        }
        str = String( str );
        return str
            .replace( /&amp;/g, "&" )
            .replace( /&lt;/g, ">" )
            .replace( /&gt;/g, ">" )
            .replace( /&quot;/g, "\"" )
            .replace( /#x27;/g, "'" )
            .replace( /&#x2F;/g, "\\" );
    },
    link: function ( pLink, pTarget = "_parent" ) {
        if ( typeof pLink !== "undefined" && pLink !== null && pLink !== "" ) {
            window.open( pLink, pTarget );
        }
    },
    loader: {
        start: function ( id, setMinHeight ) {
            if ( setMinHeight ) {
                $( id ).css( "min-height", "100px" );
            }
            apex.util.showSpinner( $( id ) );
        },
        stop: function ( id, removeMinHeight ) {
            if ( removeMinHeight ) {
                $( id ).css( "min-height", "" );
            }
            $( id + " > .u-Processing" ).remove();
            $( id + " > .ct-loader" ).remove();
        }
    },
    jsonSaveExtend: function ( srcConfig, targetConfig ) {
        let finalConfig = {};
        let tmpJSON = {};
        /* try to parse config json when string or just set */
        if ( typeof targetConfig === 'string' ) {
            try {
                tmpJSON = JSON.parse( targetConfig );
            } catch ( e ) {
                apex.debug.error( {
                    "module": "util.js",
                    "msg": "Error while try to parse targetConfig. Please check your Config JSON. Standard Config will be used.",
                    "err": e,
                    "targetConfig": targetConfig
                } );
            }
        } else {
            tmpJSON = $.extend( true, {}, targetConfig );
        }
        /* try to merge with standard if any attribute is missing */
        try {
            finalConfig = $.extend( true, {}, srcConfig, tmpJSON );
        } catch ( e ) {
            finalConfig = $.extend( true, {}, srcConfig );
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while try to merge 2 JSONs into standard JSON if any attribute is missing. Please check your Config JSON. Standard Config will be used.",
                "err": e,
                "finalConfig": finalConfig
            } );
        }
        return finalConfig;
    },
    tooltip: {
        show: function ( htmlContent, backgroundColor, maxWidth ) {
            try {
                if ( $( "#dynToolTip" ).length === 0 ) {
                    const tooltip = $( "<div></div>" )
                        .attr( "id", "dynToolTip" )
                        .css( "color", "#111" )
                        .css( "max-width", "400px" )
                        .css( "position", "absolute" )
                        .css( "top", "0px" )
                        .css( "left", "0px" )
                        .css( "z-index", "2000" )
                        .css( "background-color", "rgba(240, 240, 240, 1)" )
                        .css( "padding", "10px" )
                        .css( "display", "block" )
                        .css( "top", "0" )
                        .css( "overflow-wrap", "break-word" )
                        .css( "word-wrap", "break-word" )
                        .css( "-ms-hyphens", "auto" )
                        .css( "-moz-hyphens", "auto" )
                        .css( "-webkit-hyphens", "auto" )
                        .css( "hyphens", "auto" );
                    if ( backgroundColor ) {
                        tooltip.css( "background-color", backgroundColor );
                    }
                    if ( maxWidth ) {
                        tooltip.css( "max-width", maxWidth );
                    }
                    $( "body" ).append( tooltip );
                } else {
                    $( "#dynToolTip" ).css( "visibility", "visible" );
                }

                $( "#dynToolTip" ).html( htmlContent );
                $( "#dynToolTip" )
                    .find( "*" )
                    .css( "max-width", "100%" )
                    .css( "overflow-wrap", "break-word" )
                    .css( "word-wrap", "break-word" )
                    .css( "-ms-hyphens", "auto" )
                    .css( "-moz-hyphens", "auto" )
                    .css( "-webkit-hyphens", "auto" )
                    .css( "hyphens", "auto" )
                    .css( "white-space", "normal" );
                $( "#dynToolTip" )
                    .find( "img" )
                    .css( "object-fit", "contain" )
                    .css( "object-position", "50% 0%" );
            } catch ( e ) {
                apex.debug.error( {
                    "module": "utils.js",
                    "msg": "Error while try to show tooltip",
                    "err": e
                } );
            }
        },
        setPosition: function ( event ) {
            $( "#dynToolTip" ).position( {
                my: "left+6 top+6",
                of: event,
                collision: "flipfit"
            } );
        },
        hide: function () {
            $( "#dynToolTip" ).css( "visibility", "hidden" );
        },
        remove: function () {
            $( "#dynToolTip" ).remove();
        }
    },
    printDOMMessage: {
        show: function ( id, text, icon, color ) {
            const div =$( "<div>" );
            if ( $( id ).height() >= 150 ) {
                const subDiv = $( "<div></div>" );

                const iconSpan = $( "<span></span>" )
                    .addClass( "fa" )
                    .addClass( icon || "fa-info-circle-o" )
                    .addClass( "fa-2x" )
                    .css( "height", "32px" )
                    .css( "width", "32px" )
                    .css( "margin-bottom", "16px" )
                    .css( "color", color || "#D0D0D0" );

                subDiv.append( iconSpan );

                const textSpan = $( "<span></span>" )
                    .text( text )
                    .css( "display", "block" )
                    .css( "color", "#707070" )
                    .css( "text-overflow", "ellipsis" )
                    .css( "overflow", "hidden" )
                    .css( "white-space", "nowrap" )
                    .css( "font-size", "12px" );

                div
                    .css( "margin", "12px" )
                    .css( "text-align", "center" )
                    .css( "padding", "10px 0" )
                    .addClass( "dominfomessagediv" )
                    .append( subDiv )
                    .append( textSpan );
            } else {  
                const iconSpan = $( "<span></span>" )
                    .addClass( "fa" )
                    .addClass( icon || "fa-info-circle-o" )
                    .css( "font-size", "22px" )
                    .css( "line-height", "26px" )
                    .css( "margin-right", "5px" )
                    .css( "color", color || "#D0D0D0" );

                const textSpan = $( "<span></span>" )
                    .text( text )
                    .css( "color", "#707070" )
                    .css( "text-overflow", "ellipsis" )
                    .css( "overflow", "hidden" )
                    .css( "white-space", "nowrap" )
                    .css( "font-size", "12px" )
                    .css( "line-height", "20px" );

                div
                    .css( "margin", "10px" )
                    .css( "text-align", "center" )
                    .addClass( "dominfomessagediv" )
                    .append( iconSpan )
                    .append( textSpan );
            }
            $( id ).append( div );
        },
        hide: function ( id ) {
            $( id ).children( '.dominfomessagediv' ).remove();
        }
    },
    noDataMessage: {
        show: function ( id, text ) {
            util.printDOMMessage.show( id, text, "fa-search" );
        },
        hide: function ( id ) {
            util.printDOMMessage.hide( id );
        }
    },
    errorMessage: {
        show: function ( id, text ) {
            util.printDOMMessage.show( id, text, "fa-exclamation-triangle", "#FFCB3D" );
        },
        hide: function ( id ) {
            util.printDOMMessage.hide( id );
        }
    },
    copyJSONObject: function ( object ) {
        try {
            let objectCopy = {};
            let key;

            for ( key in object ) {
                if ( object[key] ) {
                    objectCopy[key] = object[key];
                }
            }
            return objectCopy;
        } catch ( e ) {
            apex.debug.error( {
                "module": "util.js",
                "msg": "Error while try to copy object",
                "err": e
            } );
        }
    },
    splitString2Array: function ( pString ) {
        if ( typeof pString !== "undefined" && pString !== null && pString !== "" && pString.length > 0 ) {
            if ( apex && apex.server && apex.server.chunk ) {
                return apex.server.chunk( pString );
            } else {
                /* apex.server.chunk only avail on APEX 18.2+ */
                const splitSize = 8000;
                let tmpSplit;
                let retArr = [];
                if ( pString.length > splitSize ) {
                    for ( retArr = [], tmpSplit = 0; tmpSplit < pString.length; ) {
                        retArr.push( pString.substr( tmpSplit, splitSize ) );
                        tmpSplit += splitSize;
                    }
                    return retArr;
                }
                retArr.push( pString );
                return retArr;
            }
        } else {
            return [];
        }
    },
    removeHTML: function ( pHTML ) {
        if ( apex && apex.util && apex.util.stripHTML ) {
            return apex.util.stripHTML( pHTML );
        } else {
            return $( "<div/>" ).html( pHTML ).text();
        }
    },
    isStringaJSON: function ( pString ) {
        try {
            JSON.parse( pString );
        } catch ( e ) {
            return false;
        }
        return true;
    },
    isTouchDevice: function () {
        return "ontouchstart" in window;
    },
    isBetween: function ( pValue, pValue2, pRange ) {
        const range = pRange || 0,
              min = pValue2 - range,
              max = pValue2 + range;
        return ( pValue >= min && pValue <= max );
    },
    numPad: function ( number ) {
        let r = String( number );
        if ( r.length === 1 ) {
            r = '0' + r;
        }
        return r;
    },
    getNowUTC: function () {
        let now = new Date();
        return now.getUTCFullYear() +
            '-' + wm.util.pad( now.getUTCMonth() + 1 ) +
            '-' + wm.util.pad( now.getUTCDate() ) +
            'T' + wm.util.pad( now.getUTCHours() ) +
            ':' + wm.util.pad( now.getUTCMinutes() ) +
            ':' + wm.util.pad( now.getUTCSeconds() ) +
            '.' + String( ( now.getUTCMilliseconds() / 1000 ).toFixed( 3 ) ).slice( 2, 5 ) +
            'Z';
    },
    getRandomNumberInRange: function ( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) + min );
    },
    copy2Clipboard: function ( pElement ) {
        const $temp = $( "<textarea>" );
        $( "body" ).append( $temp );
        const str = $( pElement ).text() || $( pElement ).val();
        $temp.val( str ).select();
        document.execCommand( "copy" );
        $temp.remove();
    },
    removeElementFromArray: function ( pArr, pSrcStr ) {
        if ( pSrcStr ) {
            let i = 0;
            while ( i < pArr.length ) {
                if ( pArr[i] === pSrcStr ) {
                    pArr.splice( i, 1 );
                } else {
                    i = i +1;
                }
            }
            return pArr;
        } else {
            apex.debug.error( {
                "module": "util.js",
                msg: "Error while try to remove element from array. No element to remove is given."
            } );
        }
    },
    getStrByteLength: function ( pStr ) {
        if ( pStr ) {
            const tmp = encodeURIComponent( pStr ).match( /%[89ABab]/g );
            return pStr.length + ( tmp ? tmp.length : 0 );
        }
        return 0;
    },
    localStorage: {
        check: function () {
            if ( typeof ( Storage ) !== "undefined" ) {
                return true;
            } else {
                apex.debug.info( {
                    "module": "util.js",
                    msg: "Your browser does not support local storage"
                } );
                return false;
            }
        },
        set: function ( pKey, pStr, pType ) {
            try {
                if ( util.localStorage.check ) {
                    if ( pType === "permanent" ) {
                        localStorage.setItem( pKey, pStr );
                    } else {
                        sessionStorage.setItem( pKey, pStr );
                    }
                }
            } catch ( e ) {
                apex.debug.error( {
                    "module": "util.js",
                    "msg": "Error while try to save item to local Storage. Confirm that you not exceed the storage limit of 5MB.",
                    "err": e
                } );
            }
        },
        get: function ( pKey, pType ) {
            try {
                if ( util.localStorage.check ) {
                    if ( pType === "permanent" ) {
                        return localStorage.getItem( pKey );
                    } else {
                        return sessionStorage.getItem( pKey );
                    }
                }
            } catch ( e ) {
                apex.debug.error( {
                    "module": "util.js",
                    "msg": "Error while try to read item from local Storage",
                    "err": e
                } );
            }
        },
        remove: function ( pKey, pType ) {
            try {
                if ( util.localStorage.check ) {
                    if ( pType === "permanent" ) {
                        localStorage.removeItem( pKey );
                    } else {
                        sessionStorage.removeItem( pKey );
                    }
                }
            } catch ( e ) {
                apex.debug.error( {
                    "module": "util.js",
                    "msg": "Error while try remove item from local Storage",
                    "err": e
                } );
            }
        }
    }
};
