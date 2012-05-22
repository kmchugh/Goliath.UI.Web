/* ========================================================
 * SafariClient.java
 *
 * Author:      kmchugh
 * Created:     Aug 25, 2010, 4:52:56 PM
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
public class SafariClient extends BrowserClientType
{
    /**
     * Creates a new instance of SafariClient
     */
    public SafariClient()
    {
    }

    @Override
    public boolean isSupported(String tcIdentifier)
    {
        return tcIdentifier.toLowerCase().contains("safari") && !tcIdentifier.toLowerCase().contains("chrome");
    }
}
