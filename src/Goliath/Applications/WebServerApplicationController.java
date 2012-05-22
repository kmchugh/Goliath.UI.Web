/* ========================================================
 * WebServerApplicationController.java
 *
 * Author:      kenmchugh
 * Created:     Jan 27, 2011, 5:23:58 PM
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

package Goliath.Applications;

import Goliath.Constants.EventType;
import Goliath.Interfaces.IDelegate;


        
/**
 * Class Description.
 * For example:
 * <pre>
 *      Example usage
 * </pre>
 *
 * @see         Related Class
 * @version     1.0 Jan 27, 2011
 * @author      kenmchugh
**/
public class WebServerApplicationController extends ApplicationController<EventType, WebServerApplicationController>
{
    /**
     * Creates a new instance of WebServerApplicationController
     */
    public WebServerApplicationController()
    {
    }

    @Override
    public boolean authenticate(String tcUserName, String tcPassword, IDelegate<WebServerApplicationController> toFailed, IDelegate<WebServerApplicationController> toSuccess)
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void requestAuthentication()
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean unauthenticate()
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }



    
}
