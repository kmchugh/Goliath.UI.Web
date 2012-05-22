/* ========================================================
 * UnknownBrowserClient.java
 *
 * Author:      kmchugh
 * Created:     Aug 25, 2010, 3:20:56 PM
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

package Goliath.UI;

import Goliath.Interfaces.Web.IHTTPRequest;


        
/**
 * Class Description.
 * For example:
 * <pre>
 *      Example usage
 * </pre>
 *
 * @see         Related Class
 * @version     1.0 Aug 25, 2010
 * @author      kmchugh
**/
public class UnknownBrowserClient extends BrowserClientType
{
    /**
     * Creates a new instance of UnknownBrowserClient
     */
    public UnknownBrowserClient()
    {
    }

    @Override
    public boolean isSupported(String tcIdentifier)
    {
        return false;
    }

}
