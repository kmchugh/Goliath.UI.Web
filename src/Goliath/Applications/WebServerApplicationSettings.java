/* =========================================================
 * WebServerApplicationSettings.java
 *
 * Author:      kmchugh
 * Created:     26 November 2007, 15:34
 *
 * Description
 * --------------------------------------------------------
 * Controls the application paramters for a web based session.
 *
 * Change Log
 * --------------------------------------------------------
 * Init.Date        Ref.            Description
 * --------------------------------------------------------
 *
 * =======================================================*/

package Goliath.Applications;

import Goliath.ClientType;
import Goliath.Commands.OpenWebBrowserCommand;
import Goliath.Constants.LogType;
import Goliath.Delegate;
import Goliath.Event;
import Goliath.Interfaces.Applications.IApplicationController;
import Goliath.SingletonHandler;
import Goliath.UI.Controls.ControlImplementationType;
import Goliath.UI.Controls.MenuItem;
import Goliath.UI.UnknownBrowserClient;
import Goliath.UI.WebClientType;
import Goliath.UI.Windows.SplashWindow;
import java.net.InetSocketAddress;

/**
 * Controls the application behaviour for a web based application
 * If this class is used, the application will act as
 * it's own web server when started
 *
 * @version     1.0 26 November 2007
 * @author      kmchugh
 **/
public abstract class WebServerApplicationSettings extends Goliath.Applications.WebApplicationSettings
{
    private java.net.InetSocketAddress m_oHTTPSocket;
    private java.net.InetSocketAddress m_oSSLSocket;
    private String m_cServerHostName;
    private int m_nMaxConnections;
    private boolean m_lSSL;
    private String m_cKeyFile;
    private String m_cPasscode;
    private Goliath.Web.Server m_oWebServer;
    private boolean m_lStartSSL;
    private String m_cWebServiceContext;
    
    /** Creates a new instance of WebServerApplicationSettings */
    public WebServerApplicationSettings()
    {
    }

    /**
     * Creates the new application controller for this application
     * @return the application controller for the application
     */
    @Override
    protected IApplicationController onCreateApplicationController()
    {
        return SingletonHandler.getInstance(WebServerApplicationController.class);
    }

    /**
     * Gets the context for the web server
     * @return the web server context
     */
    public String getWebServiceContext()
    {
        if (m_cWebServiceContext == null)
        {
            m_cWebServiceContext = Application.getInstance().getPropertyHandlerProperty("WebServer.WebServices.DefaultURI", "/WS/");
        }
        return m_cWebServiceContext;
    }
    
    private void setHTTPServerSocket(java.net.InetSocketAddress toSocket)
    {
        if (m_oWebServer != null)
        {
            throw new Goliath.Exceptions.InvalidOperationException("Can not change socket when web server has already started");
        }
        m_oHTTPSocket = toSocket;
    }
    
    private void setSSLServerSocket(java.net.InetSocketAddress toSocket)
    {
        if (m_oWebServer != null)
        {
            throw new Goliath.Exceptions.InvalidOperationException("Can not change socket when web server has already started");
        }
        m_oSSLSocket = toSocket;
    }

    @Override
    public ClientType createUnknownClientType(String tcIdentifier)
    {
        WebClientType loType = new UnknownBrowserClient();
        loType.setIdentifier(tcIdentifier);

        // Log the fact that an unknown browser type was connected
        Application.getInstance().log("Unable to determine Client type using " + tcIdentifier, LogType.EVENT());

        return loType;
    }




    
    /**
     * Sets the maximum number of allowable concurrent connections to the server.
     * 0 means unlimitied
     * @param tnMaxConnections the number of connections to allow
     */
    public void setMaximumConnections(int tnMaxConnections)
    {
        if (m_oWebServer != null)
        {
            throw new Goliath.Exceptions.InvalidOperationException("Can not change maximum connections when web server has already started");
        }
        m_nMaxConnections = tnMaxConnections;
    }
    
    public void setSSL(boolean tlUseSSL)
    {
        m_lSSL = tlUseSSL;        
    }
    public boolean usesSSL()
    {
        return m_lSSL;
    }
    
    public void setKeyFileName(String tcKeyFileName)
    {
        m_cKeyFile = tcKeyFileName;
    }
    public void setPasscode(String tcPasscode)
    {
        m_cPasscode = tcPasscode;
    }
    
