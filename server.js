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
        _APP.LISTEN_PORT    = process.env.PORT || 1111;
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
        exec('cp '+tn +' '+name+' -f', (err, stdout, stderr) => {
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
                             fileList.pop();
                             
    }
    ,       findPackages    = function  (fn,iTime)      {
                var me          = 'findPackages'
                ,   fileName    = fn+'.tmp'
                ,   outFileN    = fn+'.lst'
                ,   toMin       = 2500
                ,   delay       = 0
                ;
                
                function loop () { _.timeSt(me);    

                 exec('bower search > '+fileName, (err, stdout, stderr) => {
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
        ,   urx =   '(github\.com\/[a-zA-Z0-9]+\/)'
        ,   re  =   new RegExp()
        ,   res =   pageHeader.replace('^?¿',Q)+  '<pre><table width=100%>'
        ,   line
        ,   max =   1000
        ,   cnt =   0
        ,   idx =   0
        ,   i
        ,   list=   []
        ,   tblS=   ''
        ,   user
        ,   proj
        ;
        
        
        
        re.compile(rex,'gi'); 
        
        for (i in fileList) list[++idx] = fileList[i];
        numEntries=idx-1;
        res+='<tr><th></th><th>Num registered Packages: '+numEntries+'</th></tr>';
        
        for (i=0; i < numEntries; i++)  {    
         //idx=i+1
         line = list[idx--].trim();
         
         var ss=re.test(line);
            if (ss){ 
             re.compile(urx);
             user = re.exec(line);
             
             if (user){
               var  my  = user[0]
               ,    pos = user.index
               ,    len = my.length
               user = my.substring(11,len-1);
               proj = line.substring(pos+len,line.length-4);
             }
             else { user='no.user'; proj='no.proj'; }
             re.compile(rex,'gi'); // (re)compile each time otherwise will fail!!
             var    ln  =line.split(' ')
             ,      name=ln[0]
             ,      lnk =ln[1]
             tblS   +='<tr><td>'+idx+'</td>'
                    +'<td><b>'+name+'</b></td>'
                    +'<td>'+user+'</td>'
                    +'<td>'+proj+'</td>'
                    +'<td><a target=new href="'+lnk+'">'+lnk+'</a></td></tr>';
             if (++cnt >= max) { 
              res+='<tr><td id=warn colspan=5>WARNING RESULT TRUNCATED!</td></tr>'; 
              break; 
             }
            }
        }
        res+='<tr><td id=info colspan=5>'+cnt+' results</td></tr>'; 
        res+='<tr><td>idx</td><td>Name</td><td>User</td><td>Package</td><td>URL</td></tr>';
        res+=tblS;
        res+='</table></pre>'+pageFooter;
        response.send(res);
    });
    
    morgan && app.use(morgan('dev'));                                               // log every request to the console
    app.use(function(req, res){ res.sendStatus(404);});                             // simply NOT FOUND

    // ====================================================== Main Loop
    app.listen(_.LISTEN_PORT);
    _.log("Express server listening on http://localhost:"+_.LISTEN_PORT+"/");
 
