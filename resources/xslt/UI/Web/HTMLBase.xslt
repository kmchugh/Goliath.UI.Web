<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" version="1.0" encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

    <xsl:strip-space elements="*"/>

    <!-- HTMLBase provides all of the facilities for resetting CSS and doing
    what can be done to ensure clean an smooth cross browser compatibility
    All of the transformations for base control types to HTML are also contained in this
    transform.
    -->

    <xsl:import href="./GSP2HTML.xslt"/>

    <!-- Get started with the root transform -->
    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="rss">
        <link rel="alternate" type="application/rss+xml" title="RSS" href="{@href}" />
    </xsl:template>

    <xsl:template match="atom">
        <link rel="alternate" type="application/atom+xml" title="Atom" href="{@href}" />
    </xsl:template>

    <xsl:template match="pingback">
        <link rel="pingback" href="{@href}" />
    </xsl:template>

    <!-- used for processing xls variables.  -->
    <xsl:template name="processNode">
        <xsl:param name="body"/>
        <xsl:apply-templates select="exslt:node-set($body)/*"/>
    </xsl:template>

    <!-- Default page header match -->
    <xsl:template match="pageHeader">
        <xsl:call-template name="pageHeader"/>
    </xsl:template>

    <!-- Process any authentication menu match -->
    <xsl:template match="authenticationMenu">
        <xsl:call-template name="authenticationMenu">
            <xsl:with-param name="authenticated" select="//page/@authenticated"/>
        </xsl:call-template>
    </xsl:template>

    <!-- Proccess content tags -->
    <xsl:template match="content">
        <xsl:call-template name="content"/>
    </xsl:template>

    <!-- Copy all nodes and attributes (Identity transform),
    This ensures any unmatched tags are still copied-->
    <xsl:template match="@*|node()">
      <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
    </xsl:template>

    <xsl:template match="comment()"/>

    <xsl:template match="page/@index"/>
    <xsl:template match="page/@index" mode="processMetaTags"/>
    <xsl:template match="page/@index[.='false']" mode="processMetaTags">
        <meta name="robots" content="noindex" />
    </xsl:template>

    <xsl:template match="page/@excludeDavid"/>
    <xsl:template match="page" mode="processDavid">
        <script charset="utf-8" src="/resources/inc/javascript/david.bootstrap.js" type="text/javascript">_</script>
    </xsl:template>
    <xsl:template match="page[@excludeDavid='true']" mode="processDavid"/>

    <xsl:template match="page/@requireJS"/>
    <xsl:template match="page[@requireJS='true']" mode="processJS">
        <noscript>
            <div class="error">
                <div class="title">Browser feature incompatibility error</div>
                <img class="image" src="/resources/images/icons/error.png"/>
                <div class="message">For full functionality of this site it is necessary to enable JavaScript.
                        Here are the <a href="http://www.enable-javascript.com/" target="_blank">
                        instructions how to enable JavaScript in your web browser</a>.
                </div>
            </div>
        </noscript>
    </xsl:template>
    <xsl:template match="page" mode="processJS"/>


    <xsl:template match="@manifest"/>
    <xsl:template match="@manifest" mode="processManifest"> manifest="<xsl:value-of select="."/>"</xsl:template>
    <xsl:template match="@manifest" mode="processHTMLManifest"><xsl:attribute name="manifest"><xsl:value-of select="."/></xsl:attribute></xsl:template>



    <!-- Matches to the page tag, this adds the required items for a HTML page -->
    <xsl:template match="page">
        <!--<xsl:call-template name="createHTMLCC"/>-->
        <xsl:comment><![CDATA[[if lt IE 7]> <html class="no-js ie6"]]><xsl:apply-templates select="@manifest" mode="processManifest"/><![CDATA[> <![endif]]]></xsl:comment>
        <xsl:comment><![CDATA[[if IE 7]> <html class="no-js ie7"]]><xsl:apply-templates select="@manifest" mode="processManifest"/><![CDATA[> <![endif]]]></xsl:comment>
        <xsl:comment><![CDATA[[if IE 8]> <html class="no-js ie8"]]><xsl:apply-templates select="@manifest" mode="processManifest"/><![CDATA[> <![endif]]]></xsl:comment>
        <xsl:comment><![CDATA[[if gt IE 8]><!]]></xsl:comment>

        <xsl:element name="html">

            <xsl:attribute name="class">no-js</xsl:attribute>
            <!-- Handle the HTML5 manifest attribute -->
            <xsl:apply-templates select="@manifest" mode="processHTMLManifest"/>

            <xsl:comment><![CDATA[<![endif]]]></xsl:comment>

            <head>
                <xsl:call-template name="head"/>
            </head>
            <xsl:element name="body">
                <xsl:apply-templates select="@*"/>

                <div class="container">
                    <xsl:apply-templates select="*"/>
                </div>


                <xsl:call-template name="htmlFooter"/>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <!-- The following matches ensure the stylesheets, included and inline,
    will be placed in the HEAD of the page, as recommended by Steve Souders in
              the book High Performance Websites-->
    <xsl:template match="style"/>
    <xsl:template match="style" mode="processStylesheets">
        <xsl:copy>
          <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="link[@rel='stylesheet']"/>
    <xsl:template match="link[@rel='stylesheet']" mode="processStylesheets">
        <xsl:copy>
          <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="*" mode="processStylesheets">
        <xsl:apply-templates/>
    </xsl:template>

    <!-- Processes all of the meta tags defined so they will be included in the HEAD -->
    <xsl:template match="*" mode="processMetaTags">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="meta"/>
    <xsl:template match="meta" mode="processMetaTags">
        <xsl:copy>
          <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="menu">
        <xsl:element name="div">
            <xsl:attribute name="class">menu <xsl:value-of select="@class"/></xsl:attribute>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="item">
        <xsl:element name="div">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">menuItem <xsl:value-of select="@class"/></xsl:attribute>
            <a href="{@url}" title="{@title}"><xsl:apply-templates select="node()"/></a>
        </xsl:element>
    </xsl:template>

    <!-- Once the title is used there is no need to keep it around -->
    <xsl:template match="page/title"/>


    <!-- Create the HEAD of the HTML page -->
    <xsl:template name="head">
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta http-equiv="imagetoolbar" content="false" />
        <xsl:element name="meta">
            <xsl:attribute name="name">author</xsl:attribute>
            <xsl:attribute name="content"><xsl:call-template name="authorText"/></xsl:attribute>
        </xsl:element>

        <title>
            <xsl:call-template name="pageTitle"/>
        </title>

        <!-- Check if we are stopping indexing by robots -->
        <xsl:apply-templates select="//page/@index" mode="processMetaTags"/>

        <!-- allow for custom meta tags -->
        <xsl:apply-templates select="//meta" mode="processMetaTags"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        <xsl:call-template name="pageIcon"/>

        <script>document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'js');</script>

        <!-- Always inline include our reset style -->
        <style>
            <include>/resources/themes/normalize.css</include>
        </style>
        <xsl:call-template name="styles"/>

        <xsl:element name="link">
            <xsl:attribute name="rel">sitemap</xsl:attribute>
            <xsl:attribute name="type">application/xml</xsl:attribute>
            <xsl:attribute name="title">Sitemap</xsl:attribute>
            <xsl:attribute name="href"><xsl:call-template name="sitemapLink"/></xsl:attribute>
        </xsl:element>

        <!-- include any styles that have been added in the gsp document as links-->
        <xsl:apply-templates select="//link | //style" mode="processStylesheets"/>
    </xsl:template>

    <!-- Processes all of the script tags and pushes them to the bottom
    of the document -->
    <xsl:template match="*" mode="processScripts">
        <xsl:apply-templates/>
    </xsl:template>
    <xsl:template match="script"/>
    <xsl:template match="script" mode="processScripts">
        <xsl:copy>
          <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>



    <!-- Writes out the HTML footer, including all scripts and the NOSCRIPT area.
    Scripts are pushed to the bottom of the page as per Steve Souders in
              the book High Performance Websites-->
    <xsl:template name="htmlFooter">
      <xsl:comment><![CDATA[[if lt IE 7 ]>
        <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
        <script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
      <![endif]]]></xsl:comment>

        <!-- Add in david if needed -->
        <xsl:apply-templates select="//page" mode="processDavid"/>

        <!-- Scripts from GSP -->
        <xsl:apply-templates select="//script" mode="processScripts"/>

        <!-- Add NOSCRIPT if needed -->
        <xsl:apply-templates select="//page" mode="processJS"/>
    </xsl:template>

    <!-- Renders the favourite icon for the page -->
    <xsl:template name="pageIcon">
        <xsl:element name="link">
            <xsl:attribute name="type">image/x-icon</xsl:attribute>
            <xsl:attribute name="rel">icon</xsl:attribute>
            <xsl:attribute name="href"><xsl:call-template name="pageIconURL"/></xsl:attribute>
        </xsl:element>
        <xsl:element name="link">
            <xsl:attribute name="type">image/x-icon</xsl:attribute>
            <xsl:attribute name="rel">shortcut icon</xsl:attribute>
            <xsl:attribute name="href"><xsl:call-template name="pageIconURL"/></xsl:attribute>
        </xsl:element>
    </xsl:template>

    <xsl:template name="sitemapLink">/sitemap.xml</xsl:template>

    <!-- Template to make standard tags compliant -->

    <!-- PANEL -->
    <xsl:template match="panel">
        <xsl:variable name="body">
            <xsl:element name="div">
                <xsl:apply-templates select="@*"/>
                <xsl:attribute name="class">panel <xsl:value-of select="@class"/></xsl:attribute>
                <xsl:apply-templates select="node()"/>
            </xsl:element>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>
    <xsl:template match="panel/title">
        <h1 class="title"><xsl:apply-templates/></h1>
    </xsl:template>
    <xsl:template match="panel/content">
        <div class="content"><xsl:apply-templates/></div>
    </xsl:template>
    <!-- END PANEL -->

    <!-- BLOCK for Grid -->
    <xsl:template match="block">
        <xsl:variable name="body">
            <xsl:element name="div">
                <xsl:apply-templates select="@*"/>
                <xsl:attribute name="class">row <xsl:value-of select="@class"/></xsl:attribute>
                <xsl:apply-templates select="node()"/>
                <div class="end"/>
            </xsl:element>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>
    <!-- END BLOCK -->


    <!-- GROUP -->
    <xsl:template match="group">
        <xsl:variable name="body">
            <xsl:element name="div">
                <xsl:apply-templates select="@*"/>
                <xsl:attribute name="class">group <xsl:value-of select="@class"/></xsl:attribute>
                <xsl:apply-templates select="node()"/>
            </xsl:element>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>
    <!-- END GROUP -->

    <!-- TAB CONTROL -->
    <xsl:template match="tabControl">
        <xsl:variable name="body">
            <xsl:element name="div">
                <xsl:attribute name="data-module">ui/david.tabControl</xsl:attribute>
                <xsl:attribute name="class">tabControl <xsl:value-of select="@class"/></xsl:attribute>
                <xsl:apply-templates select="@*"/>

                <ul class="tabList"><xsl:apply-templates mode="tabList"/></ul>
                <div class="tabs"><xsl:apply-templates select="tab"/></div>
            </xsl:element>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>
    <!-- This is required to be on a single line due to issues with li, inline-block, and whitespace rendering -->
    <xsl:template match="tabControl/tab" mode="tabList"><li><xsl:apply-templates select="@*"/><a title="{title}" href="#{@id}"><xsl:value-of select="title"/></a></li></xsl:template>
    <xsl:template match="tabControl/tab/@id"/>
    <xsl:template match="tabControl/tab">
        <div id="{@id}">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">tabPanel <xsl:value-of select="@class"/></xsl:attribute>
            <xsl:apply-templates select="content"/>
        </div>
    </xsl:template>
    <xsl:template match="tabControl/tab/content">
        <xsl:apply-templates/>
    </xsl:template>
    <!-- END TAB CONTROL -->

    <!-- BUTTON CONTROL -->
    <xsl:template match="button[not(@type)]">
        <xsl:element name="a">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">button <xsl:value-of select="@class"/></xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    <!-- END BUTTON CONTROL -->

    <!-- FORM CONTROL -->
    <xsl:template match="form[not(@processed)]">
        <xsl:variable name="body">
            <xsl:element name="htmlForm">
                <xsl:attribute name="name"><xsl:value-of select="@id"/></xsl:attribute>
                <xsl:apply-templates select="@*|node()"/>
            </xsl:element>
        </xsl:variable>
        <xsl:call-template name="processNode">
            <xsl:with-param name="body" select="$body"/>
        </xsl:call-template>
    </xsl:template>
    <xsl:template match="htmlForm">
        <xsl:element name="form">
            <!-- marks the form as processed -->
            <xsl:attribute name="processed"/>
            <xsl:attribute name="method">POST</xsl:attribute>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="form//group">
        <fieldset><xsl:apply-templates select="@*|node()"/></fieldset>
    </xsl:template>
    <xsl:template match="form//group/title">
        <legend><xsl:apply-templates select="@*|node()"/></legend>
    </xsl:template>
    <xsl:template match="form//field/title">
        <xsl:apply-templates/>
    </xsl:template>
    <xsl:template match="form//field">
        <div>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">formField <xsl:value-of select="@class"/></xsl:attribute>
            <label><xsl:apply-templates/></label>
            <xsl:element name="input">
                <xsl:apply-templates select="@*"/>
            </xsl:element>
        </div>
    </xsl:template>
    <xsl:template match="form//field[@type='select']">
        <div>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">formField <xsl:value-of select="@class"/></xsl:attribute>
            <label> <xsl:value-of select="@title"/> </label>
            <xsl:element name="select">
                <xsl:apply-templates select="@*|option"/>
            </xsl:element>
        </div>
    </xsl:template>
    <xsl:template match="form//field[@type='checkbox']">
        <div>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">formField <xsl:value-of select="@class"/></xsl:attribute>
            <label><xsl:apply-templates/></label>
            <xsl:element name="input">
                <xsl:apply-templates select="@*"/>
            </xsl:element>
        </div>
    </xsl:template>
    <xsl:template match="form//field[@type='hidden']">
        <xsl:element name="input">
            <xsl:apply-templates select="@*"/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="form//field[@type='textarea']">
        <div>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">formField <xsl:value-of select="@class"/></xsl:attribute>
            <label><xsl:apply-templates/></label>
            <xsl:element name="textarea"><xsl:apply-templates select="@*"/></xsl:element>
        </div>
    </xsl:template>
    <xsl:template match="form[not(@processed)]//button">
        <xsl:element name="a">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">button <xsl:value-of select="@class"/></xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="form[not(@processed)]//imageButton">
        <xsl:element name="a">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">button imageButton <xsl:value-of select="@class"/></xsl:attribute>
            <div class="image"/>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="form[not(@processed)]//button[@type='submit']">
        <xsl:element name="button">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">button imageButton okay<xsl:value-of select="@class"/></xsl:attribute>
            <div class="image"/>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="form[not(@processed)]//button[@type='cancel']">
        <xsl:element name="a">
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="class">button imageButton cancel<xsl:value-of select="@class"/></xsl:attribute>
            <div class="image"/>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="input/@name | form/@name | select/@name | textarea/@name"/>
    <xsl:template match="input">
        <xsl:copy>
            <xsl:attribute name="name">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:attribute name="value">{{<xsl:value-of select="@id"/>}}</xsl:attribute>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="input[@type='checkbox']">
        <xsl:variable name="lcValue">{{<xsl:value-of select="@id"/>}}</xsl:variable>
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="name">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:attribute name="value">true</xsl:attribute>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="input[@type='checkbox']/@checked">
        <xsl:if test=". = 'true'">
            <xsl:copy/>
        </xsl:if>
    </xsl:template>
    <xsl:template match="select">
        <xsl:copy>
            <xsl:attribute name="name">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:attribute name="value">{{<xsl:value-of select="@id"/>}}</xsl:attribute>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="select/option">
        <xsl:copy>
            <xsl:attribute name="value"><xsl:value-of select="@id"/></xsl:attribute>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="select/option[../@selected = ./@id]">
        <xsl:copy>
            <xsl:attribute name="value"><xsl:value-of select="@id"/></xsl:attribute>
            <xsl:attribute name="selected"/>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="textarea">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="name">
                <xsl:value-of select="@id"/>
            </xsl:attribute>{{<xsl:value-of select="@id"/>}}</xsl:copy>
    </xsl:template>


    <!-- END FORM CONTROL -->

</xsl:stylesheet>