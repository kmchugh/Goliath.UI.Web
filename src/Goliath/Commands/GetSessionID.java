/* =========================================================
 * getSessionID.java
 *
 * Author:      kmchugh
 * Created:     10-Apr-2008, 00:01:47
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
 * @version     1.0 10-Apr-2008
 * @author      kmchugh
**/
public class GetSessionID extends UICommand
{
    /** Creates a new instance of ExecuteCommand */
    public GetSessionID()
    {
    }

    @Override
    protected void onDoExecute()
    {
        appendResponseXML(this.getSession().getSessionID());
    }
}
