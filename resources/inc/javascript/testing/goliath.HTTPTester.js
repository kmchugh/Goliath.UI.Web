david.namespace('goliath');


/**
 * Definition of the Collector View Class
 */
goliath.HTTPTester = (function($) {
    var m_oMethod = null;
    var m_oContentType = null;
    var m_oResponseType = null;
    var m_oResultCode = null;
    var m_oURL = null;
    var m_oSend = null;
    var m_oBody = null;
    var m_oResponse = null;
    
    return $bb.View.extend({
       initialize: function()
       {
           var loSelf = this;
           m_oMethod = $('#txtMethod');
           m_oContentType = $('#txtContentType');
           m_oResponseType = $('#txtResponseType');
           m_oURL = $('#txtURL');
           m_oSend = $('#cmdSend');
           m_oBody = $('#txtRequestBody');
           m_oResponse = $('#txtResponse');
           m_oResultCode = $('#txtResultCode');
           
           m_oMethod.bind("change", function(){loSelf.onMethodChanged();});
           m_oSend.bind("click", this, function(){loSelf.onSendClicked();});
           
           this.onMethodChanged();
       },
       allowsBody : function()
       {
           var lcMethod = m_oMethod.val();
           return !(lcMethod == "GET" || lcMethod == "HEAD" || lcMethod == "OPTIONS" || lcMethod == "DELETE");
           
       },
       onMethodChanged :function()
       {
           if (!this.allowsBody())
           {
               m_oBody.attr("disabled", "disabled");
               m_oBody.addClass("disabled");
           }
           else
           {
               m_oBody.removeAttr("disabled");
               m_oBody.removeClass("disabled");
           }
       },
       onSendClicked : function()
       {
           // Check the URL:
           var lcURL = m_oURL.val();
           if (this.validateURL(m_oURL, lcURL))
           {
               var loSelf = this;
               
               // Send the request
               $jQ.ajax(
                   {
                       headers : { Accept : m_oResponseType.val()},
                       url: lcURL,
                       cache: false,
                       contentType: m_oContentType.val(),
                       data: this.allowsBody() ? m_oBody.val() : null,
                       type: m_oMethod.val(),
                       complete : function(toXHR, tcStatus){loSelf.setResultCode(tcStatus); loSelf.setResult(toXHR.responseText);}
                   });
           }
           else
           {
               alert("URL is invalid");
           }
       },
       setResultCode : function(tcStatus)
       {
           m_oResultCode.text(tcStatus);
       },
       setResult : function(tcResult)
       {
           m_oResponse.text(tcResult);
       },
       validateURL : function(toElement, tcURL)
       {
           return true;
            if (tcURL.length == 0) { return false; }
 
            // if user has not entered http:// https:// or ftp:// assume they mean http://
            if(!/^(https?|ftp):\/\//i.test(tcURL)) {
                tcURL = 'http://'+tcURL; // set both the value
                $(toElement).val(tcURL); // also update the form element
            }
            
            // now check if valid url
            // http://docs.jquery.com/Plugins/Validation/Methods/url
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(tcURL);
       }
       
    });
    
    
})($jQ);
