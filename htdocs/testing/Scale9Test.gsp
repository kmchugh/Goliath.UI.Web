<!-- ======================================================
 * Scale9Test.gsp
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
    <title>Scale9Test</title>

    <table width="100%"  style="font-size:12px;">
        <thead>
            <tr>
                <td>Image:</td>
                <td><input style="width: 99.5%" id="txtImage" type="text" value="./resources/images/scale9testimage.png"/></td>
                <td rowspan="7"><button id="cmdUpdate" onclick="onUpdateClicked()" style="text-align: center; width:99.5%; height: 200px">Update</button></td>
            </tr>
            <tr>
                <td>Width:</td>
                <td><input style="width: 99.5%" id="txtWidth" type="text" value="100"/></td>
            </tr>
            <tr>
                <td>Height:</td>
                <td><input style="width: 99.5%" id="txtHeight" type="text" value="100"/></td>
            </tr>
            <tr>
                <td>Grid Top:</td>
                <td><input style="width: 99.5%" id="txtTop" type="text" value="0"/></td>
            </tr>
            <tr>
                <td>Grid Right:</td>
                <td><input style="width: 99.5%" id="txtRight" type="text" value="0"/></td>
            </tr>
            <tr>
                <td>Grid Bottom:</td>
                <td><input style="width: 99.5%" id="txtBottom" type="text" value="0"/></td>
            </tr>
            <tr>
                <td>Grid Left:</td>
                <td><input style="width: 99.5%" id="txtLeft" type="text" value="0"/></td>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td>Scale 9 URL:</td>
                <td colspan="2"><label id="lblFixedURL">http://{getFullHost}/Scale9Image/?image=</label><label id="lblImageURL">./resources/images/scale9testimage.png&width=100&height=100&grid=0-0-0-0</label></td>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td colspan="3"  style="border: 1px solid black; background: white; padding: 50px;">
                    <img id="imgImage" src="./resources/images/scale9testimage.png"/>
                </td>
            </tr>
        </tbody>
    </table>
    
    <script>
        function onUpdateClicked()
        {
            var lcImage = document.getElementById("txtImage").value;
            var lnHeight = parseInt(document.getElementById("txtHeight").value);
            var lnWidth = parseInt(document.getElementById("txtWidth").value);
            var lnTop = parseInt(document.getElementById("txtTop").value);
            var lnRight = parseInt(document.getElementById("txtRight").value);
            var lnBottom = parseInt(document.getElementById("txtBottom").value);
            var lnLeft = parseInt(document.getElementById("txtLeft").value);
            
            var lcURL = document.getElementById("lblFixedURL").innerHTML;
            var lcURLEnding = lcImage;
            lcURLEnding += "&width=" + lnWidth;
            lcURLEnding += "&height=" + lnHeight;
            lcURLEnding += "&grid=" + lnTop;
            lcURLEnding += "-" + lnRight;
            lcURLEnding += "-" + lnBottom;
            lcURLEnding += "-" + lnLeft;
            
            document.getElementById("lblImageURL").innerHTML = lcURLEnding;
            document.getElementById("imgImage").src = lcURL + lcURLEnding;
            
            
            document.getElementById("txtImage").value = lcImage;
            document.getElementById("txtHeight").value = lnHeight
            document.getElementById("txtWidth").value = lnWidth
            document.getElementById("txtTop").value = lnTop
            document.getElementById("txtRight").value = lnRight
            document.getElementById("txtBottom").value = lnBottom
            document.getElementById("txtLeft").value = lnLeft;
        }
    </script>

</page>
