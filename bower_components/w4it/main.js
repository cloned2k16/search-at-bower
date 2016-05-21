"use strict";

var W4it        =   { 
                        name:       'Wait For It (aka W4it)' 
                    ,   desc:       'A module handling Async Wait Sleep etc..'
                    ,   version:    '0.0.6'
                    ,   Anima:      false
                    ,   _out:       this
                    };

if (typeof module !== 'undefined' && module.exports) { 
    module.exports  =   W4it; 
    W4it._out       =   process.stdout
}
else W4it.write     =   function () { /*black hole*/ }

    W4it.disableAnimation   =   function () { this.Anima = false; };        
    W4it.enableAnimation    =   function () { this.Anima = true;  };        
    
    W4it.done   = function  Wait4It (doneFn,thenFn) {   // you may call it with  W4IT.done('boolPropertyName', obj )
                                                        // where obj.boolPropery is the flag that signal when we are done :D
        
        if (! (doneFn instanceof Function)) {           // if not a Function we assume the above and setup setter getter for it ...
        
            var a       =   arguments
            ,   o       =   a[1]
            ,   n       =   a[0]
            ,   inProg  =   o[n]
            ;
            Object.defineProperty(o, n, {   set: function   (v) { inProg=v;       }    
                                        ,   get: function   ()  { return inProg;  } 
            });
            doneFn = function () { return !inProg; }
            thenFn = a[2]
        }
    
        var my
        ,   sleepT  = 13    
        ,   ntrvll  = 17
        ,   cnt     =  0 
        ,   to      =  0 
        ,   aNiMeD  = [
        '             '
     ,  '.            '
     ,  ' .           '
     ,  '  o          '
     ,  '   o         '
     ,  '    o        '
     ,  '     O       '
     ,  '      O      '
     ,  '       O     '
     ,  '        o    '
     ,  '         o   '
     ,  '          o  '
     ,  '           . '
     ,  '            .'
     ,  '             '
     ,  '            .'
     ,  '           . '
     ,  '          o  '
     ,  '         o   '
     ,  '        o    '
     ,  '       O     '
     ,  '      O      '
     ,  '     O       '
     ,  '    o        '
     ,  '   o         '
     ,  '  o          '
     ,  ' .           '
     ,  '.            '
     ,  '             '
    ]    
        ,   loop    = function () {
                    if ( doneFn()) { 
                        clearTimeout(to);
                        setTimeout(thenFn,1);  
                        if (W4it.Anima) W4it._out.write('\n.\n');
                        return; 
                    }    
            if (!to){  
                cnt++;
                to=setTimeout( function () {
                    if(!doneFn() && W4it.Anima ) W4it._out.write(aNiMeD[cnt%aNiMeD.length]+'\r');
                    to=0;
                },16);
            } 
            setTimeout(loop,sleepT);
        } 
        ;
        loop();
    };


