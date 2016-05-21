'use strict';


var _padLeft        =   {   name:       'Padding from Left side (aka _padLeft)' 
                    ,       desc:       'A module handling Left alignment for string'
                    ,       version:    '0.0.10'
                    };

_padLeft.spaces     =   [ 
    ''
  , ' '                 //1
  , '  '                //2
  , '   '           
  , '    '              //4
  , '     '         
  , '      '
  , '       '
  , '        '          //8
  , '         '
  , '          '
  , '           '
  , '            '
  , '             '
  , '              '
  , '               '
  , '                '  //16
];

_padLeft.zeros      =   [ 
    ''
  , '0'                 //1
  , '00'                //2
  , '000'           
  , '0000'              //4
  , '00000'         
  , '000000'
  , '0000000'
  , '00000000'          //8
  , '000000000'
  , '0000000000'
  , '00000000000'
  , '000000000000'
  , '0000000000000'
  , '00000000000000'
  , '000000000000000'
  , '0000000000000000'  //16
];

_padLeft.tabSs      =   4;  // most common tab size

_padLeft.tabs       =   [   // that's the most tricky case 
    ''
  , '\t'                                    //1  (4)
  , '\t\t'                                  //2  (8)
  , '\t\t\t'                                //  (12)
  , '\t\t\t\t'                              //4
  , '\t\t\t\t\t'         
  , '\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t'                      //8
  , '\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t\t\t'              //12 
  , '\t\t\t\t\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'
  , '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'      //16
];

_padLeft.func       =   function  (str, len, ch)  {
  str       = '' + str; 
  ch        = arguments.length<=2 ? ' ' : ''+ch;
  len       = len - str.length;
  
  if (len   <= 0) return str; //nothing to do ..

  var   pad     = '' 
  ,     cache
  ,     chSz    = ch.length
  ,     ovrSz   
  ;

        if (ch == '\t') { cache = _padLeft.tabs   ; chSz=_padLeft.tabSz; };         

  ovrSz     =  (len % chSz);      
  len       =  (len / chSz) >> 0; // force int :D
  
 
        if (ch == ' ' )   cache = _padLeft.spaces ;
  else  if (ch == '0' )   cache = _padLeft.zeros  ;
      
  if (cache) {  
    var cLen=cache.length-1;
    if (len <= cLen) return cache[len] + str;
    len-=cLen;
    pad =cache[cLen]
  }
    
  pad += 0==len   ? '' : ch.repeat(len);

  pad += 0==ovrSz ? '' : ch.substring(0, ovrSz);
      
  return pad + str;
}

_padLeft.func.
         obj        = _padLeft;

_padLeft.func.
         setTabSize = function (sz) { _padLeft.tabSz = sz; }


if ( typeof navigator  != 'undefined') { // browser friendly ... :D
    console.log('navigator: ',navigator);
   _String_Prototypes.apply(window);
   
}
else    { // Node
    require('string_prototypes').apply(global);
    module.exports      = _padLeft.func;
}

