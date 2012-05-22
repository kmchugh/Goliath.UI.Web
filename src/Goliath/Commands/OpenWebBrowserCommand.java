/* =========================================================
 * OpenWebBrowserCommand.java
 *
 * Author:      kmchugh
 * Created:     06-Jul-2008, 12:43:23
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
 * =======================================================*/

package Goliath.Commands;

/**
 * Class Description.
 * For example:
 * <pre>
 *      Example usage
 * </pre>
 *
 * @see         Related Class
 * @version     1.0 06-Jul-2008
 * @author      kmchugh
**/
public class OpenWebBrowserCommand extends UICommand
{
    String m_cURL = null;
    
    /** Creates a new instance of ExecuteCommand */
    public OpenWebBrowserCommand(String tcURL)
    {
        m_cURL = tcURL;
    }

    @Override
    protected void onDoExecute()
    {

        Goliath.Web.Utilities.startWebBrowserOnApplicationStart(m_cURL);
    }
}
