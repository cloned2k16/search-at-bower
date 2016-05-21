     _log = function () { Function.apply.call(console.log,console,arguments); }
     
     _log   (_onDocReady.info);
     _log   ('before');
     _onDocReady ( function () { 
       var  _out    =   _D.getElementById('out') ;
            _log  = function () {
             
             for (var n in arguments) {
              _out.innerHTML +='<br>'+arguments[n];
             }
            }
            
            _log('DOM is Ready');
     });  
     _log('after');
     _onDocReady ( function () { _log('DOM is Ready (second subscriber)');
     });  
     _onDocReady ( function () { _log('DOM is Ready (third subscriber)');
     });  
     