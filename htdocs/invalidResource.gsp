<page>
    <include>/resources/xslt/UI/Web/HTMLBase.xslt</include>
    <link href="/resources/themes/panels.less" rel="stylesheet" type="text/css"/>
    <panel>
    <title>Invalid resource</title>    
    <content>
        <div id="frmError" class="error">
            <div id="txtTitle" class="title">Unknown resource, or access denied.</div>
            <img class="image" src="/resources/images/icons/error.png"/>
            <div id="txtMessage" class="message"><b style="font-style: italic;">{{path}}{{file}}</b> either does not exist or you do not have access to it.</div>
            <div><a href="{{getReferrer}}">Go back</a> or <a href="/">Go home</a></div>
        </div>
    </content>
    </panel>
</page>