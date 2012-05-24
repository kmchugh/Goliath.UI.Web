/* ========================================================
 * WebControlImplementationType.java
 *
 * Author:      kmchugh
 * Created:     Aug 18, 2010, 1:06:31 PM
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

package Goliath.UI.Controls;


        
/**
 * Class Description.
 * For example:
 * <pre>
 *      Example usage
 * </pre>
 *
 * @see         Related Class
 * @version     1.0 Aug 18, 2010
 * @author      kmchugh
**/
public class WebControlImplementationType extends ControlImplementationType
{
    /**
     * Creates a new instance of an EventTypes Object
     *
     * @param tcValue The value for the event type
     * @throws Goliath.Exceptions.InvalidParameterException
     */
    protected WebControlImplementationType(String tcValue)
        throws Goliath.Exceptions.InvalidParameterException
    {
        super(tcValue);
    }

    private static WebControlImplementationType g_oHTML;
    public static WebControlImplementationType HTML()
    {
        if (g_oHTML == null)
        {
            try
            {
                g_oHTML = new WebControlImplementationType("HTML");
            }
            catch (Goliath.Exceptions.InvalidParameterException ex)
            {}
        }
        return g_oHTML;
    }
}
