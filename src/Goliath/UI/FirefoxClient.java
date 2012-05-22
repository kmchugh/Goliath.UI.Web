/* ========================================================
 * FirefoxClient.java
 *
 * Author:      kmchugh
 * Created:     Aug 25, 2010, 4:49:11 PM
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
public class FirefoxClient extends BrowserClientType
{
    /**
     * Creates a new instance of FirefoxClient
     */
    public FirefoxClient()
    {
    }

    @Override
    public boolean isSupported(String tcIdentifier)
    {
        return tcIdentifier.toLowerCase().contains("firefox");
    }
}
