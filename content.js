/*
chrome.runtime.onMessage.addListener(
    function(message, callback) {
        if (message == "runContentScript"){
            chrome.tabs.executeScript({
                file: 'catalog_symfony_fr.js'
            });
        }
    }
);
*/
  
Object.assign(catalog, catalog_symfony)

var config = {
    "x-debug": {
        getErrorElements: function(){
            return $(".xdebug-error")
        },
        insertHelp: function(errorElement, help){
            $(errorElement).parent().append(help)
        },
        getRegex: function(){
            return /(Warning|Fatal error|Notice): (.*) in (.*).php on line (\d+)/gmi
        },
        getErrorMessage: function(errorContent){
            var [match, type, errorMessage, file, line] = this.getRegex().exec(errorContent)
            return errorMessage
        }
    },
    "symfony4": {
        getErrorElements: function(){
            return $(".exception-message-wrapper h1")
        },
        insertHelp: function(errorElement, help){
            $(errorElement).parents(".exception-summary").after(help)
        },
        getRegex: function(){
            return /.*/gmi
        },
        getErrorMessage: function(errorContent){
            return errorContent
        }
    }
};

var env = null;
if ($(".xdebug-error").length > 0){
    env = "x-debug"
}
else if ($(".exception-message-wrapper").length > 0){
    env = "symfony4"
}

var errors = [];
if (env != null){
    var errors = config[env].getErrorElements()
}
if (errors.length > 0){
    var regex = config[env].getRegex()
    errors.each(function(i){
        var errorContent = $(this).text()
        var errorMessage = config[env].getErrorMessage(errorContent)
        var help = createHelpMessage(errorMessage);
        config[env].insertHelp($(this), help)
    });        
}
else {
    console.info("no PHP errors detected by PHP Coach");
}

function createHelpMessage(errorMessage){
    var help = $('<div>').addClass('php-coach-help')

    for (k in catalog){
        if (errorMessage.indexOf(k) >= 0){
            help.html(catalog[k].description)
            help.append('<h5>Raisons possibles</h5>')
            var reasonsUl = $("<ul>")
            for (var i = 0; i < catalog[k].reasons.length; i++){
                reasonsUl.append('<li>' + catalog[k].reasons[i] + '</li>')
            }
            help.append(reasonsUl)
            return help
        }
        else {
            console.log("not found")
        }
    }
}