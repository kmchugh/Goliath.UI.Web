/* ========================================================
 * CompositeImage.java
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
import Goliath.Graphics.Effects.CompositeEffect;
import Goliath.Graphics.Effects.CompositeEffectArguments;
import Goliath.Graphics.Image;
import Goliath.Graphics.Point;
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
public class CompositeImage extends HTTPServlet
{
    /**
     * Creates a new instance of Scale9Image
     */
    public CompositeImage()
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
     * Helper function to get the image file from the request
     * @param toRequest the request
     * @return the image file
     */
    private File getSourceImagePath(IHTTPRequest toRequest)
    {
        String lcImage = toRequest.getParameter("sourceimage");
        
        lcImage = getServletConfig().getServletContext().getRealPath(lcImage);

        File loReturn = new File(lcImage);
        if (!loReturn.exists())
        {
            loReturn = new File(getServletConfig().getServletContext().getRealPath(Application.getInstance().getPropertyHandlerProperty("WebServer.invalidImage", "./resources/images/imgPlaceholder.png")));
        }
        return loReturn;
    }
    
    /**
     * Helper function to get the image file from the request
     * @param toRequest the request
     * @return the image file
     */
    private File getBlendImagePath(IHTTPRequest toRequest)
    {
        String lcImage = toRequest.getParameter("blendImage");
        
        lcImage = getServletConfig().getServletContext().getRealPath(lcImage);

        File loReturn = new File(lcImage);
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
    private File getCachedFile(File toBaseImage, File toBlendImage, float tnAlpha, int tnXOffset, int tnYOffset)
    {
        String lcExtension = toBaseImage.getName().substring(toBaseImage.getName().lastIndexOf("."));
        String lcName = toBaseImage.getPath();

        // Check if the scaled size exists already
        String lcCachedFileName = Application.getInstance().getDirectory("tmp") + "compositeImages" + (lcName.startsWith(".") ? lcName.substring(1) : lcName);
        lcCachedFileName = lcCachedFileName.substring(0, lcCachedFileName.lastIndexOf(lcExtension))
                + "_" + toBlendImage.getName() 
                + "_a" + Float.toString(tnAlpha) 
                + "_x" + Integer.toString(tnXOffset) 
                + "_y" + Integer.toString(tnYOffset) 
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
        float lnAlpha = toRequest.getFloatProperty("alpha");
        int lnXOffset = toRequest.getIntProperty("xOffset");
        int lnYOffset = toRequest.getIntProperty("yOffset");
        File loSourceImage = getSourceImagePath(toRequest);
        File loBlendImage = getBlendImagePath(toRequest);

        // Check if the file exists
        if (loSourceImage.exists() && loBlendImage.exists())
        {
            String lcExtension = loSourceImage.getName().substring(loSourceImage.getName().lastIndexOf("."));
            File loCachedFile = getCachedFile(loSourceImage, loBlendImage, lnAlpha, lnXOffset, lnYOffset);

            if (!loCachedFile.exists() || ((loCachedFile.lastModified() < loSourceImage.lastModified()) && (loCachedFile.lastModified() < loBlendImage.lastModified())))
            {
                // Need to generate the image
                processImage(loSourceImage, loBlendImage, loCachedFile, lnAlpha, lnXOffset, lnYOffset);
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
            Application.getInstance().log("Image file not found " + (loSourceImage.exists() ? loBlendImage : loSourceImage).getAbsoluteFile(), LogType.ERROR());
            // Invalid file request
            toResponse.setResultCode(ResultCode.NOT_FOUND());
        }
    }

    /**
     * Processes the base image an blend image, and stores the result to the cache
     * @param toBaseImage the base image
     * @param toBlendImage the image to overlay on the base image
     * @param toCache the cache image, to store the result for faster processing on next request
     * @param toAlpha the alpha value to use for the blend
     * @param toXOffset the x offset position
     * @param toYOffset the y offset position
     */
    private void processImage(File toBaseImage, File toBlendImage, File toCache, float tnAlpha, int tnXOffset, int tnYOffset)
    {
        // Load the original, scale it, then save it as New
        try
        {
            Image loBaseImage = new Image(toBaseImage);
            Image loBlendImage = new Image(toBlendImage);
            

            CompositeEffectArguments loArgs = new CompositeEffectArguments(loBlendImage, tnAlpha, new Point(tnXOffset, tnYOffset));
            CompositeEffect loEffect = new CompositeEffect();
            loBaseImage.addEffect(loEffect, loArgs);

            Goliath.Graphics.Utilities.toFile(loBaseImage.getImage(), toCache);

            loBaseImage.flush();
        }
        catch(Throwable ex)
        {
            Application.getInstance().log(ex);
        }
    }

    @Override
    protected String getDefaultContext()
    {
        return "/CompositeImage/";
    }

}
