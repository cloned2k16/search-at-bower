// server.js

    
    //  ===================================================== Set Up
    const   _APP                =   {}
    ,       express             =   require             ('express')
    ,       app                 =   express()     
    ,       router              =   express.Router()     
    ,       morgan              =   require             ('morgan')            
    ,       fs                  =   require             ('fs')    
    ,       exec                =   require             ('child_process').exec
    ;
    var     timers              = []
    ,       fileList        =   ''
    ,       pageHeader      
    ,       pageFooter   
    ,       cacheName   = 'packages'
    ,       numEntries
    ;
    //  ===================================================== Configuration
        _APP.PUBLIC_HTML    = '/public_html'; 
        _APP.BOWER_DIR      = '/bower_components';
        _APP.LISTEN_PORT    = 1111;
        _APP.log            = function log  ()      { return Function.apply.call(console.log    ,console,arguments); };
        _APP.timeSt         = function      (name)  { return timers[name]= (new Date()).getTime();};
        _APP.timeEn         = function      (name)  { return (new Date()).valueOf() - timers[name];};
        _                   = _APP;
   
    //  ===================================================== Application
    
    const   readFile        = function  (fn , then)     {
                        fs.readFile(fn, 'utf8', function (err,data) {
                            if (err) _.log  (err);
                            else     then   (data);
                        });
        
    }
    ,       copyFile        = function  (tn,name)       {
        exec('copy '+tn +' '+name+' /V /Y', (err, stdout, stderr) => {
                    if (err) _.log(err);
                    else {
                       // _.log('copied');
                    }
        });
    }
    ,       storeCache      = function  (s)             {
                             fileList = s.split('\n');
                             fileList.shift();
                             fileList.shift();
    }
    ,       findPackages    = function  (fn,iTime)      {
                var me          = 'findPackages'
                ,   fileName    = fn+'.tmp'
                ,   outFileN    = fn+'.lst'
                ,   toMin       = 2500
                ,   delay       = 0
                ;
                
                function loop () { _.timeSt(me);    

                 exec('call bower search > '+fileName, (err, stdout, stderr) => {
                    if (err) {
                        _.log(err);
                        delay   = 10e3;
                    }                        
                    else {
                        readFile(fileName, (s) => storeCache(s) );
                        copyFile(fileName,outFileN);
                    }    
                    var    ellpsd  =   _.timeEn(me)
                    ,      to      =   iTime - ellpsd;
                    ;
                    to = to > toMin ? to : toMin;
                    _.log('elps: ',ellpsd,'to:',to);
                    setTimeout(loop, to + delay);
                    delay=0;
                 });
                 
                };
                loop(); //fire the loop
            }  
    ;
    // load search page templates
    readFile('tmplt/pageHeader.html', (s) => pageHeader = s );
    readFile('tmplt/pageFooter.html', (s) => pageFooter = s );
     
    // setup static content folders 
    app.use(express.static(__dirname + _.PUBLIC_HTML));                             //
    app.use(express.static(__dirname + _.BOWER_DIR  ));
    
    // read stored DB    
    readFile(cacheName+'.lst', (s) => storeCache(s) );    
    
    // start DB refresh loop (10 minutes)
    findPackages(cacheName, 60e3 * 10);
    
    app.use('/search/', function (reQ,response) {
        var Q   =   reQ.path.substring(1)
        ,   rex =   '('+Q+')+'
        ,   re  =   new RegExp()
        ,   res =   pageHeader.replace('^?¿',Q)+  '<pre><table width=100%>'
        ,   line
        ,   max =   1000
        ,   cnt =   0
        ,   idx =   0
        ;
        
        numEntries=fileList.length; 
        res+='<tr><th></th><th>Num registered Packages: '+numEntries+'</th></tr>';
        
        re.compile(rex,'gi');
        for (i in fileList){
         line=fileList[i].trim();   
         ++idx;
         var ss=re.test(line);
            if (ss){ re.compile(rex,'gi');
             var ln=line.split(' ');
             res+='<tr><td>'+idx+'</td><td>'+ln[0]+'</td><td>'+ln[1]+'</td></tr>';
             if (++cnt > max) { 
              res+='<tr><td id=warn colspan=3>WARNING RESULT TRUNCATED!</td></tr>'; 
              break; 
             }
            }
        }
        res+='<tr><td id=info colspan=3>'+cnt+' results</td></tr>'; 
        res+='</table></pre>'+pageFooter;
        response.send(res);
    });
    
    morgan && app.use(morgan('dev'));                                               // log every request to the console
    app.use(function(req, res){ res.sendStatus(404);});                             // simply NOT FOUND

    // ====================================================== Main Loop
    app.listen(_.LISTEN_PORT);
    _.log("Express server listening on http://localhost:"+_.LISTEN_PORT+"/");
 