    protected void startWebServer()
    {
        m_oWebServer = new Goliath.Web.Server(m_cServerHostName, m_oHTTPSocket, m_oSSLSocket, m_nMaxConnections, m_cKeyFile, m_cPasscode);
    }
    
    protected void setStartSSL(boolean tlStartInSSL)
    {
        m_lStartSSL = tlStartInSSL;
    }
    protected boolean startSSL()
    {
        return m_lStartSSL;
    }

    @Override
    public void doSetup()
    {
        // Start the Web Server
        m_cServerHostName = Application.getInstance().getPropertyHandlerProperty("WebServer.Address", "localhost");
        this.setSSL(Application.getInstance().getPropertyHandlerProperty("WebServer.SSL", false));
        if (this.usesSSL())
        {
            this.setKeyFileName(Application.getInstance().getPropertyHandlerProperty("WebServer.KeyFile", "smkeys"));
            this.setPasscode(Application.getInstance().getPropertyHandlerProperty("WebServer.Passcode", "C0gn1t1veEdge1"));
            int lnSSLPort = Application.getInstance().getPropertyHandlerProperty("WebServer.SSLPort", 443);
            this.setSSLServerSocket(new InetSocketAddress(m_cServerHostName, lnSSLPort));
            this.setStartSSL(Application.getInstance().getPropertyHandlerProperty("WebServer.StartSSL", false));
        }
        int lnPort = Application.getInstance().getPropertyHandlerProperty("WebServer.Port", 8080);
        this.setHTTPServerSocket(new InetSocketAddress(m_cServerHostName, lnPort));
        this.setMaximumConnections(Application.getInstance().getPropertyHandlerProperty("WebServer.MaximumConnections", 500));

        this.startWebServer();
        
        super.doSetup();
    }

    @Override
    protected void showUserInterface()
    {
        // Start the default web browser if possible
        String lcURL = "http" + (this.startSSL() ? "s" : "") + "://" + (this.startSSL() ? m_oSSLSocket : m_oHTTPSocket).getHostName();
        if ((this.startSSL() && m_oSSLSocket.getPort() != 443) || (!this.startSSL() && m_oHTTPSocket.getPort() != 80))
        {
            lcURL+= ":" + Integer.toString((this.startSSL() ? m_oSSLSocket : m_oHTTPSocket).getPort());
        }
        this.setServerBaseURL(lcURL);
        lcURL+= Application.getInstance().getPropertyHandlerProperty("WebServer.StartURL", "/");

        boolean llShowBrowser = Application.getInstance().getPropertyHandlerProperty("WebServer.LaunchBrowserOnStartup", true);
        if (llShowBrowser)
        {
            OpenWebBrowserCommand loCommand = new OpenWebBrowserCommand(lcURL);
            loCommand.execute();
        }
        
        // Add the command to the menu
        this.addMenuItem(new MenuItem(ControlImplementationType.AWTSYSTEMTRAY(), "Launch Browser", Delegate.build(this, "onLaunchClicked")));
    }

    private void onLaunchClicked(Event<WebServerApplicationSettings> toEvent)
    {
        String lcURL = "http" + (this.startSSL() ? "s" : "") + "://" + (this.startSSL() ? m_oSSLSocket : m_oHTTPSocket).getHostName();
        if ((this.startSSL() && m_oSSLSocket.getPort() != 443) || (!this.startSSL() && m_oHTTPSocket.getPort() != 80))
        {
            lcURL+= ":" + Integer.toString((this.startSSL() ? m_oSSLSocket : m_oHTTPSocket).getPort());
        }

        lcURL+= Application.getInstance().getPropertyHandlerProperty("WebServer.StartURL", "/");
        Goliath.Web.Utilities.startWebBrowserOnApplicationStart(lcURL);
    }

    @Override
    protected void deleteSplash(Object toSplash)
    {
        ((SplashWindow)toSplash).close();
    }

    @Override
    protected void hideSplash(Object toSplash)
    {
        ((SplashWindow)toSplash).setVisible(false);
    }

    @Override
    protected void showSplash(Object toSplash)
    {
        //((SplashWindow)toSplash).setOpaque(false);
        ((SplashWindow)toSplash).setVisible(true);
    }
}
