/* =========================================================
 * ServerManagementCommanView.java
 *
 * Author:      kenmchugh
 * Created:     Oct 29, 2010, 11:32:47 AM
 *
 * Description
 * --------------------------------------------------------
 * <Description>
 *
 * Change Log
 * --------------------------------------------------------
 * Init.Date        Ref.            Description
 * --------------------------------------------------------
 *
 * =======================================================*/

package Goliath.UI.Views;

import Goliath.Applications.Application;
import Goliath.Collections.List;
import Goliath.Interfaces.Collections.IList;
import Goliath.UI.Controls.PasswordBox;
import Goliath.UI.Controls.UserControls.DynamicEditors.ObjectEditor;
import Goliath.Web.ServerConnection;

/**
 *
 * @author kenmchugh
 */
public class ServerManagementCommandView extends DynamicDataObjectEditView<ServerConnection>
{
    public ServerManagementCommandView()
    {
        super(ServerConnection.class);
        initialiseComponent();
    }

    @Override
    protected void configureView()
    {
        setPropertyName("serverurl", "Server URL");
        setPropertyName("guid", "Unique ID");
        setPropertyName("serverid", "Server Identity");
        setPropertyName("username", "User Name");
        setPropertyName("rememberme", "Remember Me");
        setPropertyName("name", "Name");
        setPropertyName("description", "Description");
        setPropertyName("password", "Password");
        setPropertyName("webservicecontext", "Web Service Context");
    }

    private void initialiseComponent()
    {
        setTitle("Server Connection Management");        
    }

    @Override
    protected ServerConnection onCreateNewObject()
    {
        try
        {
            return new ServerConnection();
        }
        catch(Throwable toException)
        {
            Application.getInstance().log(toException);
            return null;
        }
    }

    @Override
    protected List<String> getObjectProperties()
    {
        IList<String> loList = super.getObjectProperties();
        List<String> loReturn = new List<String>();
        loReturn.add("name");
        loReturn.add("description");
        loReturn.add("serverurl");
        loReturn.add("username");
        loReturn.add("password");
        loReturn.add("rememberme");

        for (String lcString : loList)
        {
            if (!loReturn.contains(lcString))
            {
                loReturn.add(lcString);
            }
        }

        return loReturn;
    }



    @Override
    protected void configureObjectEditor(ObjectEditor toEditor)
    {
        toEditor.setColumns(2);
        toEditor.setReadonlyProperty("ServerID");
        toEditor.setReadonlyProperty("GUID");

        toEditor.setPropertyEditor("Password", PasswordBox.class);
    }
    
}
