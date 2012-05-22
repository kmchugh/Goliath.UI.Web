<page>
    <title>Testing web service</title>
    
    <style>
        .formCentered
        {
            margin-left:auto;
            margin-right:auto;
            margin-top: 25px;
            overflow:auto;
            text-align:left;
            width:980px;
            border: 1px solid grey;
        }

        .formCentered h1
        {
            width: 980px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin: 2em 0 2em 0;
            display: inline-block;
        }

        .formCentered .inputArea
        {
            display: inline-block;
            width: 650px;
            padding: 0 1.5em 0 1.5em;
        }

        .formCentered .actionArea
        {
            display: inline-block;
            width: 200px;
        }

        .formCentered .actionArea button
        {
            width: 100px;
            height: 100px;
        }

        .formCentered label
        {
            width: 180px;
            display: inline-block;
        }

        .formCentered input, .formCentered select
        {
            width: 450px;
        }

        .formCentered .dataArea
        {
            border: 1px solid grey;
            margin: 1em;
            padding: 1em;
        }

        .formCentered textarea
        {
            width: 910px;
            height: 300px;
        }

        #txtResponse
        {
            width: 910px;
            border: 1px solid grey;
            display: inline-block;
            background: #ededed;
            height: 300px;
            overflow: auto;
        }
        
        .disabled
        {
            background: #eaeaea;
            color: #999;
        }

    </style>

    <div id="frmTesting" class="formCentered">
        <h1>HTTP Testing</h1>

        <div class="inputArea">
            <label>URL:</label>
            <input type="text" id="txtURL"/><br/>

            <label>HTTP Method:</label>
            <select id="txtMethod">
                <option selected="selected">GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>OPTIONS</option>
                <option>HEAD</option>
                <option>TRACE</option>
                <option>CONNECT</option>
            </select>

            <label>Content Type:</label>
            <select id="txtContentType">
                <option selected="selected">application/xml</option>
                <option>application/html</option>
                <option>application/json</option>
            </select>
            
            <label>Response Type:</label>
            <select id="txtResponseType">
                <option selected="selected">application/xml</option>
                <option>application/html</option>
                <option>application/json</option>
            </select>
        </div>

        <div class="actionArea">
            <button id="cmdSend">Send</button>
        </div>


        <div class="dataArea">
            <textarea id="txtRequestBody"/>
            <label>Response:</label><label id="txtResultCode"></label>
            <div id="txtResponse"></div>
        </div>
    </div>

    <script language="javascript">
        var onPageInit =function()
        {
            david.Bootstrap.addModule("testing/goliath.HTTPTester", 100, []).addLoadedCallback(function(){new goliath.HTTPTester($jQ("#frmTesting"));});
            david.Bootstrap.loadModule("testing/goliath.HTTPTester");
        }
    </script>

</page>

