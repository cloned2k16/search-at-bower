"use strict";

var _log        // define this to get some log message!!
,   _onDocReady =  (function    (w)     {
    var  info   =   {
                        name        :   '_onDocReady'
                    ,   desc        :   'handles document ready state'
                    ,   version     :   '0.0.3'
                }
    ,   D       =   document
    ,   DOMCL   =   'DOMContentLoaded'
    ,   ORSC    =   'onreadystatechange'
    ,   AEL     =   'addEventListener'
    ,   AE      =   'attachEvent'
    ,   DE      =   'documentElement'
    ,   RS      =   'readyState'
    ,   DS      =   'doScroll'
    ,   OL      =   'onload'
    ,   LD      =   'load'
    ,   SD      =   'left'
    ,   U       =   '# using:'
    ,   W       =   'setTimeout'
    ,   WS      =   'wait scroll'
    ,   CMPLT   =   'complete'
    ,   NTRCTV  =   'interactive'
    ,   queue   =   []
    ,
    bind    =   function    bind    (cb)        {
        var done    = false
        ,   ready   = function  () { if (done) return; done = true; cb(); }
        ;
        
        if ( D[AEL] ) {                         _log && _log(U,DOMCL);
             D[AEL]( DOMCL , ready, false );        
        } 
        else if ( D[AE] ) {                     _log && _log(U,AE);
            try {
             var isFrame = w.frameElement != null;
            } 
            catch(e) {}
            if ( D[DE][DS] && !isFrame ) {      _log && _log(U,WS);
                var w4it =function(){
                    if (done) return
                    try {
                        D[DE][DS](SD);
                        ready()
                    } 
                    catch(e) {
                        w[W](w4it, 33)
                    }
                }
                w4it()
            }
            
            D[AE](ORSC, function (){            _log && _log(U,ORSC);
                var sts = D[RS];
                if ( sts === CMPLT || sts === NTRCTV ) ready()
            })
        }
        
            
             if (w[AEL]) w[AEL] (LD  , ready, false);
        else if (w[AE])  w[AE]  (OL  , ready);
        else {
            var fn = w[OL];
            w[OL] = function () { 
                ready();            // we go first
                fn && fn();
            }
        }
    }
    ,
    init    =   function    init    ()          {
        w._D = D
        w._B = D.body;
    }
    ,
    onReady =   function    onReady (callBack)  { 
        var a    =  queue   
        ,   exec =  function () { init(); while (a.length) a.shift()(); }
        if (!a.length) bind(exec);
        a.push(callBack);
    }
    onReady.info=info;
    return onReady;
    
})(window);

/*
    usage:
        _onDocReady ( function () {    console.log('DOM is Ready now!');    
    
        });

        _onDocReady ( function () {    console.log('this have been queued, and executes after first ..');    
    
        });

*/        