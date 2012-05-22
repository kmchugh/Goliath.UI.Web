/* ========================================================
 * Scale9Image.java
 *
 * Author:      kenmchugh
 * Created:     Mar 14, 2011, 1:59:22 PM
 *
 * Description
 * --------------------------------------------------------
 * General Class Description.
 *
 * Change Log
 * --------------------------------------------------------
 * Init.Date        Ref.            Description
 * --------------------------------------------------------
 *
 * ===================================================== */

package Goliath.UI.Web.Servlets;

import Goliath.Applications.Application;
import Goliath.Constants.LogType;
import Goliath.Constants.MimeType;
import Goliath.Exceptions.ServletException;
import Goliath.Graphics.Dimension;
import Goliath.Graphics.Image;
import Goliath.Interfaces.Servlets.IServletConfig;
import Goliath.Interfaces.Web.IHTMLOutputStream;
import Goliath.Interfaces.Web.IHTTPRequest;
import Goliath.Interfaces.Web.IHTTPResponse;
import Goliath.Web.Constants.RequestMethod;
import Goliath.Web.Constants.ResultCode;
import Goliath.Web.Servlets.HTTPServlet;
import java.io.File;
import java.io.IOException;


        
/**
 * Class Description.
 * For example:
 * <pre>
 *      http://localhost:8080/Scale9Image/resources/themes/default/images/Windows/dialog_box.png?width=200&height=600&grid=10-10-10-10
 *
 *      http://localhost:8080/Scale9Image/?image=/resources/themes/default/images/Windows/dialog_box.png?width=200&height=600&grid=10-10-10-10
 * </pre>
 *
 * @see         Related Class
 * @version     1.0 Mar 14, 2011
 * @author      kenmchugh
**/
public class Scale9Image extends HTTPServlet
{
    /**
     * Creates a new instance of Scale9Image
     */
    public Scale9Image()
    {
    }

    @Override
    public void onInit(IServletConfig toConfig) throws ServletException
    {
        // This only supports the get method
        clearSupportedMethods();
        addSupportedMethod(RequestMethod.GET());

        super.onInit(toConfig);
    }





    /**
     * Helper function to extract the grid from the request
     * @param toRequest the request
     * @return the grid
     */
    private float[] getGrid(IHTTPRequest toRequest)
    {
        String lcGrid = toRequest.getParameter("grid");
        float[] laGrid = new float[4];

        // Get the scale 9 grid, or use default values if not set
        if (Goliath.Utilities.isNullOrEmpty(lcGrid))
        {
            lcGrid = "0";
        }

        String[] laGridParam = lcGrid.split("-");
        for (int i=0; i<=3; i++)
        {
            if (laGridParam.length > i)
            {
                laGrid[i] = Integer.parseInt(laGridParam[i]);
            }
            else
            {
                laGrid[i] = Integer.parseInt(laGridParam[laGridParam.length-1]);
            }
        }
        return laGrid;
    }

    /**
     * Helper function to extract the new dimensions of the image from the request
     * @param toRequest the request
     * @return the new dimensions
     */
    private Dimension getDimension(IHTTPRequest toRequest)
    {
        String lcWidth = toRequest.getParameter("width");
        String lcHeight = toRequest.getParameter("height");

        float lnWidth = 0;
        float lnHeight = 0;

        if (Goliath.Utilities.isNullOrEmpty(lcWidth))
        {
            lcWidth = "0";
        }

        if (Goliath.Utilities.isNullOrEmpty(lcHeight))
        {
            lcHeight = "0";
        }

        lnWidth = Float.parseFloat(lcWidth);
        lnHeight = Float.parseFloat(lcHeight);

        return new Dimension(lnWidth, lnHeight);
    }

    /**
     * Helper function to get the image file from the request
     * @param toRequest the request
     * @return the image file
     */
    private File getImagePath(IHTTPRequest toRequest)
    {
        // Get the image name
        String lcImageName = toRequest.getFile();
        if (Goliath.Utilities.isNullOrEmpty(lcImageName))
        {
            lcImageName = toRequest.getParameter("image");
        }
        else
        {
            lcImageName = toRequest.getPath().replace(getDefaultContext(), "./") + lcImageName;
        }

        if (Goliath.Utilities.isNullOrEmpty(lcImageName))
        {
            lcImageName = Application.getInstance().getPropertyHandlerProperty("WebServer.invalidImage", "./resources/images/imgPlaceholder.png");
        }

        lcImageName = getServletConfig().getServletContext().getRealPath(lcImageName);

        File loReturn = new File(lcImageName);
        if (!loReturn.exists())
        {
            loReturn = new File(getServletConfig().getServletContext().getRealPath(Application.getInstance().getPropertyHandlerProperty("WebServer.invalidImage", "./resources/images/imgPlaceholder.png")));
        }
        return loReturn;
    }

