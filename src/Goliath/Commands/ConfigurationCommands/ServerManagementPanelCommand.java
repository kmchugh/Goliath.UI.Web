/* =========================================================
 * ServerManagementPanelCommand.java
 *
 * Author:      kenmchugh
 * Created:     Oct 29, 2010, 11:33:24 AM
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

package Goliath.Commands.ConfigurationCommands;

import Goliath.UI.PanelCommands.ConfigurationCommand;
import Goliath.UI.Views.ServerManagementCommandView;
import Goliath.UI.Views.View;

/**
 *
 * @author kenmchugh
 */
public class ServerManagementPanelCommand extends ConfigurationCommand
{
    /**
     * Creates a new instance of BrowsePanelCommand
     */
    public ServerManagementPanelCommand()
    {}

    @Override
    public String getCommandName()
    {
        return "Server Management";
    }

    @Override
    public String getCommandImageSource()
    {
        return "./resources/images/icons/serverconnection.png";
    }

    @Override
    public String getCommandTooltip()
    {
        return "Update, Delete, and Add new Server connections";
    }

    @Override
    public View createCommandView()
    {
        ServerManagementCommandView loView = new ServerManagementCommandView();
        loView.setImage(getCommandImage());

        return loView;
    }
}