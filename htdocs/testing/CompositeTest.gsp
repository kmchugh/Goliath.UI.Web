<!-- ======================================================
 * CompositeTest.gsp
 *
 * Author:      admin
 * Created:     Jun 30, 2011, 5:26:30 PM
 *
 * Description
 * ********************************************************
 * General Class Description.
 *
 * Change Log
 * ********************************************************
 * Init.Date        Ref.            Description
 * ********************************************************
 *
 * ========================================================
-->
<page>
    <title>CompositeTest</title>

    <table width="100%"  style="font-size:12px;">
        <thead>
            <tr>
                <td>Base Image:</td>
                <td><input style="width: 99.5%" id="txtImage" type="text" value="./resources/images/tux.jpg"/></td>
                <td rowspan="7"><button id="cmdUpdate" onclick="onUpdateClicked()" style="text-align: center; width:99.5%; height: 200px">Update</button></td>
            </tr>
            <tr>
                <td>Image to be composited:</td>
                <td><input style="width: 99.5%" id="txtOverlayImage" type="text" value="./resources/images/eb1.jpg"/></td>
                
            </tr>
            <tr>
                <td>Alpha value:</td>
                <td><input style="width: 99.5%" id="txtAlpha" type="text" value="0.5"/></td>
            </tr>
            <tr>
                <td>X Position:</td>
                <td><input style="width: 99.5%" id="txtXpos" type="text" value="0"/></td>
            </tr>
            <tr>
                <td>Y Position:</td>
                <td><input style="width: 99.5%" id="txtYpos" type="text" value="0"/></td>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td>Composite URL:</td>
                <td colspan="2"><label id="lblFixedURL">http://{getFullHost}/CompositeImage/?sourceimage=</label><label id="lblImageURL">./resources/images/tux.jpg&alpha=0.5&xpos=0&ypos=0</label></td>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td colspan="3"  style="border: 1px solid black; background: white; padding: 50px;">
                    <img id="imgImage" src="./resources/images/tux.jpg"/>
                </td>
            </tr>
        </tbody>
    </table>

    <script>
        function onUpdateClicked()
        {
            var lcImage = document.getElementById("txtImage").value;
            var lcBlend = document.getElementById("txtOverlayImage").value;
            var lnAlpha = parseFloat(document.getElementById("txtAlpha").value);
            var lnXpos = parseInt(document.getElementById("txtXpos").value);
            var lnYpos = parseInt(document.getElementById("txtYpos").value);
            
            var lcURL = document.getElementById("lblFixedURL").innerHTML;
            var lcURLEnding = lcImage;
            lcURLEnding += "&blendimage=" + lcBlend;
            lcURLEnding += "&alpha=" + lnAlpha;
            lcURLEnding += "&xOffset=" + lnXpos;
            lcURLEnding += "&yOffset=" + lnYpos;
            
            document.getElementById("lblImageURL").innerHTML = lcURLEnding;
            document.getElementById("imgImage").src = lcURL + lcURLEnding;


            document.getElementById("txtImage").value = lcImage;
            document.getElementById("txtAlpha").value = lnAlpha
            document.getElementById("txtXpos").value = lnXpos
            document.getElementById("txtYpos").value = lnYpos
            
        }
    </script>

</page>
