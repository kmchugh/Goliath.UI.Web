package Goliath.UI.Web.Servlets;

import Goliath.Collections.List;
import Goliath.Constants.MimeType;
import Goliath.Exceptions.ServletException;
import Goliath.Interfaces.Servlets.IServletConfig;
import Goliath.Interfaces.Web.IHTTPRequest;
import Goliath.Interfaces.Web.IHTTPResponse;
import Goliath.Web.Constants.RequestMethod;
import Goliath.Web.Servlets.HTTPServlet;
import Goliath.Web.Servlets.MimeTypeManager.GSPMimeTypeManager;
import Goliath.Web.Servlets.MimeTypeManager.MimeTypeManager;
import java.io.File;
import java.io.IOException;
import org.w3c.dom.Document;

/**
 * Processes the XML body passed as if it were a .gsp
 * @author admin
 */
public class GSPProcessor extends HTTPServlet
{

    @Override
    protected void doPost(IHTTPRequest toRequest, IHTTPResponse toResponse, Document toXML) throws ServletException, IOException
    {
        List<MimeType> loType = new List<MimeType>(1);
        GSPMimeTypeManager loManager = (GSPMimeTypeManager)MimeTypeManager.getInstance().get(new File("test.gsp"), toRequest, toResponse, loType, false);
        
        loManager.process(toXML, toRequest, toResponse);
    }

    /**
     * This only supports post requests
     * @param toConfig
     * @throws ServletException 
     */
    @Override
    protected void onInit(IServletConfig toConfig) throws ServletException
    {
        this.clearSupportedMethods();
        this.addSupportedMethod(RequestMethod.POST());
    }
    
    
}
