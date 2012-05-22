goliath.Browser.addModule("controls");

var audiorecorder = new Object();
ajax.audiorecorder = audiorecorder;

audiorecorder.create=function()
{
    ajax.control.create(this);
}

audiorecorder.createFromElement=function(tcElementName)
{
    return ajax.control.createFromElement(tcElementName, audiorecorder.create);
}

audiorecorder.create.prototype.onGetDefaultClassName=function()
{
    return "audiorecorder";
}

audiorecorder.create.prototype.onCreateElement=function()
{
    var loRecorder = document.createElement("applet");
    loRecorder.setAttribute("code", "com.softsynth.javasonics.recplay.RecorderUploadApplet");
    loRecorder.setAttribute("codebase", "./lib");
    loRecorder.setAttribute("archive", "JavaSonicsListenUp.jar,OggXiphSpeexJS.jar");
    
    var loParam = document.createElement("param");
    loParam.setAttribute("name", "showSendButton");
    loParam.setAttribute("value", "no");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "frameRate");
    loParam.setAttribute("value", "11025.0");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "maxRecordTime");
    loParam.setAttribute("value", "60.0");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "numChannels");
    loParam.setAttribute("value", "1");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "numChannels");
    loParam.setAttribute("value", "1");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "width");
    loParam.setAttribute("value", "400");
    loRecorder.appendChild(loParam);
    
    loParam = document.createElement("param");
    loParam.setAttribute("name", "height");
    loParam.setAttribute("value", "200");
    loRecorder.appendChild(loParam);
    
    
    
    /*
    loRecorder.codebase="../codebase";
    loRecorder.archive="JavaSonicsListenUp.jar,OggXiphSpeexJS.jar";
    loRecorder.name="ListenUpRecorder";
    loRecorder.width="400";
    loRecorder.height="100";
    
    <applet
    mayscript="true"
    CODE="com.softsynth.javasonics.recplay.RecorderUploadApplet"
    CODEBASE="../codebase"
    ARCHIVE="JavaSonicsListenUp.jar,OggXiphSpeexJS.jar"
    NAME="ListenUpRecorder"
    WIDTH="400" HEIGHT="100">
                  <!-- Disable SEND button in Applet so we can send from JavaScript. -->
                  <param name="showSendButton" value="no">
                  <param name="frameRate" value="11025.0">

                  <param name="numChannels" value="1">
                  <param name="maxRecordTime" value="30.0">
                  <param name="uploadFileName" value="whatever.wav">
                  <param name="uploadURL" value="stub_success.txt">
                  If you see this text then Java is disabled in your browser. Please download the Sun Java Plugin from "www.sun.com".
                </applet>
                )
                */
    
    return loRecorder;
}

