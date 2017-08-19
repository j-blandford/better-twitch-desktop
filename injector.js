(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
    };
    script.src = 'https://localhost:8080/btd.js';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));