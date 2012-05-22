/* =========================================================
 * WebApplicationSettings.java
 *
 * Author:      kmchugh
 * Created:     26 November 2007, 15:33
 *
 * Description
 * --------------------------------------------------------
 * Controls the application behaviours for a regular web application
 *
 * Change Log
 * --------------------------------------------------------
 * Init.Date        Ref.            Description
 * --------------------------------------------------------
 *
 * =======================================================*/

package Goliath.Applications;

import Goliath.Commands.OpenWebBrowserCommand;
import Goliath.UI.Controls.ControlImplementationType;
import Goliath.UI.Controls.WebControlImplementationType;

/**
 * Controls the application behaviours for a regular web application
 *
 * @see         Related Class
 * @version     1.0 26 November 2007
 * @author      kmchugh
 **/
public abstract class WebApplicationSettings extends Goliath.Applications.UIApplicationSettings
{
    private String m_cServerBaseURL;

    protected void setServerBaseURL(String tcURL)
    {
        m_cServerBaseURL = tcURL;
    }

    @Override
    protected boolean allowWorkspaceSelect()
    {
        return false;
    }

    @Override
    public boolean useApplicationDataDirectory()
    {
        return false;
    }

    public String getServerBaseURL()
    {
        return Goliath.Utilities.isNull(m_cServerBaseURL, "");
    }
    
    @Override
    protected void showUserInterface()
    {
        // Start the default web browser if possible
        // TODO: The start URL should be defaulting to the root of the application
        String lcURL = Application.getInstance().getPropertyHandlerProperty("WebServer.StartURL", "http://www.google.co.uk/");
        OpenWebBrowserCommand loCommand = new OpenWebBrowserCommand(lcURL);
        loCommand.execute();
    }

    @Override
    public ControlImplementationType getDefaultImplementationType()
    {
        return WebControlImplementationType.HTML();
    }

    
}
