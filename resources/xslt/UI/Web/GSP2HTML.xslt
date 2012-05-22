<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- GSP2HTML provides all of the facilities for transforming GSP to html-->

    <xsl:template name="content">
        <xsl:element name="div">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">content <xsl:value-of select="@class"/></xsl:attribute>
            <xsl:apply-templates select="node()"/>
        </xsl:element>
    </xsl:template>

    <xsl:template name="pageHeader">
        <div class="header">
            <div id="imgLogo">
                <xsl:element name="a">
                    <xsl:attribute name="href">/</xsl:attribute>
                    <xsl:call-template name="applicationLogo"><xsl:with-param name="alt">home</xsl:with-param></xsl:call-template>
                </xsl:element>
            </div>
            <label class="title"><xsl:call-template name="pageTitle"/></label>

            <xsl:apply-templates/>

        </div>
    </xsl:template>

    <xsl:template name="pageFooter">
        <div class="footer">
            <div class="content">
                <xsl:call-template name="footerContent"/>
            </div>
            <div class="copyright">
                <xsl:call-template name="copyrightText"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template name="applicationLogo">
        <xsl:param name="alt"/>
            <img alt="{$alt}" height="80" src="/resources/images/spacer.gif" width="250"/>
    </xsl:template>

    <xsl:template name="pageIconURL">
        <xsl:choose>
            <xsl:when test="//page/icon"><xsl:value-of select="//page/icon"/></xsl:when>
            <xsl:otherwise>./resources/favicon.ico</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="pageTitle">
        <xsl:call-template name="titlePrefix"/> <xsl:value-of select="//page/title"/>
    </xsl:template>

    <xsl:template name="footerContent"/>

    <xsl:template name="titlePrefix"/>

    <xsl:template name="copyrightText">Copyright © 2011 ICatalyst Ltd. All Rights Reserved.</xsl:template>

    <xsl:template name="authorText">ICatalyst Ltd.</xsl:template>

    <xsl:template name="applicationMenu"/>

    <!-- Template for pushing styles into the head -->
    <xsl:template name="styles"/>

    <!-- Templates for the sign up and login menues -->
    <xsl:template match="authenticationMenu" mode="processAuthentication"/>
    <xsl:template match="authenticationMenu"/>

    <xsl:template match="//page[@authenticated]//authenticationMenu" mode="processAuthentication">
        <xsl:call-template name="authenticationMenu">
            <xsl:with-param name="authenticated" select="//page/@authenticated"/>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="authenticationMenu">
        <xsl:param name="authenticated"/>
        <xsl:variable name="body">
            <xsl:if test="$authenticated">
                <menu id="mnuAuthentication">
                <xsl:if test="$authenticated = 'false'">
                    <item url="/identity.gsp#register" title="Register as a new user">Sign up</item>|<item url="/identity.gsp#login" title="Sign in to your account">Log in</item>
                </xsl:if>
                <xsl:if test="$authenticated = 'true'">
                    <xsl:call-template name="userAuthenticatedMenuItem"/>|<item url="/identity.gsp?action=logout#logout" title="Sign out of your account">Sign out</item>
                </xsl:if>
                </menu>
            </xsl:if>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="userAuthenticatedMenuItem"><item url="#">Hello {{getDisplayName}}</item></xsl:template>

</xsl:stylesheet>