    /**
     * Helper function to get the cache file based on the image file, dimensions and grid
     * @param toImage the image file
     * @param taGrid the grid
     * @param toDimension the dimension
     * @return the file to use as the cached file
     */
    private File getCachedFile(File toImage, float[] taGrid, Dimension toDimension)
    {
        String lcExtension = toImage.getName().substring(toImage.getName().lastIndexOf("."));
        String lcName = toImage.getPath();

        // Check if the scaled size exists already
        String lcCachedFileName = Application.getInstance().getDirectory("tmp") + "scale9Images" + (lcName.startsWith(".") ? lcName.substring(1) : lcName);
        lcCachedFileName = lcCachedFileName.substring(0, lcCachedFileName.lastIndexOf(lcExtension))
                + "_" + Float.toString(toDimension.getWidth())
                + "x" + Float.toString(toDimension.getHeight())
                + "_" + Float.toString(taGrid[0])
                + "-" + Float.toString(taGrid[1])
                + "-" + Float.toString(taGrid[2])
                + "-" + Float.toString(taGrid[3])
                + lcExtension;

        return new File(lcCachedFileName);
    }

    /**
     * Retrieves the image scaled to the size requested, using the grid specified
     * @param toRequest the request
     * @param toResponse the response to write to
     * @throws ServletException if there are any issues with the operation
     * @throws IOException if there are any IO issues
     */
    @Override
    protected void doGet(IHTTPRequest toRequest, IHTTPResponse toResponse) throws ServletException, IOException
    {
        float[] laGrid = getGrid(toRequest);
        Dimension loDimension = getDimension(toRequest);
        File loImage = getImagePath(toRequest);

        // Check if the file exists
        if (loImage.exists())
        {
            String lcExtension = loImage.getName().substring(loImage.getName().lastIndexOf("."));
            File loCachedFile = getCachedFile(loImage, laGrid, loDimension);

            if (!loCachedFile.exists() || (loCachedFile.lastModified() < loImage.lastModified()))
            {
                // Need to generate the image
                processImage(loImage, loCachedFile, loDimension, laGrid);
            }
            toResponse.setContentType(MimeType.getEnumeration(MimeType.class, "image/" + (lcExtension.equalsIgnoreCase(".jpg") ? "jpeg" : lcExtension.replace(".", ""))));

            if (loCachedFile.exists())
            {
                toResponse.setUseCompression(false);
                toResponse.setGZipEncoded(false);
                toResponse.setResultLength(loCachedFile.length());
                toResponse.sendResponseHeaders();

                try
                {
                    java.io.FileInputStream loStream = new java.io.FileInputStream(loCachedFile);
                    IHTMLOutputStream loOutputStream = toResponse.getStream();
                    int lnLength;
                    // TODO: Look for ways to increase the write block size (check what size can be written)
                    byte[] laBuffer = new byte[1024];
                    while ((lnLength = loStream.read(laBuffer)) > 0)
                    {
                        loOutputStream.write(laBuffer, 0, lnLength);
                    }
                    loStream.close();
                }
                catch (Throwable ex)
                {
                    Application.getInstance().log(ex);
                }
            }
            else
            {
                toResponse.setResultCode(ResultCode.INTERNAL_SERVER_ERROR());
            }
        }
        else
        {
            Application.getInstance().log("Image file not found " + loImage.getAbsoluteFile(), LogType.ERROR());
            // Invalid file request
            toResponse.setResultCode(ResultCode.NOT_FOUND());
        }
    }

    /**
     * Helper function to actually transform the image
     * @param toOriginal the original file
     * @param toNew the cache file
     * @param toSize the new size of the image
     * @param taGrid the scale9 grid to use for the scaling
     */
    private void processImage(File toOriginal, File toNew, Dimension toSize, float[] taGrid)
    {
        // .ico is not supported
        if (!toOriginal.getName().matches("(?i).+\\.ico$"))
        {
            // Load the original, scale it, then save it as New
            try
            {
                Image loImage = new Image(toOriginal);
                loImage.setScaleable(true);
                loImage.setSize(toSize);
                loImage.setScale9Grid((int)taGrid[0], (int)taGrid[1], (int)taGrid[2], (int)taGrid[3]);

                Goliath.Graphics.Utilities.toFile(loImage.getImage(), toNew);

                loImage.flush();
            }
            catch(Throwable ex)
            {
                Application.getInstance().log(ex);
            }
        }
    }

    @Override
    protected String getDefaultContext()
    {
        return "/Scale9Image/";
    }




}
