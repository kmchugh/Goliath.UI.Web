/* ========================================================
 * BrowserClientType.java
 *
 * Author:      kmchugh
 * Created:     Aug 25, 2010, 3:20:28 PM
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
public abstract class BrowserClientType extends WebClientType
{
    private String m_cReferrer;
    private String m_cCharSet;
    private String m_cUserAgent;
    private boolean m_lUsesCookie;
    
    /**
     * Creates a new instance of BrowserClientType
     */
    public BrowserClientType()
    {
    }

    @Override
    public final void populateFromObject(Object toProperties)
    {
        if (toProperties != null)
        {
            if (Goliath.DynamicCode.Java.isEqualOrAssignable(IHTTPRequest.class, toProperties.getClass()))
            {
                onPopulateFromRequest((IHTTPRequest)toProperties);
            }
        }
    }

    protected void onPopulateFromRequest(IHTTPRequest toRequest)
    {
        // Get the referrer
        m_cReferrer = toRequest.getReferrer();
        m_cCharSet = toRequest.getPreferredCharSet();
        m_cUserAgent = toRequest.getUserAgent();
        m_lUsesCookie = toRequest.isSessionCookieSet();


    }


}
