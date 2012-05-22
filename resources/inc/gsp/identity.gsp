<include>/resources/xslt/UI/Web/HTMLBase.xslt</include>
<link href="/resources/themes/panels.less" rel="stylesheet" type="text/css"/>
<link href="/resources/themes/tabControls.less" rel="stylesheet" type="text/css"/>
<link href="/resources/themes/forms.less" rel="stylesheet" type="text/css"/>
<link href="/resources/themes/identity.less" rel="stylesheet" type="text/css"/>

<servlet class="Goliath.Web.Security.Servlets.Identity"/>

<servlet class="Goliath.Web.Servlets.ErrorList"/>

<panel class="identityPanel" data-module="modules/david.identity">
    <title>Login & Register</title>
    <content>
        <tabControl>
            <tab id="login" class="isNotAuthenticated{{isAuthenticated}}">
                <title>Login</title>
                <content>
                    <form action="https://{{getSSLFullHost}}/identity.gsp#login">
                        <group>
                            <title>Login</title>
                            <field id="action" type="hidden" value="login"/>
                            <field id="txtUserName" type="text">User name/Email</field>
                            <field id="txtPassword" type="password">Password</field>

                            <a href="#forgotten" class="navLinks">Forgotten Password</a>
                            <a href="#register" class="navLinks">Register</a>

                            <group class="rememberMe">
                                <title>Options</title>
                                <field id="chkRememberMe" checked="{{chkRememberMe}}" type="checkbox">Remember Me</field>
                            </group>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Sign in</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                </content>
            </tab>

            <tab id="register" class="isNotAuthenticated{{isAuthenticated}}">
                <title>Register</title>
                <content>
                    <form class="nameBased" action="https://{{getSSLFullHost}}/identity.gsp#register">
                        <group>
                            <title>Register</title>
                            <field id="action" type="hidden" value="register"/>
                            <field id="txtUserName" type="text">Username</field>
                            <field id="txtPassword" type="password">Password</field>
                            <field id="txtConfirmPassword" type="password">Confirm Password</field>

                            <a href="#forgotten" class="navLinks">Forgotten Password</a>
                            <a href="#login" class="navLinks">Login</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Register</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                    <form class="emailBased" action="https://{{getSSLFullHost}}/identity.gsp#login">
                        <group>
                            <title>Register</title>
                            <field id="action" type="hidden" value="registerEmail"/>
                            <field id="txtEmail" type="text">Email</field>
                            <field id="txtVerifyEmail" type="text">Confirm Email</field>

                            <a href="#forgotten" class="navLinks">Forgotten Password</a>
                            <a href="#login" class="navLinks">Login</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value=".#login"/>

                        <button type="submit">Register</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                </content>
            </tab>

            <tab id="forgotten" class="isNotAuthenticated{{isAuthenticated}}">
                <title>Forgotten Password</title>
                <content>
                    <form class="nameBased" action="https://{{getSSLFullHost}}/identity.gsp#login">
                        <group>
                            <title>Retrieve Password</title>
                            <field id="action" type="hidden" value="retrievePassword"/>
                            <field id="txtUserName" type="text" >User name / Email</field>
                            <field id="txtQuestion" type="select" selected="txtQuestion">Security Question</field>
                            <field id="txtAnswer" type="text">Security Answer</field>

                            <a href="#register" class="navLinks">Register</a>
                            <a href="#login" class="navLinks">Login</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value=".#login"/>

                        <button type="submit">Retrieve</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>

                    <form class="emailBased" action="https://{{getSSLFullHost}}/identity.gsp#login">
                        <group>
                            <title>Retrieve Password</title>
                            <field id="action" type="hidden" value="retrievePasswordEmail"/>
                            <field id="txtUserName" type="text" >User name / Email</field>

                            <a href="#register" class="navLinks">Register</a>
                            <a href="#login" class="navLinks">Login</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value=".#login"/>

                        <button type="submit">Retrieve</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>

                </content>
            </tab>

            <tab id="changePassword" class="isAuthenticated{{isAuthenticated}}">
                <title>Change Password</title>
                <content>
                    <form class="nameBased" action="https://{{getSSLFullHost}}/identity.gsp#changePassword">
                        <group>
                            <title>Change Password</title>
                            <field id="action" type="hidden" value="changePassword"/>
                            <field id="txtPassword" type="password">Password</field>
                            <field id="txtNewPassword" type="password">New Password</field>
                            <field id="txtConfirmPassword" type="password">Confirm Password</field>

                            <a href="#invite" class="navLinks">Invite</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Change</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                    
                    <form class="emailBased" action="https://{{getSSLFullHost}}/identity.gsp#changePassword">
                        <group>
                            <title>Change Password</title>
                            <field id="action" type="hidden" value="changePasswordEmail"/>
                            <field id="txtPassword" type="password">Password</field>
                            <field id="txtNewPassword" type="password">New Password</field>
                            <field id="txtConfirmPassword" type="password">Confirm Password</field>

                            <a href="#invite" class="navLinks">Invite</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Change</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                </content>
            </tab>

            <tab id="invite" class="isAuthenticated{{isAuthenticated}}">
                <title>Invite</title>
                <content>
                    <form class="nameBased" action="https://{{getSSLFullHost}}/identity.gsp#invite">
                        <group>
                            <title>Invite a friend</title>
                            <field id="action" type="hidden" value="invite"/>
                            <field id="txtFirstName" type="text">First Name</field>
                            <field id="txtLastName" type="text">Last Name</field>
                            <field id="txtEmail" type="text">Email</field>
                            <field id="txtVerifyEmail" class="emailBased" type="text">Confirm Email</field>

                            <a href="#changePassword" class="navLinks">Change Password</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Invite</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                    <form class="emailBased" action="https://{{getSSLFullHost}}/identity.gsp#invite">
                        <group>
                            <title>Invite a friend</title>
                            <field id="action" type="hidden" value="inviteEmail"/>
                            <field id="txtFirstName" type="text">First Name</field>
                            <field id="txtLastName" type="text">Last Name</field>
                            <field id="txtEmail" type="text">Email</field>
                            <field id="txtVerifyEmail" class="emailBased" type="text">Confirm Email</field>

                            <a href="#changePassword" class="navLinks">Change Password</a>
                        </group>
                        
                        <field type="hidden" id="forwardToURL" value="/"/>

                        <button type="submit">Invite</button>
                        <button type="cancel" href="/">Cancel</button>
                    </form>
                </content>
            </tab>
        </tabControl>
        {{errorList}}
    </content>
</panel>